
var checkboxes = [];
var data = {};

function accordionHeader(category, i, filteredEntriesCount, filterString) {
    var hasFilterString = (filterString !== undefined && filterString.length > 0);
    var opened = (hasFilterString && filteredEntriesCount > 0) || filteredEntriesCount == 0;

    return '' +
        '<div class="panel">' +
        '   <div class="panel-heading">' +
        '       <h3 class="panel-title">' +
        '           <a data-toggle="collapse" data-parent="#accordion" href="#accordion'+i+'">' +
                        category.title +
        '           </a>' +
        '       </h3>' +
        '   </div>' +
        '   <div id="accordion'+i+'" class="panel-collapse collapse ' + ((opened) ? 'in': '') + '">' +
        '       <div class="panel-body">' +
        '           <div class="table-responsive"><table class="table" name="' + category.short + '">';
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

function buildEntryTable(filterString) {

    clearTableBody();
    checkboxes = [];

    $.each(data, function(i, category) {

        var filteredEntries = filterCategoryEntries(category.entries, filterString);
        var accordion = accordionHeader(category, i, filteredEntries.length, filterString);

        if (filteredEntries.length == 0) {
            accordion += emptyTableRow();
        }
        else {
            $.each(filteredEntries, function(j, entry) {

                accordion += '<tr><td>';
                accordion += '<input type="checkbox" name="check" class="entry-checkbox" value="' + entry.name + '"> ';

                if(typeof(entry.url) != 'undefined') {
                    accordion += '&nbsp;<a href="' + entry.url + '" class="entry">' + entry.name + '\n</a>\n';
                } else {
                    accordion += '&nbsp;' + entry.name + '\n';
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

function buildAckText() {
    var selectedCheckboxes = $(':checkbox[name=check]:checked');

    if (selectedCheckboxes.length == 0) {

    }
    else {
        $.each(selectedCheckboxes, function(i, box) {
            console.log(box.value + $(box).closest('table').attr('name'));
        });
    }
}

$(document).ready(function() {
    $.getJSON('database.json', function(jsonData) {
        data = jsonData;
        buildEntryTable($('#search-input').val());
        $('.entry-checkbox').click(function () {
            buildAckText();
        });
    });

    $('#search-input').on('input', function(){
        build_table($('#search-input').val());
    });
});
