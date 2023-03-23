const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, em, pwd } = req.body;
  if (!user || !pwd || !em)
    return res.status(400).json({ message: "Please fill out the fields" });
  //check for duplicate usernames
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); //conflict
  try {
    //ecrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //create and store the new user
    const result = await User.create({
      username: user,
      email: em,
      password: hashedPwd,
    });
    console.log(result);
    res.status(201).json({ message: `New user ${user} was created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
