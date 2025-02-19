const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuthentication");

//add-book-to-cart

router.put("/add-to-cart", authenticateToken, async(req, res)=>{
    try{
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookInCart = userData.cart.includes(bookid);
        if(isBookInCart){
            return res.json({
                status:"Success",
                message:"Book Is Already In Cart!",
            });
        }

        await User.findByIdAndUpdate(id, {$push:{cart:bookid},});

        return res.json({
            status:"Success",
            message:"Book Added To Cart!",
        });

    } catch(Error){
        return res.status(500).json({message:"Internal Server Error!"});
    }
});

//remove-book-from-cart

router.put("/remove-book-from-cart/:bookid", authenticateToken, async(req, res)=>{
    try{
        const {bookid} = req.params;
        const {id} = req.headers;
        await User.findByIdAndUpdate(id,{$pull:{cart: bookid}});

        return res.json({
            status:200,
            message:"Book Removed From Cart!",
        });
    } catch(Error){
        return res.status(500).json({message:"An Error Occured!"});
    }
});

//get-user-cart

router.get("/get-user-cart", authenticateToken, async(req, res)=>{
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();

        return res.json({status: "Success", data: cart });
    } catch(Error){
        return res.status(500).json({message:"An Error Occured!"});
    }
});

module.exports = router; 