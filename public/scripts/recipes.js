$(document).ready(function () {
    var recipe;
    var recipes = ["cookies", "goolash", "onion-soup", "poached-egg", "tomato-salad"];

    $(".available_recipes").click(function () {
        recipes.forEach(function (class_name, i) {
            $.ajax({
                url: "/json/" + class_name + ".json",
                type: "GET",
                complete: function (infos) {
                    recipe = infos.responseJSON;
                    $.ajax({
                        url: "/recipes/" + class_name,
                        type: "GET",
                        data: { recipe: recipe, recipes: recipes, file_name: recipes[i] },
                        complete: function (res) {
                            var recipe_file = res.responseJSON.recipe_file;
                            var recipe_name = res.responseJSON.recipe_name;
                            var ingredients = res.responseJSON.ingredients;
                            var liste_ingredients = "<div class='liste_ingredients'>";
                            var recipe_img = "";
                            if ($(".recipes").hasClass(recipe_file)) {
                                $("." + recipe_file).css("display", "inline-block");
                                recipe_img += "<img class='img_recipe' src='images/img_" + i + ".jpg'>";
                                $("." + recipe_file + "_img").html(recipe_img);
                                $("." + recipe_file + "_name").html(recipe_name);
                                ingredients.forEach(function (ingredient) {
                                    liste_ingredients += "<p>" +
                                        ingredient.i_name.toUpperCase() + " : " +
                                        ingredient.q +
                                        "</p>"
                                });
                                liste_ingredients += "</div>"
                                $("." + recipe_file + "_ingredients").html(liste_ingredients);
                            }
                        }
                    });
                }
            });
        });
    });
});