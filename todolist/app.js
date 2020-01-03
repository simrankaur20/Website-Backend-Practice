const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var items = ["buy food" , "cook food" , "eat food"];
app.set('view engine', 'ejs');

app.get("/" , function(req,res){
   
    var day = date.getDate();

    res.render("list" , {kindOfDay: day, newlistitems: items});
});


app.post("/", function(req,res){
    var item = req.body.newItem;
    items.push(item);

    res.redirect("/");
})

app.listen(3000, function(){
    console.log("server running on port 3000");
});