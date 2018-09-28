var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/amits_workshop");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Creating ingredients model so Chief Amit can find his stuff easier.
var ingredientModel = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String
});

var Ingredient = mongoose.model("Ingredient", ingredientModel);

app.get("/", function (request, response) {
    //Displaying ingredients stored in DB
    Ingredient.find({}, function (error, ingredient) {
        if (error)
            console.log(error);
        else
            response.render("index", { elements: ingredient });
    });
});
//Update && add in one function
app.post("/addElement/:manage", function (request, response) {
    var id = request.body.ingredient_id;
    var element = request.body.ingredient_name;
    var quantity = request.body.ingredient_quantity;
    var unit = request.body.ingredient_unit;
    var new_element = { name: element, quantity: quantity, unit: unit };
    var i;

    i = id;
    if (request.params.manage.localeCompare("update") == 0) {
        //Updating existing ingredients
        Ingredient.findByIdAndUpdate(i, new_element, function (error, ingredient) {
            if (error) {
                console.log("Couldn't update ingredient.");
                console.log(error);
            }
            else {
                console.log("Ingredient updated.");
                console.log(ingredient);
            }
        });
    }
    else {
        //Creating new ingredients
        Ingredient.create(new_element, function (error, ingredient) {
            if (error) {
                console.log("Couldn't save new ingredient.");
                console.log(error);
            }
            else {
                console.log("Ingredient added.");
                console.log(ingredient);
            }
        });
    }
    response.redirect("/");
});

app.get("/deleteElement", function (request, response) {
    var i;
    var index;

    index = 0;
    i = request.query.id;
    Ingredient.findByIdAndRemove(i, function (error, ingredient) {
        if (error) {
            console.log("Couldn't delete ingredient.");
            console.log(error);
        }
        else {
            console.log("Ingredient deleted.");
            console.log(ingredient);
        }
    });
    response.redirect("/");
});

//Function to manage adding or reducing quantity.
//the HTML classes are respectively and elegantly named : plus_button and minus_button
app.get("/quantity/:manage/:quantity", function (request, response) {
    var i;
    var index;
    var quantity;

    index = 0;
    i = request.query.id;
    quantity = { quantity: Number(request.params.quantity) };
    Ingredient.findByIdAndUpdate(i, quantity, function (error, ingredient) {
        if (error) {
            console.log("Couldn't update ingredient.");
            console.log(error);
        }
        else {
            console.log("Ingredient updated.");
            console.log(ingredient);
        }
    });
    response.redirect("/");
});

app.listen(3000, function (request, response) {
    console.log("Server is running.");
});