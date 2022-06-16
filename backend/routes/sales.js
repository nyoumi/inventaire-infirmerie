const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const Sales = require('../models/sales');
const Drug = require('../models/drugs');

router.post("",(req,res,next)=>{
  const sales = new Sales({
    drugName: String= req.body.drugName,
    drugId: req.body.drugId,
    dateTime:Date= req.body.dateTime,
    quantity :Number=  req.body.quantity,
    pharmacy: req.body.pharmacy,
    user_cuid : req.body.user_cuid
  });


    Drug.findById(sales.drugId).then(drug =>{
      if(drug){
        drug.quantity=(drug.quantity|| 0) - sales.quantity;
        console.log(drug)

        if(drug.quantity>=0){
          Drug.updateOne({_id: sales.drugId}, drug).then(result => {
            console.log(result);
            sales.save().then(createdSale=>{
              res.status(200).json(createdSale);
            })
           
          },err=>{
            console.log(err);
            res.status(204).json({message : "error updating drug"});
          });
        }
        

       
      }else{
        res.status(204).json({message:'Inventory not found'});
      }
    },err=>{
      console.log(err)
      res.status(204).json({message : "error updating drug"});
      
    });
 

  });

  router.get("/",(req,res,next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;

    const pharmacyId = req.query.pharmacyId;
    const drugId = req.query.drugId;


    var postQuery

    if(drugId){
       postQuery = Sales.find({drugId:drugId});
  
    }else{
      if(pharmacyId){
         postQuery = Sales.find({pharmacy:pharmacyId});
    
      }else{
         postQuery = Sales.find();
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
      res.status(204).json({message : "error reading sales list"});
    });
  });

  router.get("/:id",(req,res,next)=>{
    Sales.findById(req.params.id).then(sale =>{
      if(sale){
        res.status(200).json(sale);
      }else{
        res.status(200).json({message:'sale not found'});
      }
    },err=>{
      console.log(err)
      res.status(204).json({message:'sale not found'});
    });
  });


  router.get("/getSalesChartInfo",(req,res,next)=>{

    Sales.aggregate([{ "$project": {
                                        "paidAmount": 1,
                                        "month": { "$month": "$dateTime" }
                                    }},
                                    { "$group": {
                                        "_id": "$month",
                                        "total": { "$sum": { $toDouble: "$paidAmount" }}
                                    }}
                                  ])
    .then(documents=>{
      res.status(200).json(
        documents
      );
    });
  });



  module.exports = router;
