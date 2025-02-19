const router = require("express").Router();
const { authenticateToken } = require("./userAuthentication"); 
const Book = require("../models/book");
const Order = require("../models/order");

//place-order

router.post("/place-order", authenticateToken, async(req, res)=>{
    try{
        const {id} = req.headers;
        const {order} = req.body;

        for(const orderData of order){
            const newOrder = new Order({user: id, book: orderData._id});
            const orderDataFromDb = await newOrder.save();
            //for adding into cart...
            await User.findByIdAndUpdate(id, {$push:{orders: orderDataFromDb._id},});
            //for clearing the cart...
            await User.findByIdAndUpdate(id, {$pull:{cart: orderData._id},});
        }
        return res.json({
            status:"Success",
            message:"Order Placed Succesfully!",
        });
    } catch(Error){
        return res.status(500).json({message:"An Error Occured!"});
    }
});

//get-order-history

router.get("/get-order-history", authenticateToken, async(req, res)=>{
    try{
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
            path: "order",
            populate:{path:"book"},
        });

        const  ordersData = userData.orders.reverse();
        return res.json({
            status:"Success",
            data:ordersData,
        });

    }catch(Error){
        return res.status(500).json({message:"An Error Occured!"});
    }
})

//get-all-orders --admin

router.get("/get-all-orders", authenticateToken, async(req, res)=>{
    try{
        const orderData = await Order.find()
                                        .populate({path:"book",})
                                        .populate({path:"user",})
                                        .sort({createdAt: -1});

        return res.json({
            status:"Success",
            data:userData,
        });

    }catch(Error){
        return res.status(500).json({message:"An Error Occured!"});
    }
});

//update-order  --admin

router.put("/update-order", authenticateToken, async(req, res)=>{
    try{
        const {id} = req.params;
        await Order.findByIdAndUpdate(id,{status: req.body.status});
        return res.json({
            status:"Success",
            message:"Status Updated Successfully!",
        });
    } catch(Error){
        return res.status(500).json({message:"An Error Occured!"});
    }
});

module.exports = router;