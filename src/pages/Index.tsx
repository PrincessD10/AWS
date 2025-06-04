
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Zap, Users, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />;
  }

  if (showSignup) {
    return <SignupForm onBack={() => setShowSignup(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DocuTrack Pro</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={() => setShowLogin(true)}>
                Sign In
              </Button>
              <Button onClick={() => setShowSignup(true)} className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Automate Document
              <span className="text-blue-600 block">Processing with AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your document workflow with intelligent OCR, automated data extraction, 
              and seamless collaboration. Process Word, PDF, PowerPoint, Excel files, and images 
              with enterprise-grade efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowSignup(true)}
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              >
                Begin Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowLogin(true)}
                className="text-lg px-8 py-3"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Organizations
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to streamline document processing and management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>AI-Powered OCR</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Extract text and data from documents automatically using advanced AI technology
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Multi-Format Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Process Word, PDF, PowerPoint, Excel files, and images seamlessly
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Role-Based Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure workflows with user roles and permissions for different departments
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Real-Time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor document status and receive automated deadline notifications
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Streamline Your Document Workflow
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Automated Processing</h3>
                    <p className="text-gray-600">Reduce manual work by 80% with intelligent document processing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Enhanced Collaboration</h3>
                    <p className="text-gray-600">Real-time updates and notifications keep teams synchronized</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Compliance Ready</h3>
                    <p className="text-gray-600">Built-in audit trails and security features for regulatory compliance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of organizations already using DocuTrack Pro
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setShowSignup(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create Your Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">DocuTrack Pro</span>
            </div>
            <p className="text-gray-400">
              Intelligent Document Processing for Modern Organizations
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
