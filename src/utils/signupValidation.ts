import { SignupFormData } from '@/types/signup';

export const validateSignupForm = (formData: SignupFormData) => {
  const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'role'];
  
  // Add organization and department as required for non-user roles
  if (formData.role !== 'user') {
    requiredFields.push('organization');
    requiredFields.push('department');
  }
  
  const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
  
  if (missingFields.length > 0) {
    return { isValid: false, error: 'Missing required fields' };
  }

  if (formData.password !== formData.confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true, error: null };
};