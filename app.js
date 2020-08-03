const express = require('express');
const bodyParser = require('body-parser');
const days = require(__dirname+"/days.js");

app=express();

app.set('view engine','ejs');

app.use(express.static('static'));
app.use(bodyParser.urlencoded(
  { extended:true }
));

let items=["Buy Food","Cook Food","Eat Food"];
let workItems=[];

app.get('/',function(req,res){
    let day = days.getDate();
    res.render("list",{listTitle:day,newListItems:items});
});

app.post("/",function(req, res){

  let item=req.body.item;

  if(req.body.list==="Work"){
    workItems.push(item); 
    res.redirect("/work");
  }else{
    items.push(item); 
    res.redirect("/");
  }
 
});

app.get('/work',function(req,res){
  res.render("list",{listTitle:"Work List",newListItems:workItems});
});

app.post("/work",function(req, res){
  let item=req.body.item;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(3000,function(){
    console.log('Server started at port 3000');
})