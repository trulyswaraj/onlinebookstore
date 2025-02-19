const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("../routes/userAuthentication");

//signup

router.post("/sign-up", async(req, res)=>{
    try{

        // console.log("Received Request Body:", req.body);

        const {username, email, password, address} = req.body;
        
        //check length of Username.
        if(username.length < 4){
            return res
                .status(400)
                .json({message:"username should be greater than 3 charaters."});
        }

        //check if username already exists.
        const existingUserName = await User.findOne({username:username});
        if(existingUserName){
            return res
                .status(400)
                .json({message:"Username Already Exists, try using other username."});
        }

        //check if email already exists.
        const existingEmail = await User.findOne({email:email });
        if(existingEmail){
            return res  
                .status(400)
                .json({message:"Email Already Exist, try Using other email."})
        }

        //check length of password
        if(password.length <= 6){
            return res
                    .status(400)
                    .json({message:"Password's length must be greater than 6 characters."})
        }

        const hashPass = await bcrypt.hash(password,10);

        const newUser = new User({
            username:username,
            email:email,
            password:hashPass,
            address:address,
        });
        await newUser.save();
        return res.status(200).json({message:"New User sign-up Successful"});


    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
});

//sign-in

router.post("/sign-in", async(req, res)=>{
    try{
        const {username, password} = req.body;

        const existingUser = await User.findOne({username});
        if(!existingUser){
            res.status(400).json({message:"Invalid Credentials."});
        }

        await bcrypt.compare(password, existingUser.password, (err, data)=>{
            if(data){
                const authClaims = [{name : existingUser.username}, 
                                    {role: existingUser.role},
                                ];
                const token = jwt.sign({authClaims}, "bookstore123",{expiresIn:"30d"});
                res
                    .status(200)
                    .json({id: existingUser._id, 
                                    role: existingUser.role,
                                    token: token, 
                            });
            } else {
                res.status(400).json({message:"Invalid Credentials."});
            }
        });

    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
});

// get-user-information

router.get("/get-user-information", authenticateToken ,async(req, res)=>{
    try{
        const{id} = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch(error){
        res.status(500).json({message:"Internal Server Error."});
    }
});

//update-address

router.put("/update-address", authenticateToken, async(req, res)=>{
    try{
        const  id  = req.user.id;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, {address: address}); 
        return res.status(200).json({message:"Address Updated Successfully!"});
    } catch(error) {
        res.status(400).json({message:"Invalid User"});
    }
});

module.exports = router;