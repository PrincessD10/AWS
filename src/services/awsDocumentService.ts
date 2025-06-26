import { awsApiService } from './awsApiService';
import { Document, DocumentOperations } from '@/types/document';

class AwsDocumentService implements DocumentOperations {
  private getAuthToken(): string | null {
    return localStorage.getItem('aws_auth_token');
  }

  private getUserEmail(): string {
    const userStr = localStorage.getItem('aws_auth_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.email || 'Unknown';
      } catch {
        return 'Unknown';
      }
    }
    return 'Unknown';
  }

  async loadDocument(id: string): Promise<Document | null> {
    try {
      console.log(`Loading document with ID: ${id} from AWS API`);
      
      const token = this.getAuthToken();
      if (!token) {
        console.error('No authentication token found for AWS API call');
        throw new Error('Authentication required');
      }

      const response = await awsApiService.getDocuments(token);
      
      if (!response.success) {
        console.error('Failed to load documents from AWS:', response.error);
        throw new Error(response.error || 'Failed to load document');
      }

      const documents = Array.isArray(response.data) ? response.data : [];
      const document = documents.find((doc: any) => doc.id === id);
      
      if (!document) {
        console.log(`Document with ID ${id} not found in AWS`);
        return null;
      }
      
      return this.mapAwsDocumentToDocument(document);
    } catch (error) {
      console.error('Error loading document from AWS:', error);
      throw error;
    }
  }

  async saveDocument(document: Document): Promise<boolean> {
    try {
      console.log('Saving document to AWS:', document.id);
      
      const token = this.getAuthToken();
      if (!token) {
        console.error('No authentication token found for AWS API call');
        return false;
      }
      
      const updateData = {
        name: document.name,
        content: document.content,
        status: document.status as 'assigned' | 'in-progress' | 'completed',
        priority: document.priority,
      };
      
      const response = await awsApiService.updateDocument(document.id, updateData, token);
      
      if (response.success) {
        console.log('Document saved successfully to AWS');
        return true;
      } else {
        console.error('Failed to save document to AWS:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Error saving document to AWS:', error);
      return false;
    }
  }

  async createNewVersion(id: string, content: string, notes?: string): Promise<boolean> {
    try {
      console.log(`Creating new version for document ${id} in AWS`);
      
      const token = this.getAuthToken();
      if (!token) {
        console.error('No authentication token found for AWS API call');
        return false;
      }

      const document = await this.loadDocument(id);
      if (!document) {
        console.error('Document not found in AWS for version creation');
        return false;
      }
      
      // Update the document with new content and increment version
      const updateData = {
        name: document.name,
        content,
        status: 'in-progress' as const,
        priority: document.priority,
      };
      
      const response = await awsApiService.updateDocument(id, updateData, token);
      
      if (response.success) {
        console.log('New version created successfully in AWS');
        return true;
      } else {
        console.error('Failed to create new version in AWS:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Error creating new version in AWS:', error);
      return false;
    }
  }

  async uploadDocument(file: File, metadata: Partial<Document>): Promise<Document> {
    try {
      console.log('Uploading document to AWS:', file.name);
      
      const token = this.getAuthToken();
      if (!token) {
        console.error('No authentication token found for AWS API call');
        throw new Error('Authentication required');
      }
      
      const content = await this.readFileContent(file);
      const userEmail = this.getUserEmail();
      
      const documentData = {
        name: metadata.name || file.name,
        content,
        clientName: metadata.clientName || userEmail,
        department: metadata.department || 'General',
        priority: metadata.priority || 'medium' as const,
        deadline: metadata.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      
      console.log('Sending document data to AWS API:', {
        name: documentData.name,
        clientName: documentData.clientName,
        department: documentData.department,
        priority: documentData.priority,
        deadline: documentData.deadline,
        contentLength: documentData.content.length
      });
      
      const response = await awsApiService.createDocument(documentData, token);
      
      if (response.success && response.data) {
        console.log('Document uploaded successfully to AWS:', response.data);
        
        const newDocument: Document = {
          id: response.data.id || Date.now().toString(),
          name: documentData.name,
          content: documentData.content,
          type: this.getFileType(file.name),
          clientName: documentData.clientName,
          status: 'assigned',
          priority: documentData.priority,
          assignedDate: new Date().toISOString().split('T')[0],
          deadline: documentData.deadline,
          department: documentData.department,
          versions: [{
            version: 1,
            content: documentData.content,
            modifiedBy: userEmail,
            modifiedDate: new Date().toISOString(),
          }],
          currentVersion: 1,
          uploadedBy: userEmail,
          lastModified: new Date().toISOString(),
        };
        
        return newDocument;
      } else {
        console.error('AWS API upload failed:', response.error);
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading document to AWS:', error);
      throw error;
    }
  }

  async getAllDocuments(): Promise<Document[]> {
    try {
      console.log('Fetching all documents from AWS API');
      
      const token = this.getAuthToken();
      if (!token) {
        console.error('No authentication token found for AWS API call');
        return [];
      }
      
      const response = await awsApiService.getDocuments(token);
      
      if (response.success && response.data) {
        const documents: Document[] = Array.isArray(response.data) 
          ? response.data.map((doc: any) => this.mapAwsDocumentToDocument(doc))
          : [];
        
        console.log(`Retrieved ${documents.length} documents from AWS API`);
        return documents;
      } else {
        console.error('Failed to fetch documents from AWS:', response.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching documents from AWS:', error);
      return [];
    }
  }

  async deleteDocument(id: string): Promise<boolean> {
    try {
      console.log(`Deleting document with ID: ${id} from AWS`);
      
      const token = this.getAuthToken();
      if (!token) {
        console.error('No authentication token found for AWS API call');
        return false;
      }
      
      const response = await awsApiService.deleteDocument(id, token);
      
      if (response.success) {
        console.log('Document deleted successfully from AWS');
        return true;
      } else {
        console.error('Failed to delete document from AWS:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting document from AWS:', error);
      return false;
    }
  }

  async downloadDocument(id: string, format: 'pdf' | 'docx'): Promise<string> {
    try {
      console.log(`Downloading document ${id} in ${format} format from AWS`);
      
      const document = await this.loadDocument(id);
      if (!document) {
        throw new Error('Document not found in AWS');
      }
      
      // Create a blob URL with the document content from AWS
      const blob = new Blob([document.content], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = URL.createObjectURL(blob);
      
      console.log('Document download URL created from AWS data');
      return url;
    } catch (error) {
      console.error('Error downloading document from AWS:', error);
      throw error;
    }
  }

  private mapAwsDocumentToDocument(awsDoc: any): Document {
    return {
      id: awsDoc.id || Date.now().toString(),
      name: awsDoc.name || 'Untitled',
      content: awsDoc.content || '',
      type: this.getFileType(awsDoc.name || ''),
      clientName: awsDoc.clientName || awsDoc.client_name || 'Unknown Client',
      status: awsDoc.status || 'assigned',
      priority: awsDoc.priority || 'medium',
      assignedDate: awsDoc.assignedDate || awsDoc.assigned_date || new Date().toISOString().split('T')[0],
      deadline: awsDoc.deadline || new Date().toISOString().split('T')[0],
      department: awsDoc.department || 'General',
      versions: awsDoc.versions || [{
        version: 1,
        content: awsDoc.content || '',
        modifiedBy: awsDoc.uploadedBy || awsDoc.uploaded_by_email || 'Unknown',
        modifiedDate: awsDoc.lastModified || awsDoc.updated_at || new Date().toISOString(),
      }],
      currentVersion: awsDoc.currentVersion || awsDoc.current_version || 1,
      uploadedBy: awsDoc.uploadedBy || awsDoc.uploaded_by_email || 'Unknown',
      lastModified: awsDoc.lastModified || awsDoc.updated_at || new Date().toISOString(),
    };
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  private getFileType(filename: string): 'pdf' | 'doc' | 'docx' | 'txt' | 'other' {
    const extension = filename.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'doc': return 'doc';
      case 'docx': return 'docx';
      case 'txt': return 'txt';
      default: return 'other';
    }
  }
}

export const awsDocumentService = new AwsDocumentService();