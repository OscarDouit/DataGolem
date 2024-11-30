import { create } from 'zustand'
import api from '../api/axios.js';

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (userData) => set({ user: userData, isAuthenticated: true, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  checkAuth: async () => {
    try {
      const response = await api.get('/users/me');
      
      if (response.status === 200) {
        const data = response.data;
        set({ 
          user: data.user,
          isAuthenticated: data.isAuthenticated,
          isLoading: false
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      console.error('Erreur lors de la vérification de l\'authentification:', error);
    }
  }
}));

export default useUserStore; 