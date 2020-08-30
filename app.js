const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const days = require(__dirname+"/days.js");

app=express();

app.set('view engine','ejs');

app.use(express.static('static'));
app.use(bodyParser.urlencoded(
  { extended:true }
));

// const items=["Buy Food","Cook Food","Eat Food"];
// const workItems=[];

mongoose.connect("mongodb://localhost:27017/todolistDB", { useUnifiedTopology: true ,useNewUrlParser: true });

// Items Schema
const itemSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, "No name specified."]
  }
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Code"
});

const item2 = new Item({
  name: "Eat"
});

const item3 = new Item({
  name: "Sleep"
});

const defaultItems=[item1,item2,item3];
// Item.insertMany(defaultItems, function (err){
//   if (err){
//       console.log(err);
//   } else{
//       console.log("Successfully saved all the items!");
//   }
// });

app.get('/',function(req,res){
    // let day = days.getDate();
    Item.find({},function(err,foundItems){

      if(foundItems.length==0){
        Item.insertMany(defaultItems, function (err){
          if (err){
              console.log(err);
          } else{
              console.log("Successfully saved all the items!");
          }
        });
        res.redirect("/");
      }else{
        res.render("list",{listTitle:"ToDo List, Today",newListItems:foundItems});
      }
    });
    
});

app.post("/",function(req, res){

  let item=req.body.item;

  // if(req.body.list==="Work"){
  //   workItems.push(item); 
  //   res.redirect("/work");
  // }else{
  //   items.push(item); 
  //   res.redirect("/");
  // }
  const newItem = new Item({
    name: item
  });

  newItem.save();
  res.redirect("/");

});

app.post("/delete",function(req, res){

  const checkedItemID=req.body.checkbox;
  console.log(checkedItemID);
  Item.findByIdAndRemove(checkedItemID,function(err){
    if (!err){
      console.log("Successfully deleted item!");
    }else{
      console.log("Could not delete the item!");
      console.log(err);
    }
    res.redirect("/");
  });

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