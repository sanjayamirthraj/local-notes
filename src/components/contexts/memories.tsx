import { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of a Memory object
type Memory = {
  lat: number;
  lng: number;
  message: string;
};

// Define the context state type
interface MemoriesContextType {
  memories: Memory[];
  addMemory: (memory: Memory) => void;
}

// Create the context with a default value (empty object cast to the correct type)
const MemoriesContext = createContext<MemoriesContextType | undefined>(undefined);

// Provider component to wrap the app
export const MemoriesProvider = ({ children }: { children: ReactNode }) => {
  const [memories, setMemories] = useState<Memory[]>([]);

  // Function to add a new memory
  const addMemory = (newMemory: Memory) => {
    setMemories((prevMemories) => [...prevMemories, newMemory]);
  };

  return (
    <MemoriesContext.Provider value={{ memories, addMemory }}>
      {children}
    </MemoriesContext.Provider>
  );
};

// Custom hook to use the Memories context
export const useMemories = () => {
  const context = useContext(MemoriesContext);
  
  // If the context is not found, throw an error (i.e., if used outside the provider)
  if (!context) {
    throw new Error('useMemories must be used within a MemoriesProvider');
  }

  return context;
};
