import { createContext, useContext, useState } from "react";

const AuthContext = createContext(); // Create a context for authentication state

// Provider component to wrap around components that need auth access

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the current user object

  // Use this to set or clear the authenticated user
  const setAuth = (authUser) => {
    setUser(authUser);
  };

  const setUserData = (userData) => {
    setUser({ ...userData });
  };
  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

//  Custom hook to consume auth context
export const useAuth = () => useContext(AuthContext);
