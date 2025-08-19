import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
      
      // Check if user was previously logged in (demo purposes)
      const savedUser = global.localStorage?.getItem('demoUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo authentication - accept any email/password
    const demoUser: User = {
      id: '1',
      email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role: 'Survey Administrator',
    };
    
    setUser(demoUser);
    global.localStorage?.setItem('demoUser', JSON.stringify(demoUser));
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const demoUser: User = {
      id: '1',
      email,
      name,
      role: 'Survey Administrator',
    };
    
    setUser(demoUser);
    global.localStorage?.setItem('demoUser', JSON.stringify(demoUser));
    setIsLoading(false);
  };

  const signOut = () => {
    setUser(null);
    global.localStorage?.removeItem('demoUser');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}