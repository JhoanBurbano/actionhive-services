const mapToUserResponse = (user, token) => {
    console.log(user);
    return {
        user: {
            profile: {
                email: user.email,
                name: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            avatar: {
                url: user.avatar.url,
                initials: (user.firstName[0] + user.lastName[0]).toUpperCase(),
            },
            },
        token
    };
}

module.exports = {
    mapToUserResponse
};