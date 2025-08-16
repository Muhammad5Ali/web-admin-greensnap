import { API_URL } from '../utils/constants';

export const loginAdmin = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        ...credentials,
        client: "web" 
      })
    });
    
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
};