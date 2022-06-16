const express = require("express");
const router = express.Router();

const Drug = require('../models/drugs');

/**
 * add drug
 *   name: {type: String , require:true,unique:true},
  pharmacy: {type: String , require:true},
  quantity: {type: Number  , require:true,default: 0},
  lastExpireDate: {type: Date , require:false},
  type: {type: String , require:true},
 */

  router.post("/",(req,res,next)=>{
    // #swagger.summary = 'add drug.'
    const url =req.protocol + '://' + req.get("host");
    const drug = new Drug({
      name: req.body.name,
      pharmacy: req.body.pharmacy,
      type: req.body.type
      //imagePath : url + "/images/" + req.file.filename
      });
      drug.save().then(createdDrug=>{
    res.status(201).json({      
          ...createdDrug._doc
        });
    },err=>{
      console.log(err);
      res.status(204).json({message : "error creating drug"});
    });
  });

  
  router.put("/:id", (req,res,next)=>{

   
    const drug = new Drug({
      _id: req.body.id,
      name: req.body.name,
      pharmacy: req.body.pharmacy,
      type: req.body.type
    });
    console.log(drug);
    Drug.updateOne({_id: req.params.id}, drug).then(result => {
      console.log(result);
      res.status(200).json({message : "Update Successful !"});
    },err=>{
      console.log(err);
      res.status(204).json({message : "error updating drug"});
    });
  });

  router.get("/stock",(req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;

    const pharmacyId = req.query.pharmacyId;
    var postQuery;
    if(pharmacyId){
      postQuery = Drug.find({pharmacy:pharmacyId});
  
    }else{
      postQuery = Drug.find();
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
      res.status(204).json({message : "error reading Drug list"});
    });
  });

  router.get("/:id",(req,res,next)=>{
    Drug.findById(req.params.id).then(drug =>{
      if(drug){
        res.status(200).json(drug);
      }else{
        res.status(200).json({message:'drug not found'});
      }
    },err=>{
      console.log(err)
      res.status(204).json({message:'drug not found'});
    });
  });

  

  
    
  router.get("/byType/:type",(req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Drug.find({ type: req.params.type  },);
    if(pageSize && currentPage){
      postQuery
        .skip(pageSize * (currentPage-1))
        .limit(pageSize);
    }
    postQuery.then(documents=>{
      res.status(200).json(documents);
    },err=>{
      console.log(err);
      res.status(204).json({message : "error reading Drug list"});
    });
  });
  

  
router.delete("/:id", (req, res, next) => {
    Drug.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: 'drug deleted!' });
    },err=>{
      console.log(err)
      res.status(204).json({message:'Drug not found'});
    });
  });
  


  module.exports = router;
