
var checkboxes = [];

function build_table(data) {
    content = "";
    this.checkboxes = [];

    for (var i = 0; i < data.length; i++) {

        category = data[i];

        var accordion = '<div class="panel">' +
            '<div class="panel-heading">' +
            '   <h3 class="panel-title">' +
            '       <a data-toggle="collapse" data-parent="#accordion" href="#accordion'+i+'">' +
                        category.title +
            '       </a>' +
            '   </h3>' +
            '</div>' +
            '<div id="accordion'+i+'" class="panel-collapse collapse">' +
            '   <div class="panel-body">' +
            '       <div class="table-responsive"><table class="table">';

        for (var short_name in category.content) {
            accordion += '<tr><td>';
            accordion += '<input type="checkbox" name="checkbox_' + category.short + '" id="' + category.short + '_' + short_name+ '" value="' + short_name + '"> ';

            accordion += '&nbsp;';
            if(typeof(category.content[short_name].url) != 'undefined') {
                accordion += ' <a href="' + category.content[short_name].url + '">'
                    + category.content[short_name].name + '\n'
                    + '</a>\n';
            } else {
                accordion += ' '+category.content[short_name].name + '\n';
            }

            accordion += "</td></tr>";

            checkboxes.push({
                'id': category.short + '_' + short_name,
                'value': short_name,
                'name': category.content[short_name].name
            });
        }

        accordion += "</table></div></div></div></div>";

        $("#data-table > tbody:last-child").append(accordion);
    }
}

$(document).ready(function(){
    $.getJSON("database.json", build_table);
});
