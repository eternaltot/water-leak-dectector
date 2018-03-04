var mongojs = require('mongojs');
var db = mongojs('waterflow');


function read(){
  var collection = db.collection("waterflowcol");
  collection.find({},function(err,docs){
    if(err) return console.log(err);
    console.log(docs);
    process.exit();
  });

}

read();
