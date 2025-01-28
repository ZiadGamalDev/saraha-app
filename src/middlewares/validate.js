const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const { body, params, headers } = req;
            const { error } = await schema({ body, params, headers });

            if (error) {
                const message = error.details?.[0]?.message || 'Validation failed';
                return res.status(400).json({ message });
            }

            next();
        } catch (err) {
            console.error('Validation Error:', err.message);
            return res.status(400).json({ message: 'Validation failed' });
        }
    };
};

export default validate;
