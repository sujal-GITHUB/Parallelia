# Parallelia

**Parallelia** is a 2D metaverse platform inspired by Gather Town, designed to simulate real-life, in-person social interactions within interactive virtual spaces. It enables users to navigate virtual environments, interact with objects, and socialize in a shared online world.

---

## Project Overview

Parallelia is an immersive multiplayer game featuring real-time movement, interaction, and customizable spaces. Users can create and join virtual spaces, customize avatars, and place interactive elements in these spaces. The system supports collision detection, synchronized state updates, and an extendable architecture for building rich virtual environments.

---

## Key Features

- **Real-Time Multiplayer Interaction:** Users navigate spaces using keyboard controls, with instant updates on movements and interactions.
- **Customizable Spaces:** Create, edit, and manage virtual spaces by adding various elements such as furniture and decorations.
- **Avatar Management:** Assign and customize avatars representing users in the virtual environment.
- **Collision Handling:** Prevent users from moving into walls, static objects, or colliding with other users.
- **Dynamic Layouts:** Spaces are based on maps with predefined layouts that can be extended with new elements.
- **Admin Capabilities:** Creation and management of maps, avatars, and elements via administrative APIs.
- **Secure Authentication:** User signup and signin with JWT-based authentication for protected endpoints.

---

## Architecture

- **Frontend:** Real-time client built to render and control user movement, interaction, and visualization of spaces and avatars.
- **Backend:** Node.js/Express server handling user authentication, space management, event broadcasting, and collision detection.
- **Database:** PostgreSQL managed with Prisma ORM, storing users, spaces, elements, maps, and avatars with well-defined relations.
- **Real-Time Communication:** WebSocket or equivalent for low-latency event transmission (movement, joins, leaves).

---

## Database Schema (Prisma)

- **User:** Stores user credentials, roles, avatar assignment, and related spaces.
- **Space:** Virtual rooms created by users, containing placed elements.
- **SpaceElement:** Positions elements (objects) within a space with coordinates.
- **Element:** Reusable objects such as furniture, with dimensions and properties.
- **Map:** Defines layouts where elements can be placed.
- **MapElement:** Positions elements within a map.
- **Avatar:** Visual representations assigned to users.
  
---

## Authentication & Security

- All endpoints requiring authentication expect an `Authorization` header with a Bearer token.
- JWT tokens issued on successful signin.

---

## Future Enhancements

- Real-time voice and video chat integration.
- AI-driven NPCs and interactive elements.
- Advanced physics and environment effects.
- Export/import space layouts.
- Enhanced user profile and social features.

## License

- This project is licensed under the MIT License.

