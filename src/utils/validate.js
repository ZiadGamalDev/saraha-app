const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const { error } = await schema({
                body: req.body,
                params: req.params,
                query: req.query,
            });

            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            next();
        } catch (err) {
            return res.status(400).json({ message: 'Validation failed' });
        }
    };
};

export default validate;
