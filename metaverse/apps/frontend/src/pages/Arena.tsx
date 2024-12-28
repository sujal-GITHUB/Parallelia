import React, { useEffect, useRef, useState } from 'react';

interface SpaceData {
  spaceId: string;
  name: string;
  dimensions: string;
  mapName?: string; // Map name is optional
}

interface ArenaProps {
  spaceData: SpaceData; // spaceData is passed directly as a prop
}

const Arena: React.FC<ArenaProps> = ({ spaceData }) => {
  const canvasRef = useRef<any>(null);
  const divRef = useRef<any>(null); // Ref for the div
  const wsRef = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<Map<string, any>>(new Map());

  // Initialize WebSocket connection and join the space
  useEffect(() => {
    // Initialize WebSocket
    wsRef.current = new WebSocket('ws://localhost:3001'); // Replace with your WS_URL

    wsRef.current.onopen = () => {
      // Join the space once connected
      wsRef.current.send(JSON.stringify({
        type: 'join',
        payload: {
          spaceId: spaceData.spaceId,
          token: localStorage.getItem('authToken') // Pass your token here if needed
        }
      }));
    };

    wsRef.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [spaceData.spaceId]);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'space-joined':
        // Initialize current user position and other users
        setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: message.payload.userId
        });
  
        // Initialize other users from the payload
        const userMap = new Map();
        message.payload.users.forEach((user: any) => {
          userMap.set(user.userId, user);
        });
        setUsers(userMap);
        break;
  
      case 'user-joined':
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.set(message.payload.userId, {
            x: message.payload.x,
            y: message.payload.y,
            userId: message.payload.userId
          });
          return newUsers;
        });
        break;
  
      case 'movement':
        setUsers(prev => {
          const newUsers = new Map(prev);
          const user = newUsers.get(message.payload.userId);
          if (user) {
            user.x = message.payload.x;
            user.y = message.payload.y;
            newUsers.set(message.payload.userId, user);
          }
          return newUsers;
        });
        break;
  
      case 'movement-rejected':
        // Reset current user position if movement was rejected
        setCurrentUser((prev: any) => (prev ? { ...prev, x: message.payload.x, y: message.payload.y } : prev));
        break;
  
      case 'user-left':
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
        break;
    }
  };  

  // Handle user movement
  const handleMove = (newX: any, newY: any) => {
    if (!currentUser) return;
  
    // Check if the new position is within the map boundaries
    const gridSize = 50; // Assuming each grid cell is 50x50
    const maxX = canvasRef.current.width / gridSize;
    const maxY = canvasRef.current.height / gridSize;
  
    // Prevent moving outside the boundaries
    if (newX < 0 || newX >= maxX || newY < 0 || newY >= maxY) {
      return; // Do not send movement if out of bounds
    }
  
    // Send movement request if within bounds
    wsRef.current.send(JSON.stringify({
      type: 'move',
      payload: {
        x: newX,
        y: newY,
        userId: currentUser.userId
      }
    }));
  };

  // Draw the arena
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const backgroundImage = new Image();
    backgroundImage.src = 'map.png'; // Ensure correct path to background image

    // Wait for the background image to load before drawing
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#eee';
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw current user
      if (currentUser && currentUser.x != null && currentUser.y != null) {
        ctx.beginPath();
        ctx.fillStyle = '#FF6B6B';
        ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('You', currentUser.x * 50, currentUser.y * 50 + 40);
      }

      // Draw other users
      users.forEach(user => {
        if (user.x != null && user.y != null) {
          ctx.beginPath();
          ctx.fillStyle = '#4ECDC4';
          ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 + 40);
        }
      });
    };
  }, [currentUser, users]);

  const handleKeyDown = (e: any) => {
    if (!currentUser) return;

    const { x, y } = currentUser;
    switch (e.key) {
      case 'ArrowUp':
        handleMove(x, y - 1);
        break;
      case 'ArrowDown':
        handleMove(x, y + 1);
        break;
      case 'ArrowLeft':
        handleMove(x - 1, y);
        break;
      case 'ArrowRight':
        handleMove(x + 1, y);
        break;
    }
  };

  // Focus the div on mount
  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="p-4 bg-[#301067] min-h-screen"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h1 className="text-2xl font-normal mb-4 text-white font-pressstart">{spaceData.name}</h1>
      <div className="mb-4 font-inter font-semibold">
        <p className="text-sm text-white">Connected Users: {users.size + (currentUser ? 1 : 0)}</p>
      </div>
      <div className="border rounded-lg min-h-screen overflow-auto" style={{ width: '100%' }}>
        <canvas
          ref={canvasRef}
          width={2000}
          height={2000}
          className="bg-white"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
    </div>
  );
};

export default Arena;
