
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, FileText, Image, Download, Zap, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onBack: () => void;
  userRole: string;
}

const DocumentUpload = ({ onBack, userRole }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File Selected",
        description: `${selectedFile.name} is ready for processing`,
      });
    }
  };

  const handleExtractData = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Mock extracted data based on file type
      const mockData = {
        filename: file.name,
        fileType: file.type,
        extractedText: "Sample extracted text from the document. This would be the actual OCR results from the AI system.",
        keyData: {
          documentType: "Contract",
          date: "2024-01-20",
          parties: ["Company A", "Company B"],
          amount: "$50,000",
          terms: "12 months"
        },
        confidence: 0.95
      };
      
      setExtractedData(mockData);
      setIsExtracted(true);
      setIsProcessing(false);
      
      toast({
        title: "Data Extraction Complete",
        description: "AI has successfully extracted key information from your document",
      });
    }, 3000);
  };

  const handleDownload = (format: 'word' | 'pdf') => {
    toast({
      title: "Download Started",
      description: `Downloading extracted data as ${format.toUpperCase()} file...`,
    });
    
    // Simulate download
    const element = document.createElement('a');
    const content = `
      Extracted Document Data
      
      Filename: ${extractedData?.filename}
      Document Type: ${extractedData?.keyData?.documentType}
      Date: ${extractedData?.keyData?.date}
      
      Extracted Text:
      ${extractedData?.extractedText}
      
      Key Information:
      - Parties: ${extractedData?.keyData?.parties?.join(', ')}
      - Amount: ${extractedData?.keyData?.amount}
      - Terms: ${extractedData?.keyData?.terms}
      
      Confidence Level: ${Math.round((extractedData?.confidence || 0) * 100)}%
    `;
    
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `extracted_data.${format === 'word' ? 'txt' : 'txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to submit",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Document Submitted",
      description: "Your document has been submitted for processing",
    });
    
    // Return to dashboard after submission
    setTimeout(() => {
      onBack();
    }, 2000);
  };

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
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Processing</h1>
          <p className="text-gray-600 mt-2">Upload, extract data, and process documents with AI</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Upload Word, PDF, PowerPoint, Excel files, or images for processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="file">Select File</Label>
                  <div className="mt-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                      className="cursor-pointer"
                    />
                  </div>
                  {file && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                      {file.type.startsWith('image/') ? (
                        <Image className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the document or any special processing requirements..."
                    rows={3}
                  />
                </div>

                {userRole !== 'user' && (
                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    onClick={handleExtractData}
                    disabled={!file || isProcessing}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Extracting Data...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Extract Data with AI
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={!file}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Document
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Extraction Results */}
          <Card>
            <CardHeader>
              <CardTitle>AI Extraction Results</CardTitle>
              <CardDescription>
                View extracted data and download in your preferred format
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isExtracted && !isProcessing && (
                <div className="text-center py-12 text-gray-500">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Upload a file and click "Extract Data with AI" to see results here</p>
                </div>
              )}

              {isProcessing && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">AI is processing your document...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              )}

              {isExtracted && extractedData && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Extraction Successful</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Document Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Type:</span> {extractedData.keyData.documentType}</p>
                      <p><span className="font-medium">Date:</span> {extractedData.keyData.date}</p>
                      <p><span className="font-medium">Confidence:</span> {Math.round(extractedData.confidence * 100)}%</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Key Data Extracted</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Parties:</span> {extractedData.keyData.parties.join(', ')}</p>
                      <p><span className="font-medium">Amount:</span> {extractedData.keyData.amount}</p>
                      <p><span className="font-medium">Terms:</span> {extractedData.keyData.terms}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Extracted Text Preview</h4>
                    <p className="text-sm text-gray-600">{extractedData.extractedText}</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Download Extracted Data</h4>
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleDownload('word')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download as Word
                      </Button>
                      <Button
                        onClick={() => handleDownload('pdf')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download as PDF
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
