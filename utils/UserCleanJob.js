import User from "../models/User.js";

const usersCleanJob = async (req, res, next) => {
  try {
    //get all users from database
    const users = await User.find();

    for (let i = 0; i < users.length; i++) {
      //check the user verify or not
      if (!users[i].isVerify) {
        // user remove from database
        await User.deleteOne({ _id: users[i]._id });
        console.log(`Delete user with email ${users[i].email}`);
      }
    }
  } catch (error) {
    next(error);
  }
};

export default usersCleanJob;
