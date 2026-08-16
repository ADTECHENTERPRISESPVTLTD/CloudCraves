export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRegistrationInput = (data: any): { isValid: boolean; message?: string } => {
  const { name, phone, email, password } = data;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return { isValid: false, message: 'Valid user name is required' };
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
    return { isValid: false, message: 'Valid phone number is required (min 8 digits)' };
  }

  if (!email || typeof email !== 'string' || !validateEmail(email)) {
    return { isValid: false, message: 'Valid email address is required' };
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  return { isValid: true };
};

export const validateLoginInput = (data: any): { isValid: boolean; message?: string } => {
  const { email, password } = data;

  if (!email || typeof email !== 'string' || !validateEmail(email)) {
    return { isValid: false, message: 'Valid email address is required' };
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return { isValid: false, message: 'Password is required' };
  }

  return { isValid: true };
};
