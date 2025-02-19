const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("../routes/userAuthentication");
const book = require("../models/book");


//add-book --admin

router.post("/add-book", authenticateToken, async(req, res)=>{
    try{
        const {id} = req.headers;
        const user = await User.findById(id);
        if(user.role !== "admin"){
            return res.status(400).json({message:"Cannot add book, User is not Admin!"});
        }

        const newBook = new book({
            url: req.body.url,
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            description : req.body.description,
            language : req.body.language,
        });
        await newBook.save();
        // await book.insertMany(book);
        res.status(200).json({message:"Book Added Successfully!"});
    } catch (error){
        return res.status(500).json({message:"Internal Server Error!"});
    }
});

//update-book --admin

router.put("/update-book", authenticateToken, async(req, res)=>{
    try{
        const {bookid} = req.headers;
        await Book.findByIdAndUpdate(bookid,{
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            description:req.body.description,
            language:req.body.language,
        }); 

        return res.status(200).json({message:"Book Updated Successfully!"});

    } catch(error){
        console.log(error);
        return res.status(500).json({message:"An error occured!"});
    }
});

//delete-book --admin

router.delete("/delete-book", authenticateToken, async(req, res)=>{
    try{
        const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({message:"Book Deleted Successfully!"});
    } catch(error){
        return res.status(400).json({message:"Cannot delete book!"});
    }
});

//get-all-books --public api's

router.get("/get-all-books", async(req, res)=>{
    try{
        const books = await Book.find().sort({createdAt:-1});
        return res.json({
            status:"Success",
            data: books,
        });
    } catch (Error){
        return res.status(500).json({message:"Some Error Occured!"});
    }
});

//get-recent-4-books --public api's

router.get("/get-recent-books", async(req,res)=>{
    try{
        const books = await Book.find().sort({createdAt : -1}).limit(4);
        return res.json({
            status:"Success",
            data:books, 
        });
    } catch(Error){
        return res.status(500).json({message:"Some Error Occured!"});
    }
});

//get-book-by-id --public api's

router.get("/get-book-by-id/:id", async(req, res)=>{
    try{
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.json({
            status:"Success",
            data:book,
        });
    } catch(Error){
        return res.status(500).json({message:"An Error Occured!"});
    }
})

module.exports = router;
