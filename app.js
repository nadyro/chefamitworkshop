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

var recipe_file_index = 0;
app.get("/", function (request, response) {
    //Displaying ingredients stored in DB
    Ingredient.find({}, function (error, ingredient) {
        if (error)
            console.log(error);
        else
            response.render("index", { elements: ingredient });
    });
});
app.get("/recipes", function (request, response) {
    response.render("recipes");
});
app.get("/recipes/:ele", function (request, response) {
    if (request.query.recipe) {
        if (recipe_file_index == request.query.recipes.length)
            recipe_file_index = 0;
        var recipe_ingredients = request.query.recipe.ingredients;
        var obj = Object.keys(recipe_ingredients);
        var obj_len = obj.length;
        var available_ingredients = [];
        var recipe_file;
        var recipe_name;
        Ingredient.find({}, function (error, ingredients) {
            if (error)
                console.log(error);
            else {
                ingredients.forEach(function (name) {
                    obj.forEach(function (ingredient_name) {
                        if (ingredient_name.localeCompare(name.name) == 0)
                            available_ingredients.push(ingredient_name);
                    });
                });
                if (obj.length == available_ingredients.length) {
                    request.query.recipe["recipe_file"] = request.query.recipes[recipe_file_index++];                    
                    recipe_file = request.query.file_name;
                    recipe_name = request.query.recipe.name;
                    response.send({
                        ingredients: available_ingredients,
                        recipe_name: recipe_name,
                        recipe_file: recipe_file
                    });
                    console.log("You have the ingredients to make " + request.query.recipe.name + "!");
                }
            }
        });
    }
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