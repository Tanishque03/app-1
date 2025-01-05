import { create } from 'zustand';
import { toast } from 'react-hot-toast';

import { axiosInstance } from './axios';
import { useAuth } from './useAuth';

export const useChat = create((set, get) => ({
  messages:[],
  users:[],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set ({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message); 
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({messages:res.data});

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const {selectedUser, messages} = get();
    try {

      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)

      const newMessage = {
        _id: res.data._id,
        senderId: res.data.senderId,
        receiverId: res.data.receiverId,
        text: res.data.text,
        image: res.data.image,
        createdAt: res.data.createdAt,
        uniqueKey: `${res.data._id}-${Date.now()}`, 
      };
      const isDuplicate = messages.some(
        msg => msg._id === newMessage._id
      );

      if (!isDuplicate){
        set({messages: [...messages, newMessage]});  
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log('Error in sendMessage:', error.response?.data || error.message);
    }
  },

  subscribeToMessages: () => {
    const state = get();

    // socket.on('new user', (newUser ) => {
    //   // Update the online status of all existing users
    //   io.emit('update online status', {
    //     userId: newUser.id,
    //     onlineStatus: true,
    //   });

    //   // Establish a new socket.io connection between the new user and all existing users
    //   io.emit('new connection', {
    //     userId: newUser.id,
    //     socketId: socket.id,
    //   });
    // });

    const { selectedUser } = get();
    if(!selectedUser) return;
    const socket = useAuth.getState().socket;

    socket.off("newmessage"); // Remove previous listeners

    socket.on("newmessage", (newMessage) => {
      const userChatEncryption = newMessage.senderId === selectedUser._id
      if(!userChatEncryption) return;
      
      const currentMessages = get().messages;
      const enhancedMessage = {
        ...newMessage,
        uniqueKey: `${newMessage._id}-${Date.now()}`
      };
      const isDuplicate = currentMessages.some(
        msg => msg._id === enhancedMessage._id
      );
      
  
      if (!isDuplicate) {
        set({
          messages: [...currentMessages, enhancedMessage]
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));