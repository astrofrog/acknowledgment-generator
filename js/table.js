
var checkboxes = [];
var data = {};

function accordionHeader(title, i) {
    return '<div class="panel">' +
        '<div class="panel-heading">' +
        '   <h3 class="panel-title">' +
        '       <a data-toggle="collapse" data-parent="#accordion" href="#accordion'+i+'">' +
                    title +
        '       </a>' +
        '   </h3>' +
        '</div>' +
        '<div id="accordion'+i+'" class="panel-collapse collapse">' +
        '   <div class="panel-body">';
}

function accordionFooter() {
    return '</div></div></div>';
}

function build_table(filterString) {

    checkboxes = [];
    $.each(data, function(i, category) {

        var accordion = accordionHeader(category.title, i);
        accordion += '<div class="table-responsive"><table class="table">';

        var filteredEntries = category.content.filter(function(val) {
            if (filterString === 'undefined') {
                return true;
            }
            return val.toLowerCase().indexOf(filterString.toLowerCase()) != -1;
        });

        $.each(filteredEntries, function(j, entry) {

            accordion += '<tr><td>';
            accordion += '<input type="checkbox" name="checkbox_' + category.short + '" id="' + category.short + '_' + entry+ '" value="' + entry + '"> ';

            if(typeof(entry.url) != 'undefined') {
                accordion += ' <a href="' + entry.url + '">' + entry.name + '\n</a>\n';
            } else {
                accordion += ' ' + entry.name + '\n';
            }

            accordion += "</td></tr>";

            checkboxes.push({
                'id': category.short + '_' + entry,
                'value': entry,
                'name': entry.name
            });
        });

        accordion += "</table></div>";
        accordion += accordionFooter();

        $('#data-table > tbody:last-child').append(accordion);
    });
}

$(document).ready(function() {
    $.getJSON('database.json', function(jsonData) {
        data = jsonData;
        build_table($('#search-input').value);
    });

    $('#search-input').on('input', function(){
        build_table($('#search-input').value);
    });

});
