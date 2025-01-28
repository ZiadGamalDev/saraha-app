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
        const { id } = req.params;
        
        await Message.deleteOne({ _id: id });

        res.json({ message: 'Message deleted successfully' });
    }
};

export default messageController;
