const express = require('express');
const bodyParser = require('body-parser');

app=express();

app.set(express.static('static'));
app.use(bodyParser.urlencoded(
  { extended:true }
));

app.get('/',function(req,res){
    res.send("Hello World!");
})

app.listen(3000,function(){
    console.log('Server started at port 3000');
})