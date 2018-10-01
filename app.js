var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/amits_workshop", { useNewUrlParser: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Creating ingredients model so Chief Amit can find his stuff easier.
var ingredientModel = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String
});
var Ingredient = mongoose.model("Ingredient", ingredientModel);
var recipe_file_index = 0;

app.get("/", function (request, response) {
    // Displaying ingredients stored in DB
    Ingredient.find({}, function (error, ingredient) {
        if (error)
            console.log(error);
        else
            response.render("index", { elements: ingredient });
    });
});

// Fetch recipes from file in /json 
// and check their availability comparing the ingredients needed to those in DB.
app.get("/recipes/:ele", function (request, response) {
    if (request.query.recipe) {
        var recipe_ingredients = request.query.recipe.ingredients;
        var obj = Object.keys(recipe_ingredients);
        obj.forEach(function (o) {
            if (recipe_ingredients[o] === 'true')
                recipe_ingredients[o] = 0;
        });
        var available_ingredients = [];

        if (recipe_file_index == request.query.recipes.length)
            recipe_file_index = 0;
        Ingredient.find({}, function (error, ingredients) {
            if (error)
                console.log(error);
            else {
                ingredients.forEach(function (name) {
                    obj.forEach(function (ingredient_name, i) {
                        if (ingredient_name.localeCompare(name.name) == 0
                            && (name.quantity >= recipe_ingredients[ingredient_name]))
                            available_ingredients.push({
                                i_name: ingredient_name,
                                q: recipe_ingredients[ingredient_name],
                                index: i
                            });
                    });
                });
                if (obj.length == available_ingredients.length) {
                    request.query.recipe["recipe_file"] = request.query.recipes[recipe_file_index++];
                    response.send({
                        ingredients: available_ingredients,
                        recipe_name: request.query.recipe.name,
                        recipe_file: request.query.file_name
                    });
                }
            }
        });
    }
});

// Update && add in one function
app.post("/addElement/:manage", function (request, response) {
    var id = request.body.ingredient_id;
    var element = request.body.ingredient_name;
    var quantity = request.body.ingredient_quantity;
    var unit = request.body.ingredient_unit;
    var new_element = { name: element, quantity: quantity, unit: unit };
    var i;

    i = id;
    if (request.params.manage.localeCompare("update") == 0) {
        // Updating existing ingredients
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
        // Creating new ingredients
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

// Delete an ingredient
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

// Function to manage adding or reducing quantity.
// the HTML classes are respectively and elegantly named : plus_button and minus_button
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