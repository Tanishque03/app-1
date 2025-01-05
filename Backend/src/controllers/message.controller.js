import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.log("Error in getUserForSidebar :", error.message);
    res.status(500).json({error: "Internal Server error 3"})
  }
};

export const getMessages = async (req, res) => {
  try {
    const {id:userToChatId} = req.params;
    const myId = req.user._id;



    const messages = await Message.find({
      $or:[
        { senderId:myId , receiverId:userToChatId},
        {senderId:userToChatId, receiverId:myId}
      ]
    }).sort({ createdAt: 1 }); 

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages :", error.message);
    res.status(500).json({error: "Internal Server error 4"})
  }
};

export const sendMessage = async (req,res) => {
  try {
    const { text, image } = req.body;
    const { id:  receiverId } = req.params;
    const senderId = req.user._id;


    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: image ? imageUrl : null,
      uniqueIdentifier: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    const savedMessage = await newMessage.save();
    console.log('Sending message:', {
      receiverId,
      messageId: savedMessage._id,
      socketId: getReceiverSocketId(receiverId)
    });

    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId) {
      io.to(receiverSocketId).emit("newmessage", savedMessage)
    }

    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId && senderSocketId !== receiverSocketId) {
      io.to(senderSocketId).emit("newmessage", savedMessage);
    }


    res.status(201).json(savedMessage)
    
  } catch (error) {
    console.log("Error in sendMessage :", error.message);
    res.status(500).json({error: "Internal Server error 4",
      details: error.message })
  }
};