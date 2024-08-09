const mapToUserResponse = (user, token, isInvestor) => {

  return {
    user: {
      profile: {
        email: user.email,
        firstname: user[isInvestor ? "firstName" : "firstname"],
        lastname: user[isInvestor ? "lastName" : "lastname"],
        rol: user.role,
      },
      isInvestor,
      avatar: isInvestor
        ? {
            url: user.avatar?.url || "",
            initials: (user.firstName[0] + user.lastName[0]).toUpperCase(),
          }
        : {
            url: user.avatar?.url || "",
            initials: (user.firstname[0] + user.lastname[0]).toUpperCase(),
          },
    },
    token,
  };
};

module.exports = {
  mapToUserResponse,
};
