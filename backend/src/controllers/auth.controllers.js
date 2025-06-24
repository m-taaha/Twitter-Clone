const signUp = async (req, res) => {
  res.json({
    data: "You hit the signUp route",
  });
};
const login = async (req, res) => {
  res.json({
    data: "You hit the login route",
  });
};
const logout = async (req, res) => {
  res.json({
    data: "You hit the logout route",
  });
};

export { signUp, login, logout };
