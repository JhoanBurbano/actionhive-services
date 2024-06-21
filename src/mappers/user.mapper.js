const mapToUserResponse = (user, token) => {
    return {
        user: {
            profile: {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                rol: user.role,
            },
            avatar: {
                url: user.avatar.url,
                initials: (user.firstname[0] + user.lastname[0]).toUpperCase(),
            },
            },
        token
    };
}

module.exports = {
    mapToUserResponse
};