
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserDashboard from '@/components/dashboards/UserDashboard';
import ProcessingStaffDashboard from '@/components/dashboards/ProcessingStaffDashboard';
import DeputyDirectorDashboard from '@/components/dashboards/DeputyDirectorDashboard';

interface LoginFormProps {
  onBack: () => void;
}

const LoginForm = ({ onBack }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate login
    setCurrentUser({ email, role });
    toast({
      title: "Login Successful",
      description: `Welcome back! Redirecting to ${role} dashboard...`
    });
  };

  // Render appropriate dashboard based on role
  if (currentUser) {
    switch (currentUser.role) {
      case 'user':
        return <UserDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
      case 'processing-staff':
        return <ProcessingStaffDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
      case 'deputy-director':
        return <DeputyDirectorDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
      default:
        return <UserDashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">DocuTrack Pro</span>
            </div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Access your document management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User (Client)</SelectItem>
                    <SelectItem value="processing-staff">Processing Staff</SelectItem>
                    <SelectItem value="deputy-director">Deputy Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
