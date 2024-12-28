import React, { useState, FormEvent, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Alert, AlertDescription } from '../components/ui/Alert';
import { useNavigate } from 'react-router-dom';
import { joinSpace, spaceCreate } from '../api/api';

interface FormState {
  spaceName: string;
  dimensions: string;
  mapName?: string; 
  error: string;
  success: string;
}

const SpacePage: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    spaceName: '',
    dimensions: '',
    mapName: '',  // Optional map name
    error: '',
    success: '',
  });
  const [alertShown, setAlertShown] = useState(false);

  const navigate = useNavigate();  // Correct placement of useNavigate

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token && !alertShown) {
      setAlertShown(true);
      alert('Please sign in first');
      navigate('/');  // Correct placement of navigate
    }
  }, [navigate, alertShown]);

  const handleJoinSpace = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    if (!formState.spaceName.trim()) {
      setFormState((prev) => ({
        ...prev,
        error: "Please enter a space name",
        success: "",
      }));
      return;
    }
  
    setFormState((prev) => ({
      ...prev,
      success: `Joining space "${formState.spaceName}"...`,
      error: "",
    }));
  
    const payload = {
      spaceName: formState.spaceName,
      mapName: formState.mapName || " ", // If mapName is empty, set to whitespace
    };
  
    try {
      const response = await joinSpace(payload);
  
      if (!response || !response.success || !response.data) {
        setFormState((prev) => ({
          ...prev,
          error: response?.message || "Failed to join space",
          success: "",
        }));
        return;
      }
  
      setFormState((prev) => ({
        ...prev,
        success: `Space Successfully Joined`,
        error: "",
      }));
      
      navigate('/arena', { state: { spaceData: response.data } });
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to join space";
      setFormState((prev) => ({
        ...prev,
        error: errorMessage,
        success: "",
      }));
      console.error("Error joining space:", error);
    }
  };

  const handleCreateSpace = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
  
    if (!formState.spaceName.trim() || !formState.dimensions.trim()) {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Please enter both space name and dimensions', 
        success: '' 
      }));
      return;
    }
  
    setFormState(prev => ({
      ...prev,
      success: `Creating space "${formState.spaceName}" with dimensions ${formState.dimensions}...`,
      error: ''
    }));
  
    const payload = {
      spaceName: formState.spaceName,
      dimensions: formState.dimensions,
      mapName: formState.mapName || '',  // Include map name if provided, else empty string
    };
  
    try {
      // Call the spaceCreate function and get the spaceId
      const response = await spaceCreate(payload);
  
      // Check if response is valid and contains spaceId
      if (!response || !response.success || !response.data?.spaceId) {
        setFormState(prev => ({ 
          ...prev, 
          error: 'Space creation failed', 
          success: '' 
        }));
        return;
      }
  
      const spaceId = response.data.spaceId;
  
      // Save the spaceId and space data in the state via navigate
      const spaceData = {
        spaceId,
        spaceName: formState.spaceName,
        dimensions: formState.dimensions,
        mapName: formState.mapName || '',  // Use the provided mapName
      };
  
      // Redirect to the /arena page and pass the space data
      navigate('/arena', { state: { spaceData } });
  
      // Update form state with success message
      setFormState(prev => ({
        ...prev,
        success: `Space created successfully with ID: ${spaceId}`,
        error: '',
      }));
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create space';
      setFormState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        success: '' 
      }));
      console.error('Error creating space:', error);
    }
  };
  
  const handleInputChange = (field: keyof Pick<FormState, 'spaceName' | 'dimensions' | 'mapName'>) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setFormState(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleLogout = (): void => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center p-4 relative">
      <video
        src="video2.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
      />
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className='flex justify-center'>
          <div className='flex justify-center'>
            <img src="logo.png" width={70} alt="logo" />
          </div>
          <CardTitle className='text-white text-center'>Welcome to Spaces</CardTitle>
          <CardDescription className='text-center'>Join an existing space or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="join">Join Space</TabsTrigger>
              <TabsTrigger value="create">Create Space</TabsTrigger>
            </TabsList>

            <TabsContent value="join">
              <form onSubmit={handleJoinSpace} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Space Name</label>
                  <Input
                    type="text"
                    placeholder="Enter space name"
                    value={formState.spaceName}
                    onChange={handleInputChange('spaceName')}
                  />
                </div>
                <Button type="submit" className="w-full">Join Space</Button>
              </form>
            </TabsContent>

            <TabsContent value="create">
              <form onSubmit={handleCreateSpace} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Space Name</label>
                  <Input
                    type="text"
                    placeholder="Enter space name"
                    value={formState.spaceName}
                    onChange={handleInputChange('spaceName')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Dimensions</label>
                  <Input
                    type="text"
                    placeholder="Enter dimensions (e.g., 20x20)"
                    value={formState.dimensions}
                    onChange={handleInputChange('dimensions')}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Map Name (Optional)</label>
                  <Input
                    type="text"
                    placeholder="Enter map name (optional)"
                    value={formState.mapName}
                    onChange={handleInputChange('mapName')}
                  />
                </div>
                <Button type="submit" className="w-full">Create Space</Button>
              </form>
            </TabsContent>
          </Tabs>

          {formState.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{formState.error}</AlertDescription>
            </Alert>
          )}

          {formState.success && (
            <Alert className="mt-4 bg-transparent text-green-500">
              <AlertDescription>{formState.success}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full mt-4 bg-red-500 hover:bg-red-600" onClick={handleLogout}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpacePage;
