const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");

const MIME_TYPE_MAP ={
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
};

const Inventory = require('../models/inventory');
const Drug = require('../models/drugs');


const storage =multer.diskStorage({
  destination: (req, file ,cb) =>{
    const isValid  = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("mime type invalid");
    if(isValid){
      error = null;
    }
    cb(error, "images");
  },
  filename :(req, file ,cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});



router.post("/",multer({storage: storage}).single("image"),(req,res,next)=>{
  const url =req.protocol + '://' + req.get("host");
  const inventory = new Inventory({
    user_cuid: req.body.user_cuid,
    drugId: req.body.drugId,
    pharmacy: req.body.pharmacy,
    quantity: req.body.quantity,
    expireDate: req.body.expireDate,
    batchId: req.body.batchId,
    price: req.body.price
    //imagePath : url + "/images/" + req.file.filename
    });
  inventory.save().then(createdInventory=>{
    Drug.findById(inventory.drugId).then(drug =>{
      if(drug){
        drug.quantity=(drug.quantity|| 0) +inventory.quantity;
        
        drug.lastExpireDate = inventory.expireDate;
        console.log(drug)

        Drug.updateOne({_id: inventory.drugId}, drug).then(result => {
          console.log(result);
         
        },err=>{
          console.log(err);
          res.status(204).json({message : "error updating drug"});
        });
      }else{
        res.status(204).json({message:'Inventory not found'});
      }
    });
  res.status(201).json({...createdInventory._doc});
  },err=>{
    console.log(err);
    res.status(204).json({message : "error creating inventory"});
  });
});


/* router.put("/:id",multer({storage: storage}).single("image"), (req,res,next)=>{

  let imagePath = req.body.imagePath;
  if(req.file){
    const url =req.protocol + '://' + req.get("host");
    imagePath =url + "/images/" + req.file.filename;
  };
  const inventory = new Inventory({
    _id: req.body.id,
    user_cuid: req.body.user_cuid,
    drugName: req.body.drugName,
    pharmacy: req.body.pharmacy,
    quantity: req.body.quantity,
    batchId: req.body.batchId,
    expireDate: req.body.expireDate,
    price: req.body.price
  });
  console.log(inventory);
  Inventory.updateOne({_id: req.params.id}, inventory).then(result => {
    console.log(result);
    res.status(200).json({message : "Update Successful !"});
  },err=>{
    console.log(err);
    res.status(204).json({message : "error updating inventory"});
  });
}); */


/* router.put("/updateQuantity/:id",(req,res,next)=>{
  const inventory = new Inventory({
    _id: req.body.id,
    quantity: req.body.quantity


  });console.log(inventory)
  Inventory.updateOne({_id: req.params.id}, inventory).then(result => {
    console.log(result);
    res.status(200).json({message : "Update quantity Successful !"});
  });
}); */


router.get("/",(req,res,next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const pharmacyId = req.query.pharmacyId;

  const drugId = req.query.drugId;


  var postQuery;

  if(drugId){
    postQuery = Inventory.find({drugId:drugId});

 }else{
    if(pharmacyId){
        postQuery = Inventory.find({pharmacy:pharmacyId});

    }else{
        postQuery = Inventory.find();

    }
 }
  
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage-1))
      .limit(pageSize);
  }
  postQuery.then(documents=>{
    res.status(200).json(documents);
  },err=>{
    console.log(err);
    res.status(204).json({message : "error reading inventory list"});
  });
});


router.get("/outofstock",(req,res,next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const pharmacyId = req.query.pharmacyId;
  var postQuery;
  if(pharmacyId){
    postQuery = Drug.find({ $expr: { $lte: [ { $toDouble: "$quantity" }, 1.0 ] },pharmacy:pharmacyId});

  }else{
    postQuery = Drug.find({ $expr: { $lte: [ { $toDouble: "$quantity" }, 1.0 ] }});

  }
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage-1))
      .limit(pageSize);
  }
  postQuery.then(documents=>{
    res.status(200).json(documents);
  });
});


router.get("/abouttooutofstock",(req,res,next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;

  const pharmacyId = req.query.pharmacyId;

  var postQuery ;
  if(pharmacyId){
    postQuery = Drug.find({$and: [
      { $expr: { $lte: [ { $toDouble: "$quantity" }, 30.0 ] }},
      { $expr: { $gte: [ { $toDouble: "$quantity" }, 1.0 ] }}
    ],pharmacy:pharmacyId});

  }else{
    postQuery = Drug.find({$and: [
      { $expr: { $lte: [ { $toDouble: "$quantity" }, 30.0 ] }},
      { $expr: { $gte: [ { $toDouble: "$quantity" }, 1.0 ] }}
    ]});

  }


  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage-1))
      .limit(pageSize);
  }
  postQuery.then(documents=>{
    res.status(200).json(documents);
  });
});

router.get("/getExpired",(req,res,next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const pharmacyId = req.query.pharmacyId;
  var postQuery
  if(pharmacyId){
     postQuery = Drug.find({lastExpireDate:{$lte:new Date()},pharmacy:pharmacyId});

  }else{
     postQuery = Drug.find({lastExpireDate:{$lte:new Date()}});
  }

  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage-1))
      .limit(pageSize);
  }
  postQuery.then(documents=>{
    res.status(200).json(documents);
  });
});

