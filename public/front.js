$(document).ready(function () {
    var edit_click = 1;

    $(".delete_icon").click(function () {
        var parent = $(this).parent();
        $.ajax({
            url: "/deleteElement",
            type: "GET",
            data: { id: $(this).attr("elem-id") },
            complete: function () {
                parent.parent().hide();
            }
        },
        );
    });

    $(".plus_button").click(function () {
        var element_id = $(this).attr("elem-id");
        var element_unit = $(".ingredient_unit_" + element_id);
        var element_qty = $(".ingredient_quantity_" + element_id);
        var quantity = Number(element_qty.attr("elem-qty"));
        var unit = element_unit.attr("elem-unit");

        if (unit.localeCompare("milliliters") == 0 || unit.localeCompare("grams") == 0 || unit.localeCompare("milligrams") == 0)
            quantity += 100;
        else
            quantity++;
        $.ajax({
            url: "/quantity/add/" + quantity,
            type: "GET",
            data: {
                id: element_id
            },
            complete: function (result) {
                element_qty.attr("elem-qty", quantity);
                element_qty.html(quantity);
            }
        });
    });

    $(".minus_button").click(function () {
        var element_id = $(this).attr("elem-id");
        var element_unit = $(".ingredient_unit_" + element_id);
        var element_qty = $(".ingredient_quantity_" + element_id);
        var quantity = Number(element_qty.attr("elem-qty"));
        var unit = element_unit.attr("elem-unit");

        if (unit.localeCompare("milliliters") == 0 || unit.localeCompare("grams") == 0 || unit.localeCompare("milligrams") == 0)
            quantity -= 100;
        else
            quantity--;
        if (quantity < 0)
            quantity = 0;
        if (quantity >= 0) {
            $.ajax({
                url: "/quantity/minus/" + quantity,
                type: "GET",
                data: {
                    id: element_id
                },
                complete: function (result) {
                    element_qty.attr("elem-qty", quantity);
                    element_qty.html(quantity);
                }
            });
        }
    });

    $(".edit_button").click(function () {
        var element_id = $(this).attr("elem-id");
        var element_unit = $(".ingredient_unit_" + element_id);
        var element_qty = $(".ingredient_quantity_" + element_id);
        var element_name = $(".ingredient_name_" + element_id);
        var quantity = Number(element_qty.attr("elem-qty"));
        var unit = element_unit.attr("elem-unit");
        var name = element_name.attr("elem-name");

        edit_click++;
        if (edit_click % 2 == 0) {
            $(".add_update_title").html("Update");
            $("form").attr("action", "/addElement/update");
            $(this).children("a").html("Cancel");
        }
        else {
            $(".add_update_title").html("Add");
            $("form").attr("action", "/addElement/add");
            $(this).children("a").html("Edit");
            $("input[name=ingredient_id]").val("");
            $("input[name=ingredient_name]").val("");
            $("input[name=ingredient_quantity]").val("");
            $(".ingredient_unit").val("");
        }
        $("input[name=ingredient_id]").val(element_id);
        $("input[name=ingredient_name]").val(name);
        $("input[name=ingredient_quantity]").val(quantity);
        $(".ingredient_unit").val(unit);
    });
});