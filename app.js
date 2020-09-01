const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

app = express();

app.set('view engine', 'ejs');

app.use(express.static('static'));
app.use(bodyParser.urlencoded(
  { extended: true }
));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useUnifiedTopology: true, useNewUrlParser: true });

// Items Schema
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "No name specified."]
  }
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todo list!"
});

const item2 = new Item({
  name: "Hit the + button to add an item to this list."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item from this list."
});

const defaultItems = [item1, item2, item3];

// List Schema
const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "No name specified."]
  },
  items: [itemSchema]
});

const List = mongoose.model("List", listSchema);

app.get('/', function (req, res) {
  Item.find({}, function (err, foundItems) {

    if (foundItems.length == 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved all the items!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });

});

app.post("/", function (req, res) {

  let item = req.body.item;
  const listName = req.body.list;

  const newItem = new Item({
    name: item
  });

  if (listName == "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {

      if (!err) {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + listName);
      }

    });
  }


});

app.post("/delete", function (req, res) {

  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName == "Today") {
    Item.findByIdAndRemove(checkedItemID, function (err) {
      if (!err) {
        console.log("Successfully deleted item!");
      } else {
        console.log("Could not delete the item!");
        console.log(err);
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemID } } }, function (err, foundList) {

      if (!err) {
        res.redirect("/" + listName);
      }

    });
  }



});

app.get('/:customListName', function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {

    if (!err) {
      if (!foundList) {
        // Create new list
        const newList = new List({
          name: customListName,
          items: defaultItems
        });

        newList.save();
        res.redirect("/" + customListName);
      } else {
        // Show existing list contents
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    }

  });



});

app.post("/work", function (req, res) {
  let item = req.body.item;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(3000, function () {
  console.log('Server started at port 3000');
})