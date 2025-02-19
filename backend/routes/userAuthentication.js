const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(token ==  null){
        return res.status(401).json({message:"Authentication token expired. "});
    }

    jwt.verify(token, "bookstore123", (err, user)=>{
        if(err){
            return res
                    .status(403)
                    .json({message:"Authorization token expired. Please Sign In Again!"});
        }

        // console.log("Decoded Token Data: ", user);

        req.user = user;
        next();
    });
};

module.exports = {authenticateToken};