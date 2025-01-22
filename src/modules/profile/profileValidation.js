import Joi from 'joi';

const profileValidation = {
  update: ({ body }) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50),
      phone: Joi.string().pattern(/^[0-9]+$/).min(8),
      image: Joi.any(),
    });

    const { error } = schema.validate(body, { abortEarly: false });
    return error ? { error } : {};
  },
};

export default profileValidation;
