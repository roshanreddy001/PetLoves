/**
 * Email validation utilities for PetLoves application
 * Only accepts Gmail addresses in the format xyz@gmail.com
 */

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates if the email is a valid Gmail address
 * @param email - The email address to validate
 * @returns EmailValidationResult object with validation status and error message
 */
export const validateGmailEmail = (email: string): EmailValidationResult => {
  // Remove whitespace and convert to lowercase
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if email is empty
  if (!normalizedEmail) {
    return {
      isValid: false,
      error: 'Email is required'
    };
  }
  
  // Gmail regex pattern: allows letters, numbers, dots, plus signs, and underscores before @gmail.com
  const gmailRegex = /^[a-zA-Z0-9._+-]+@gmail\.com$/;
  
  // Check if email matches Gmail pattern
  if (!gmailRegex.test(normalizedEmail)) {
    return {
      isValid: false,
      error: 'Only Gmail accounts are accepted. Please use an email in the format: xyz@gmail.com'
    };
  }
  
  // Additional validation: check for valid characters and structure
  const localPart = normalizedEmail.split('@')[0];
  
  // Check if local part is not empty
  if (!localPart || localPart.length === 0) {
    return {
      isValid: false,
      error: 'Invalid email format. Please use a valid Gmail address: xyz@gmail.com'
    };
  }
  
  // Check if local part doesn't start or end with dots
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return {
      isValid: false,
      error: 'Gmail address cannot start or end with a dot'
    };
  }
  
  // Check for consecutive dots
  if (localPart.includes('..')) {
    return {
      isValid: false,
      error: 'Gmail address cannot contain consecutive dots'
    };
  }
  
  return {
    isValid: true
  };
};

/**
 * Normalizes Gmail email address (lowercase and trim)
 * @param email - The email address to normalize
 * @returns Normalized email address
 */
export const normalizeGmailEmail = (email: string): string => {
  return email.trim().toLowerCase();
};
