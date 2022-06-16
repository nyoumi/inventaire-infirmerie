const express = require("express");
const router = express.Router();

const Store = require('../models/store');

/**
 * add Store
 *   name: {type: String , require:true,unique:true},
  pharmacy: {type: String , require:true},
  quantity: {type: Number  , require:true,default: 0},
  lastExpireDate: {type: Date , require:false},
  type: {type: String , require:true},
 */

  router.post("/",(req,res,next)=>{
    const url =req.protocol + '://' + req.get("host");
    const store = new Store({
      name: req.body.name,
      contact: req.body.contact,
      town: req.body.town,
      localisation: req.body.localisation

      //imagePath : url + "/images/" + req.file.filename
      });
      store.save().then(createdStore=>{
    res.status(201).json({      
          ...createdStore._doc
        });
    },err=>{
      console.log(err);
      res.status(204).json({message : "error creating Store"});
    });
  });

  
  router.put("/:id", (req,res,next)=>{

   
    const store = new Store({
      _id: req.body.id,
      name: req.body.name,
      contact: req.body.contact,
      town: req.body.town,
      localisation: req.body.localisation
    });
    console.log(store);
    Store.updateOne({_id: req.params.id}, store).then(result => {
      console.log(result);
      res.status(200).json(result._doc);
    },err=>{
      console.log(err);
      res.status(204).json({message : "error updating Store"});
    });
  });

  router.get("/",(req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Store.find();
    if(pageSize && currentPage){
      postQuery
        .skip(pageSize * (currentPage-1))
        .limit(pageSize);
    }
    postQuery.then(documents=>{
      res.status(200).json(documents);
    },err=>{
      console.log(err);
      res.status(204).json({message : "error reading Store list"});
    });
  });

  router.get("/:id",(req,res,next)=>{
    Store.findById(req.params.id).then(store =>{
      if(store){
        res.status(200).json(store);
      }else{
        res.status(200).json({message:'Store not found'});
      }
    },err=>{
      console.log(err)
      res.status(204).json({message:'Store not found'});
    });
  });

  
router.delete("/:id", (req, res, next) => {
    Store.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: 'Store deleted!' });
    },err=>{
      console.log(err)
      res.status(204).json({message:'Store not found'});
    });
  });
  

  module.exports = router;
