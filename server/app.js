const express = require('express');
const app = express();
var port = 4000;

var mongojs = require("mongojs");
var Promise = require("promise");
var db = mongojs("waterflowdb");


app.get('/',function(req,res){
  res.send("IoT Protocol ready at port :"+port);
});

app.get('/write/:data',function(req,res){
  var strParseWriteReq = JSON.stringify(req.params);
  var strWriteReq = JSON.parse(strParseWriteReq);
  data = strWriteReq.data;
  writedata(data,res,false);
});

app.get('/write/leak/:data',function(req,res){
  var strParseWriteReq = JSON.stringify(req.params);
  var strWriteReq = JSON.parse(strParseWriteReq);
  data = strWriteReq.data;
  writedata(data,res,true);
});

app.get('/read/:datasize',function(req,res){
  var strParseReadReq = JSON.stringify(req.params);
  var strReadReq = JSON.parse(strParseReadReq);
  datasize = strReadReq.datasize;
  readdata(datasize,res,false);
});

app.get('/read/leak/:datasize',function(req,res){
  var strParseReadReq = JSON.stringify(req.params);
  var strReadReq = JSON.parse(strParseReadReq);
  datasize = strReadReq.datasize;
  readdata(datasize,res,true);
});


app.listen(port,function(){
  var nodeStartTime = new Date();
  console.log("IoT protocol running on port " + port + " start at " + nodeStartTime);
});


async function writedata(_data,res,leak){
  await writeDataToDB(_data,res,leak);
}

function writeDataToDB(_savedata,res,leak){
  return new Promise(function(resolve,reject){
    var writecollection = (leak) ? db.collection('waterleakcol') : db.collection('waterflowcol');
    writecollection.insert({
      recordTime:new Date().getTime(),
      data:Number(_savedata),
    },function(err){
      if(err){
        console.log(err);
        res.send(String(err));
      }else {
        console.log('record data ok');
        res.send('record data ok');
      }
    });
  });
}

async function readdata(_datasize,res,leak){
  await readDataFromDB(_datasize,res,leak);
}

function readDataFromDB(_datasize,res,leak){
  return new Promise(function(resolve,reject){
    var readcollection = (leak) ? db.collection('waterleakcol') : db.collection('waterflowcol');
    readcollection.find({}).limit(Number(_datasize)).sort({recordTime:-1},function(err,docs){
      res.jsonp(docs);
    });
  });
}