router.get("/getAboutToExpire",(req,res,next)=>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  
  var date = new Date();
  var date10 = new Date(date.getTime());
  date10.setDate(date10.getDate() + 10);

  const pharmacyId = req.query.pharmacyId;
  var postQuery ;
  if(pharmacyId){
    postQuery = Drug.find({lastExpireDate:{$lte:new Date(date10),$gte:new Date()},pharmacy:pharmacyId});

  }else{
    postQuery = Drug.find({lastExpireDate:{$lte:new Date(date10),$gte:new Date()}});
  }

  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage-1))
      .limit(pageSize);
  }
  postQuery.then(documents=>{
    res.status(200).json(documents);
  });
});


router.get("/:id",(req,res,next)=>{

  Inventory.findById(req.params.id).then(inventory =>{
    if(inventory){
      res.status(200).json(inventory);
    }else{
      res.status(200).json({message:'Inventory not found'});
    }
  },err=>{
    console.log(err)
    res.status(204).json({message:'Inventory not found'});
  });
});



/* router.delete("/:id", (req, res, next) => {
  Inventory.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Inventory deleted!' });
  },err=>{
    console.log(err)
    res.status(204).json({message:'Inventory not found'});
  });
}); */


/* router.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has been send 😃 and the id is ${info.messageId}`);
    res.send(info);
  });
});


async function sendMail(user, callback) {
  // reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "nyoumipaulius@gmail.com",
      pass: "Africa21"
    }
  });

  let mailOptions = {
    from: '"Pharma Care Pharmacies"<example.gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: "Requesting New Drug Oder "+user.name, // Subject line
    html: `
    <head>
    <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      table {
        font-family: arial, sans-serif;
        background: "#abcdef";
        width: 100%;
      }

      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }

      tr:nth-child(even) {
        background-color: #dddddd;
      }
      </style>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
      <script>

          $(function(){
            var results = [], row;
            $('#table1').find('th, td').each(function(){
                if(!this.previousElementSibling && typeof(this) != 'undefined'){ //New Row?
                    row = [];
                    results.push(row);
                }
                row.push(this.textContent || this.innerText); //Add the values (textContent is standard while innerText is not)
            });
            console.log(results);
        });

      </script>
      </head>

    <body>
    <h1>Dear Supplier </h1><br>
    <h3>Our current stock of ${user.name} has been expired</h3><br>
    <h2>So we (PharmaCare Managment would like to request ${user.quantityNumber} amount of units from ${user.name} )</h2><br>
    <h3>Please reply back if the this oder is verified.</h3>

    <h2>Purchase Oder </h2>

    <table id="table1">
      <tr>
        <th>Odered Drug Name</th>
        <th>Drug Quantity </th>
        <th>Requested Price per unit (Rs.)</th>
      </tr>
      <tr>
        <td>${user.name}</td>
        <td>${user.quantityNumber}</td>
        <td>${user.price}</td>
      </tr>

    </table><br>

    <h3>Info* : </h3>
    <h4>If there is any issue reagrding the oder please be free to contact us or email us (pharmacare.contactus@gmail.com) 😃 </h4>
    </body>
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
} */



/* 
router.post("/sendmailOutOfStock", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendmailOutOfStock(user, info => {
    console.log(`The mail has been send 😃 and the id is ${info.messageId}`);
    res.send(info);
  });
});


async function sendmailOutOfStock(user, callback) {
  // reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "pharmacare.contactus@gmail.com",
      pass: "lalana1011294"
    }
  });

  let mailOptions = {
    from: '"Pharma Care Pharmacies"<example.gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: "Requesting New Drug Oder "+user.name, // Subject line
    html: `
    <head>
    <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }

      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }

      tr:nth-child(even) {
        background-color: #dddddd;
      }
      </style>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
      <script>

          $(function(){
            var results = [], row;
            $('#table1').find('th, td').each(function(){
                if(!this.previousElementSibling && typeof(this) != 'undefined'){ //New Row?
                    row = [];
                    results.push(row);
                }
                row.push(this.textContent || this.innerText); //Add the values (textContent is standard while innerText is not)
            });
            console.log(results);
        });

      </script>
      </head>

    <body>
    <h1>Dear Supplier </h1><br>
    <h3>Our current stock of ${user.name} has been finished/Out of stock</h3><br>
    <h2>So we (PharmaCare Managment would like to request ${user.quantityNumber} amount of units from ${user.name} )</h2><br>
    <h3>Please reply back if the this oder is verified.</h3>

    <h2>Purchase Oder </h2>

    <table id="table1">
      <tr>
        <th>Odered Drug Name</th>
        <th>Drug Quantity </th>
        <th>Requested Price per unit (Rs.)</th>
      </tr>
      <tr>
        <td>${user.name}</td>
        <td>${user.quantityNumber}</td>
        <td>${user.price}</td>
      </tr>

    </table><br>

    <h3>Info* : </h3>
    <h4>If there is any issue reagrding the oder please be free to contact us or email us (pharmacare.contactus@gmail.com) 😃 </h4>
    </body>
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
} */

module.exports = router;
