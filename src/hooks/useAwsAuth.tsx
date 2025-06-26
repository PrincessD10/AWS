import { useState, useEffect, createContext, useContext } from 'react';
import { awsApiService } from '@/services/awsApiService';
import { useToast } from '@/hooks/use-toast';

interface AwsUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'processing-staff' | 'deputy-director';
}

interface AwsAuthContextType {
  user: AwsUser | null;
  loading: boolean;
  token: string | null;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'processing-staff' | 'deputy-director';
  organization?: string;
  department?: string;
}

const AwsAuthContext = createContext<AwsAuthContextType | undefined>(undefined);

export const AwsAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AwsUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored auth data on app start
    const storedToken = localStorage.getItem('aws_auth_token');
    const storedUser = localStorage.getItem('aws_auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('aws_auth_token');
        localStorage.removeItem('aws_auth_user');
      }
    }
    
    setLoading(false);
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      
      // Create the registration payload, including department for all non-user roles
      const registrationData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        ...(data.organization && { organization: data.organization }),
        ...(data.department && { department: data.department }),
      };

      const response = await awsApiService.register(registrationData);

      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }

      toast({
        title: "Registration Successful",
        description: "Please sign in with your new account.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await awsApiService.login({ email, password });

      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }

      // Assuming the response contains user data and token
      const { user: userData, token: authToken } = response.data;
      
      setUser(userData);
      setToken(authToken);
      
      // Store auth data
      localStorage.setItem('aws_auth_token', authToken);
      localStorage.setItem('aws_auth_user', JSON.stringify(userData));

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aws_auth_token');
    localStorage.removeItem('aws_auth_user');
    
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  const value = {
    user,
    loading,
    token,
    signUp,
    signIn,
    signOut,
  };

  return <AwsAuthContext.Provider value={value}>{children}</AwsAuthContext.Provider>;
};

export const useAwsAuth = () => {
  const context = useContext(AwsAuthContext);
  if (context === undefined) {
    throw new Error('useAwsAuth must be used within an AwsAuthProvider');
  }
  return context;
};