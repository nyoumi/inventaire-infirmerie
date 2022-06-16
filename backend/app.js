const path  =require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const supplierRoutes = require('./routes/supplier');
const inventoryRoutes = require('./routes/inventory');
const userRoutes = require('./routes/user');
const salesRoutes = require('./routes/sales');
const doctorUserRoutes = require('./routes/doctorUser');
const doctorOderRoutes = require('./routes/doctorOders');
const verifiedDoctorOderRoutes = require('./routes/verifiedDoctorOder');
const pickedUpOdersRoutes = require('./routes/pickedUpOders');

const drugRoutes = require('./routes/drugs');

const storeRoutes = require('./routes/store');


const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require("./swagger/swagger.json");

const dotenv = require('dotenv');
dotenv.config();
console.log('database address: '+process.env.DATABASE);


//mongoose.connect("mongodb://imran:test_password@mongo:27017/?authSource=admin",{useNewUrlParser: true , useUnifiedTopology: true})
mongoose.connect(process.env.DATABASE || "mongodb://localhost:27017/inventaire",{useNewUrlParser: true , useUnifiedTopology: true})

  .then(()=>{
    console.log('connected to database!');
  })
  .catch((error)=>{
    console.log('connection to database failed! ');
    console.log(error)
  });
  mongoose.set('useCreateIndex', true);
  mongoose.connection.on('error', (error)=>{
    console.log('error in database! ');
    console.log(error)
  });


//OJx2X4IllVNl9up4


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images" , express.static(path.join("images")));


app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With ,Content-Type,Authorization ,Accept",
    "HTTP/1.1 200 OK",
    "append,delete,entries,foreach,get,has,keys,set,values,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});


// app.post("/api/supplier",(req,res,next)=>{
// const supplier = new Supplier({
//   supplierID: req.body.supplierID,
//   name: req.body.name,
//   email: req.body.email,
//   contact: req.body.contact,
//   drugsAvailable: req.body.drugsAvailable
// });
// supplier.save().then(createdSupplier=>{
// res.status(201).json({
//   message:'Supplier Added Successfully',
//   supplierId : createdSupplier._id
// });

// });

// });

// app.put("/api/supplier/:id", (req,res,next)=>{
//   const supplier = new Supplier({
//     _id: req.body.id,
//     supplierID: req.body.supplierID,
//     name: req.body.name,
//     email: req.body.email,
//     contact: req.body.contact,
//     drugsAvailable: req.body.drugsAvailable
//   });
//   Supplier.updateOne({_id: req.params.id}, supplier).then(result => {
//     console.log(result);
//     res.status(200).json({message : "Update Successful !"});
//   });
// });

// app.get("/api/supplier",(req,res,next)=>{
//   Supplier.find().then(documents=>{
//     res.status(200).json({
//       message : 'supplier added sucessfully',
//       suppliers :documents
//     });
//   });
// });


// app.get("/api/supplier/:id",(req,res,next)=>{
//   Supplier.findById(req.params.id).then(supplier =>{
//     if(supplier){
//       res.status(200).json(supplier);
//     }else{
//       res.status(200).json({message:'suplier not found'});
//     }
//   });
// });

// app.delete("/api/supplier/:id", (req, res, next) => {
//   Supplier.deleteOne({ _id: req.params.id }).then(result => {
//     console.log(result);
//     res.status(200).json({ message: 'Supplier deleted!' });
//   });
// });

app.use("/api/supplier",supplierRoutes);
app.use("/api/drug",drugRoutes);
app.use("/api/store",storeRoutes);
app.use("/api/inventory",inventoryRoutes);
app.use("/api/user",userRoutes);
app.use("/api/sales",salesRoutes);
app.use("/api/doctorUser",doctorUserRoutes);
app.use("/api/doctorOder",doctorOderRoutes);
app.use("/api/verifiedDoctorOder",verifiedDoctorOderRoutes);
app.use("/api/pickedUpOders",pickedUpOdersRoutes);


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))


module.exports = app;
