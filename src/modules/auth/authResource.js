export const authResource = (user, accessToken, refreshToken = null) => {
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone ? decrypt(user.phone) : null,
            isVerified: user.isVerified,
            role: user.role,
        },
        tokens: {
            accessToken,
            refreshToken,
        },
    };
};

export const authCollection = (users) => users.map(user => authResource(user));
