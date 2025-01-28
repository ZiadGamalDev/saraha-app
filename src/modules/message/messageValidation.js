import Joi from "joi";
import User from "../../db/models/userModel.js";
import Message from "../../db/models/messageModel.js";

const messageValidation = {
    create: async ({ body }) => {
        const schema = Joi.object({
            message: Joi.string().required(),
            receiverId: Joi.string().required()
        });

        const { error } = schema.validate(body, { abortEarly: false });
        if (error) {
            return { error };
        }

        // Check receiverId exists
        if (!await User.exists({ _id: body.receiverId })) {
            return { error: { details: [{ message: 'Receiver not found' }] } };
        }

        return {};
    },

    delete: async ({ params }) => {
        // Check message exists
        if (!await Message.exists({ _id: params.id })) {
            return { error: { details: [{ message: 'Message not found' }] } };
        }

        return {};
    }
};

export default messageValidation;
