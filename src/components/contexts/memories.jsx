import { createContext, useContext, useState } from 'react';

// Create the context
const MemoriesContext = createContext();

// Provider component
export const MemoriesProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);

  // Function to add a new memory
  const addMemory = (newMemory) => {
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
  if (!context) {
    throw new Error('useMemories must be used within a MemoriesProvider');
  }
  return context;
};
