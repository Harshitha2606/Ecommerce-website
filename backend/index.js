const port = 4000;
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());


//database connection with mongodb
mongoose.connect("mongodb+srv://harshithakasani98:Harshi98@cluster0.yab9ik7.mongodb.net/e-commerce");

//api creation
app.get("/", (req, res) => {
    res.send("Express app is running");
})

//image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: storage})

//create upload end point for images
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

//schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now 
    },
    available: {
        type: Boolean,
        default: true
    }
})

app.post("/addproduct", async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price
    });
    console.log(product);
    await product.save();
    console.log("product saved");
    res.json({
        success: true,
        name: req.body.name
    })
})

//api for delete products
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({id: req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})

//api for get all products
app.get('/allproducts', async(req, res) =>{
    let products = await Product.find({});
    console.log("all products fetched");
    res.send(products);
})

//schema for user login
const Users = mongoose.model("Users", {
    username: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    cartData: {
        type: Object
    },
    date: {
        type:Date,
        default: Date.now
    }
})

//create api for register user
app.post('/signup', async(req, res) => {
    let check = await Users.findOne({email: req.body.email});
    if(check) {
        return res.status(400).json({success: false, errors:"existing user found with same email id"});
    }
    let cart ={};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user = new Users({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })
    await user.save();
    const data = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecom');
    res.json({success: true, token})
})

//login api
app.post('/login', async (req, res) => {
    let user = await Users.findOne({email: req.body.email});
    if(user) {
        const passCompare = req.body.password === user.password;
        if(passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success: true, token})
        }
        else {
            res.json({success: false, errors:"Wrong password"}) 
        }
    }
    else {
        res.json({success: false, errors:"Wrong email id"}) 
    }
})

//new collection api
app.get('/newcollection', async(req, res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection fetched");
    res.send(newcollection);
})

//popularin women section api
app.get('/popularinwomen', async(req, res)=>{
    let products = await Product.find({category: "women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

//create middleware to fetch user
const fetchUser = async(req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({errors: "Please authenticate using valid token"})
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        }
        catch(err) {
            res.status(401).send({errors: "Please authenticate using valid token"})
        }
    }
}

//endpoint for add to cart api
app.post('/addtocart',fetchUser, async(req, res)=>{
    let userData = await Users.findOne({_id: req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findByIdAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send("Items added");
})

//endpoint for remove cart data api
app.post('/removefromcart',fetchUser, async(req, res)=>{
    let userData = await Users.findOne({_id: req.user.id});
    if(userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findByIdAndUpdate({_id: req.user.id}, {cartData: userData.cartData});
    res.send("Items Removed");
})

//api for get cart data automatically
app.post('/getcart',fetchUser, async(req, res)=>{
    let userData = await Users.findOne({_id: req.user.id});
    res.json(userData.cartData);
})

app.listen(port, (error)=> {
    if(!error) {
        console.log("port running on "+ port);
    }
    else {
        console.log("Error:"+error);
    }
})