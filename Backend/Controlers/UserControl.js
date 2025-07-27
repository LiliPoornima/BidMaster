//insert model
const User = require("../Model/UserModel");



//display
const getAllUsers = async(req,res,next) =>{

    let Users;

//get all users
    try{
        Users = await User.find();

    }catch(err){
        console.log(err);

    }
    //not found
    if(!Users){
        return res.status(404).json({message:"User not found"});

    }

    //display all users
    return res.status(200).json({Users});

};


//data insert

const addUsers = async (req, res, next) => {
  const { name, username, email, phone, password, confirmPassword } = req.body;

  let user;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    

    // 🆕 Create new user and link to employee if found
    user = new User({
      name,
      username,
      email,
      phone,
      password,
      confirmPassword,
     
    });

    // Save user to DB
    await user.save();

    return res.status(201).json({ success: true, message: "Registration successful!", user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "An error occurred while registering." });
  }
};

  
//get by id
const getById = async (req,res,next) =>{
    const id = req.params.id;

    let user;
    
    try{
        user = await User.findById(id);
    }catch(err){
        console.log(err);

    }

    //not insert users
    if(!user){
        return res.status(404).json({message:"user not found"});

    }

    return res.status(200).json({user});
};



//update user details
const updateUser = async(req,res,next)=>{

    const id = req.params.id;
    const{name,username,email,phone,password,confirmPassword} = req.body;

    let users;

    try{
        users = await User.findByIdAndUpdate(id,
        
            { name:name,username:username, email:email, phone:phone,password:password,confirmPassword:confirmPassword});
            users = await users.save();
    }catch(err){
        console.log(err);
    }

     //not update users
     if(!users){
        return res.status(404).json({message:"unable to update user details"});

    }

    return res.status(200).json({users});

};


//delete user details

const deleteUser = async(req,res,next)=>{

    const id = req.params.id;

    //create variable
    let user;

    try{
        user = await User.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }

    if(!user){
        return res.status(404).json({message:"unable to delete "});

    }

    return res.status(200).json({user});
};

const uploadProfileImage = async (req, res) => {
    try {
      const userId = req.params.id;
      const imagePath = `/uploads/${req.file.filename}`; // Relative path
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profileImage: imagePath },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Image uploaded", user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  };  

const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      name: user.name,
      profileImage: user.profileImage, // e.g., '/uploads/user123.jpg'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.uploadProfileImage = uploadProfileImage;
exports.getUserProfile = getUserProfile;
