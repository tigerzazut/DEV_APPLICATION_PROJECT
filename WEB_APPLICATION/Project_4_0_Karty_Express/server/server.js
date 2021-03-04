const express = require("express");
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require('mongoose');

const app = express();
const port = 3000;
const host = '127.0.0.1';


dotenv.config();
app.use(bodyparser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/karty');
mongoose.Promise = global.Promise;
var OBJ_TRACK = require("./model/model");

//CORS middleware
app.use(function(req,res,next){
    //enable CORS middlewareWrapper
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

function makeid(length){
    var result = 'KT0';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for(var i = 0; i<length; i++){
        result += characters.charAt(Math.floor(Math.random()*charactersLength));
    }
    return result;
}

//insert Data
app.post('/shipment',(req,res)=>{
    const s_name = req.body.s_name;
    const s_tel = req.body.s_tel;
    const r_name = req.body.r_name;
    const r_tel = req.body.r_tel;
    const r_address = req.body.r_address;
    const r_postcode = req.body.r_postcode;
    const r_province = req.body.r_province;
    
    const shipmentStatus = []
    const shipment = []
    var date = new Date();
    const dataEnter = date.toLocaleString('th-TH');
    const track_no = makeid(10);

    var NewObjTrack = new OBJ_TRACK({
    track_no: track_no,
    s_name: s_name,
    s_tel: s_tel,
    r_name: r_name,
    r_tel: r_tel,
    r_address: r_address,
    r_postcode: r_postcode,
    r_province: r_province,
    dataEnter: dataEnter,
    shipmentStatus: shipmentStatus,
    shipment: shipment
    });
    NewObjTrack.save((err,data)=>{
        if(err){
            console.log(err);
            res.send({status:'fail',msg:err})
        }
        console.log("Saved document successfully : ",data);
        res.send({status:'success',msg:data});
    });
});

//getAllTracks
app.get('/shipment',(req,res)=>{
    OBJ_TRACK.find({},(err,obj)=>{
        if(err){
            console.log(err);
            res.send({status:'fail',msg:err})
        }
        console.log("Find document successfully : ",obj);
        res.send({status:"success",msg:obj});
    });
});
//get Tracks With Track_no
app.get('/shipment/:trackNo',(req,res)=>{
    const trackNum = req.params.trackNo;
    OBJ_TRACK.find({"track_no":trackNum},(err,obj)=>{
        if(err){
            console.log(err);
            res.send({status:"fail",msg:err})
        }
        console.log("Find document successfully : ",obj);
        res.send({status:"success",msg:obj});
    });
});
//update shipment
app.put('/shipment/update',(req,res)=>{
    const track_no = req.body.track_no;
    const location = req.body.location;
    OBJ_TRACK.updateOne({"track_no":track_no},{$addToSet:{"shipment":{"location":location}}}).exec((err,data)=>{
        if(err){
            console.log(err);
            res.send({status:'fail',msg:err})
        }
        console.log("Updated document shipment successfully : ",data);
        res.send({status:'success',msg:data});
    });
});
//update status shipment
app.put('/shipment/status',(req,res)=>{
    const track_no = req.body.track_no;
    const status_req = req.body.status;
    OBJ_TRACK.updateOne({"track_no":track_no},{$addToSet:{"shipmentStatus":{"status":status_req}}}).exec((err,data)=>{
        if(err){
            console.log(err);
            res.send({status:'fail',msg:err})
        }
        console.log("Updated document shipment successfully : ",data);
        res.send({status:'success',msg:data});
    });
});


app.listen(port,host,()=>{
    console.log(`App Listening at http://${host}:${port}`);
});
