require("dotenv").config();
const express = require ('express')
const cors = require ('cors')
const app = express ()
const path = require('path')
const fs = require('fs')
const multer = require('multer');
const mongodb = require ('./config/mongodb')
const {getallCategoryController , categoryController, CategoryUpdateController, DeleteCategoryController} = require ('./controllers/categoryController')
const {verifyMail , forgotMail} = require ('./utils/mailSender')
const {userUpdate , allUser, getSingleUser, deleteUser, changePassword} = require ('./controllers/userController')
const { registrationController , verificationController, loginController , forgotController , resetpassController , reverificationController } = require ('./controllers/authcontroller');
const {CreateProductController , getProductByIdController , getAllProductController , getProductUpdateController , getAllPenddingProductController , getAllActiveProductController , getAllInactiveProductController ,DontgetEditInactiveProductController , getWithoutInactiveProductController , DeleteProductController, BulkCreateProductController, BulkGetProductController, ProductCat } = require("./controllers/productController")
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/exports', express.static(path.join(__dirname, 'exports')));
app.use(express.json())
app.use(cors())
let port = process.env.PORT || 5000
mongodb ()



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname  );
  },
});

const upload = multer({ storage: storage });






// User
app.post('/registration', registrationController);
app.post('/verification/:token', verificationController);
app.post('/login', loginController);
app.post('/forgotpass', forgotController);
app.post('/resetpass/:token', resetpassController);
app.post('/reverification', reverificationController);



//user management 
app.post('/user/:id',userUpdate);
app.get('/alluser',allUser);
app.get('/user/:id',getSingleUser);
app.delete('/user/:id', deleteUser);
app.post('/user/pass/:id', changePassword );


//create category
app.post('/create/category',categoryController);
app.get('/get/allCategory',getallCategoryController);
app.post('/catupdate/:id', CategoryUpdateController);
app.delete('/catdelete/:id', DeleteCategoryController);


//CreateProduct

app.post('/createproduct', upload.array('photos',5), CreateProductController);
app.post('/bulk/createproduct', upload.single('file',), BulkCreateProductController);
app.get('/bulk/getproduct', BulkGetProductController);
app.get('/getproductbyid',getProductByIdController);
app.get('/getAllProduct',getAllProductController);
app.post('/Editproduct/:id', upload.array('photos',5),getProductUpdateController);
app.get('/AllPendding',getAllPenddingProductController);
app.get('/AllActive',getAllActiveProductController);
app.get('/AllInactive',getAllInactiveProductController);
app.get('/DontEditInactiveProduct',DontgetEditInactiveProductController);
app.get('/WithoutInactiveProduct',getWithoutInactiveProductController);
app.delete('/deleteproduct/:id',DeleteProductController );
app.get('/product/:cat',ProductCat)

app.listen(5000, ()=>{
    console.log(`Server is running PORT ${port}`);
    
})