
var checkboxes = [];
var data = {};

function accordionHeader(title, i, opened) {
    return '<div class="panel">' +
        '<div class="panel-heading">' +
        '   <h3 class="panel-title">' +
        '       <a data-toggle="collapse" data-parent="#accordion" href="#accordion'+i+'">' +
                    title +
        '       </a>' +
        '   </h3>' +
        '</div>' +
        '<div id="accordion'+i+'" class="panel-collapse collapse ' + ((opened) ? 'in': '') + '">' +
        '   <div class="panel-body">';
}

function accordionFooter() {
    return '</div></div></div>';
}

function build_table(filterString) {

    var new_tbody = document.createElement('tbody');
    var old_tbody = $('#data-table').find('tbody');
    old_tbody.replaceWith(new_tbody);

    checkboxes = [];
    $.each(data, function(i, category) {

        var hasFilterString = (filterString !== undefined && filterString.length > 0);

        var filteredEntries = category.entries.filter(function(entry) {
            if (hasFilterString == false) {
                return true;
            }
            return entry.name.toLowerCase().indexOf(filterString.toLowerCase()) != -1;
        });

        var opened = (hasFilterString && filteredEntries.length > 0) || filteredEntries.length == 0;
        var accordion = accordionHeader(category.title, i, opened);
        accordion += '<div class="table-responsive"><table class="table">';

        $.each(filteredEntries, function(j, entry) {

            accordion += '<tr><td>';
            accordion += '<input type="checkbox" name="checkbox_' + category.short + '" id="' + category.short + '_' + entry+ '" value="' + entry + '"> ';

            if(typeof(entry.url) != 'undefined') {
                accordion += ' <a href="' + entry.url + '">' + entry.name + '\n</a>\n';
            } else {
                accordion += ' ' + entry.name + '\n';
            }

            accordion += '</td></tr>';

            checkboxes.push({
                'id': category.short + '_' + entry,
                'value': entry,
                'name': entry.name
            });
        });

        if (filteredEntries.length == 0) {
            accordion += '<tr><td><i>(no entry)</i></td></tr>';
        }

        accordion += "</table></div>";
        accordion += accordionFooter();

        $('#data-table > tbody:last-child').append(accordion);
    });
}

$(document).ready(function() {
    $.getJSON('database.json', function(jsonData) {
        data = jsonData;
        build_table($('#search-input').val());
    });

    $('#search-input').on('input', function(){
        build_table($('#search-input').val());
    });

});
