const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuthentication");

//add-book-to-favorite

router.put("/add-book-to-favourite", authenticateToken, async(req, res)=>{
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favorites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message:"Book Already Added In Favourites!"});
        }
        await User.findByIdAndUpdate(id,{ $push: {favorites: bookid}});
        return res.status(200).json({message:"Book added in favourite!"});
    } catch(Error){
        return res.status(500).json({message:"Internal Server Error!"});
    }
});

//delete-book-from-favorite

router.put("/remove-book-from-favourite", authenticateToken, async(req, res)=>{
    try{
        const {bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favorites.includes(bookid);
        if(isBookFavourite){
            await User.findByIdAndUpdate(id,{$pull: {favorites: bookid}});
        }
        return res.status(200).json({message:"Book removed from favourite!"});
    } catch(Error){
        return res.status(500).json({message:"Internal Server Error!"});
    }
});

//get-favorite-book-of-particular-user

router.get("/get-favorite-books", authenticateToken, async(req, res)=>{
   try{
    const {id} = req.headers;
    const userData = await User.findById(id).populate("favorites");
    const favoriteBooks = userData.favorites;
    return res.json({
        status:"Success",
        data: favoriteBooks,
    });   
   }catch(Error){
    return res.status(500).json({message:"Internal Server Error!"});
   }
});

module.exports = router; 