
var checkboxes = [];
var data = {};

function accordionHeader(title, i, filteredEntriesCount, filterString) {
    var hasFilterString = (filterString !== undefined && filterString.length > 0);
    var opened = (hasFilterString && filteredEntriesCount > 0) || filteredEntriesCount == 0;

    return '' +
        '<div class="panel">' +
        '   <div class="panel-heading">' +
        '       <h3 class="panel-title">' +
        '           <a data-toggle="collapse" data-parent="#accordion" href="#accordion'+i+'">' +
                        title +
        '           </a>' +
        '       </h3>' +
        '   </div>' +
        '   <div id="accordion'+i+'" class="panel-collapse collapse ' + ((opened) ? 'in': '') + '">' +
        '       <div class="panel-body">' +
        '           <div class="table-responsive"><table class="table">';
}

function accordionFooter() {
    return '</table></div></div></div></div>';
}

function clearTableBody() {
    $('#data-table').find('tbody').replaceWith(document.createElement('tbody'));
}

function filterCategoryEntries(entries, filterString) {
    return entries.filter(function(entry) {
        if (filterString === undefined || filterString.length == 0) {
            return true;
        }
        return entry.name.toLowerCase().indexOf(filterString.toLowerCase()) != -1;
    });
}

function tableRowStart() {
    return '<tr><td>';
}

function tableRowEnd() {
    return '</td></tr>';
}

function emptyTableRow() {
    return tableRowStart() + '<i>(no entry)</i>' + tableRowEnd();
}

function build_table(filterString) {

    clearTableBody();
    checkboxes = [];

    $.each(data, function(i, category) {

        var filteredEntries = filterCategoryEntries(category.entries, filterString);
        var accordion = accordionHeader(category.title, i, filteredEntries.length, filterString);

        if (filteredEntries.length == 0) {
            accordion += emptyTableRow();
        }
        else {
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
        }

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
