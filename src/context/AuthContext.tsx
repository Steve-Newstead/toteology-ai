
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isGuest: boolean;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    const guestMode = localStorage.getItem('guestMode');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsGuest(false);
    } else if (guestMode === 'true') {
      setIsGuest(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // This is mocked authentication
      // In a real app, you'd make a fetch request to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation for demo purposes
      if (email === 'demo@example.com' && password === 'password') {
        const newUser = { id: '1', email, name: 'Demo User' };
        setUser(newUser);
        setIsGuest(false);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.removeItem('guestMode');
        toast.success('Successfully logged in');
        return true;
      }
      
      toast.error('Invalid email or password');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = { id: Date.now().toString(), email, name };
      setUser(newUser);
      setIsGuest(false);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.removeItem('guestMode');
      toast.success('Registration successful');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('user');
    localStorage.removeItem('guestMode');
    toast.success('Logged out successfully');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
    toast.success('Continuing as guest');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      isGuest, 
      continueAsGuest 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
