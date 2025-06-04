
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Clock, CheckCircle, AlertCircle, LogOut, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DocumentUpload from '@/components/documents/DocumentUpload';

interface UserDashboardProps {
  user: { email: string; role: string };
  onLogout: () => void;
}

const UserDashboard = ({ user, onLogout }: UserDashboardProps) => {
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  // Mock document data
  const documents = [
    {
      id: 1,
      name: 'Contract_Application.pdf',
      status: 'processing',
      submittedDate: '2024-01-15',
      expectedCompletion: '2024-01-20',
      assignedTo: 'Legal Department'
    },
    {
      id: 2,
      name: 'Insurance_Claim.docx',
      status: 'completed',
      submittedDate: '2024-01-10',
      completedDate: '2024-01-18',
      assignedTo: 'Insurance Department'
    },
    {
      id: 3,
      name: 'Tax_Documents.xlsx',
      status: 'pending',
      submittedDate: '2024-01-20',
      assignedTo: 'Finance Department'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (showUpload) {
    return <DocumentUpload onBack={() => setShowUpload(false)} userRole="user" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DocuTrack Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">Submit and track your document processing requests</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowUpload(true)}>
            <CardHeader className="text-center">
              <Upload className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>Submit New Document</CardTitle>
              <CardDescription>Upload documents for processing</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
              <CardTitle>Pending Documents</CardTitle>
              <CardDescription>{documents.filter(d => d.status === 'pending').length} documents awaiting assignment</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle>Completed</CardTitle>
              <CardDescription>{documents.filter(d => d.status === 'completed').length} documents processed</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Document List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Documents</CardTitle>
              <CardDescription>Track the status of your submitted documents</CardDescription>
            </div>
            <Button onClick={() => setShowUpload(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Submit Document
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-500">Submitted: {doc.submittedDate}</p>
                      <p className="text-sm text-gray-500">Assigned to: {doc.assignedTo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(doc.status)} flex items-center gap-1`}>
                      {getStatusIcon(doc.status)}
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </Badge>
                    {doc.status === 'processing' && (
                      <p className="text-xs text-gray-500 mt-1">Expected: {doc.expectedCompletion}</p>
                    )}
                    {doc.status === 'completed' && (
                      <p className="text-xs text-gray-500 mt-1">Completed: {doc.completedDate}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
