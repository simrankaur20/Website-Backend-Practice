//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true })


app.get("/", function (req, res) {

  Item.find({}, function (err, founditems) {

    if (founditems.length === 0) {
      Item.insertMany(defaultitems, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Success saves");
        }
      });
      res.redirect("/");
    }
    else {
      res.render("list", { listTitle: "Today", newListItems: founditems });
    }
  })


});



app.get("/:id", function (req, res) {
  const customListName = _.capitalize(req.params.id);
  List.findOne({ name: customListName }, function (err, result) {
    if (err) {
      console.log(err);
    }
    else {
      if (!result) {
        const list = new List({
          name: customListName,
          items: defaultitems
        });

        list.save();
        res.redirect("/" + customListName);
      }
      else {
        res.render("list", { listTitle: result.name, newListItems: result.items });
      }
    }
  });

});


const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to Do List"
});

const item2 = new Item({
  name: "Study"
});

const item3 = new Item({
  name: "sleep"
});

const defaultitems = [item1, item2, item3];



const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const List = mongoose.model("List", listSchema);


app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const itemcurr = new Item({
    name: itemName
  });

  if (listName === "Today") {
    itemcurr.save();
    res.redirect("/");
  }
  else {
    List.findOne({ name: listName }, function (err, result) {
      if (!err) {
        result.items.push(itemcurr);
        result.save();
        res.redirect("/" + listName);
      }
    })
  }

});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.Checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(checkedItemId + " Removed ");
      }
    })
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name: listName},{$pull : {items: {_id: checkedItemId}}},function(err,result){
      if(!err) {
        res.redirect("/"+ listName);
      }
    })
  }
})


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
