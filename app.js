const express = require('express');
const bodyParser = require('body-parser');

app=express();

app.set('view engine','ejs');
app.set(express.static('static'));

app.use(bodyParser.urlencoded(
  { extended:true }
));

var items=["Buy Food","Cook Food","Eat Food"];

app.get('/',function(req,res){
    var today=new Date();
    
    var options={
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    };

    var day = today.toLocaleDateString("en-US",options);

    res.render("list",{kindOfDay:day,newListItems:items});
});

app.post("/",function(req, res){
  var item=req.body.item;
  items.push(item);
  res.redirect("/");
});

app.listen(3000,function(){
    console.log('Server started at port 3000');
})