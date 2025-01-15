import { create } from 'zustand';

import { axiosInstance } from './axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

export const useAuth = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async() => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({authUser:res.data});
      get().connectSocket()
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({authUser: null});
      
    } finally {
      set({isCheckingAuth: false});
    }
  },

  signup: async (data) => {
    set ({isSigningUp: true});
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({authUser: res.data});
      toast.success('Account has been created!');
      get().connectSocket()

    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      set ({isSigningUp: false});
    }
  },

  login: async (data) => {
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({authUser: res.data});
      toast.success("Logged in successfully");
      
      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({isLoggingIn: false});
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null});
      toast.success("Logged out successfully");
      get().disconnectSocket()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async(data) => {
    set({isUpdatingProfile: true});
    try {
     const res = await axiosInstance.put('/auth/update-profile', data);
    // const formData = new FormData();
    // for (let key in data) {
    //   formData.append(key, data[key]);
    // }

    // const res = await axiosInstance.put('/auth/update-profile', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // });  


      set({authUser: res.data});
      toast.success("Profile updated");
      
    } catch (error) {
      console.log('error is updating profile' ,error);
      toast.error(error.response.data.message);

    } finally {
      set({isUpdatingProfile: false});
    }
  },

  connectSocket: () => {
    const { authUser } = get()
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,

    })
    socket.connect()

    set({socket: socket});

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds});
    });
  },

  disconnectSocket: () => {
    if(get().socket?.connected) get().socket.disconnect();
  },
}));