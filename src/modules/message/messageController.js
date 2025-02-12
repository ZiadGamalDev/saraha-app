import Message from "../../db/models/messageModel.js";

const messageController = {
    getAll: async (req, res) => {
        const receiverId = req.userId;

        const messages = await Message.find({ receiverId });
        
        res.json(messages);
    },

    create: async (req, res) => {
        const { message, receiverId } = req.body;

        const newMessage = await Message.create({ message, receiverId });

        res.json(newMessage);
    },

    delete: async (req, res) => {
        const receiverId = req.userId;
        const { id } = req.params;
        
        const message = await Message.deleteOne({ _id: id, receiverId });

        res.json({ message: 'Message deleted' });
    }
};

export default messageController;
