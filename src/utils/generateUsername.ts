export const generateUsernameFromEmail = (email: string): string => {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
  
    const [localPart] = email.split('@');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    const cleanLocalPart = localPart.replace(/[^a-zA-Z0-9]/g, ''); // remove special chars
  
    return `${cleanLocalPart}${randomSuffix}`;
  };