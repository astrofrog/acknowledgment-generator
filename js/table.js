
// These 2 objects are somewhet redundant, but for now, that works.
var data = {};
var flatDataObject = {};

// Returns the start of the HTML code used for the category accordions.
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
        '           <div class="table-responsive"><table class="table table-hover" name="' + category.short + '">';
}

// Returns the end of the HTML code used for the category accordions.
function accordionFooter() {
    return '</table></div></div></div></div>';
}

// Replace the table content with an empty content
function clearTableBody() {
    $('#data-table').find('tbody').replaceWith(document.createElement('tbody'));
}

// Filter the provided entries according to the filter string
function filterCategoryEntries(entries, filterString) {
    return entries.filter(function(entry) {
        if (filterString === undefined || filterString.length == 0) {
            return true;
        }
        return entry.name.toLowerCase().indexOf(filterString.toLowerCase()) != -1;
    });
}

// Separated in mini-function the day we need to specify for more attributes
function tableRowStart() {
    return '<tr><td class="entry">';
}

function tableRowEnd() {
    return '</td></tr>';
}

function emptyTableRow() {
    return tableRowStart() + '<i>(no entry)</i>' + tableRowEnd();
}

function emptyText() {
    return '<i>(empty)</i>'
}

function entryTableRow(entry) {
    var entryText = tableRowStart();

    entryText += '<input type="checkbox" name="check" class="entry-checkbox" value="' + entry.name + '"> ';

    if(typeof(entry.url) != 'undefined') {
        entryText += '&nbsp;<a href="' + entry.url + '">' + entry.name + '\n</a>\n';
    } else {
        entryText += '&nbsp;' + entry.name + '\n';
    }

    entryText += tableRowEnd();
    return entryText;
}

// Put all the data flat: no categories. Not needed at least for the acknowledgement text.
function buildDataObject() {
    flatDataObject = {};
    $.each(data, function(i, category) {
        $.each(category.entries, function(j, entry) {
            flatDataObject[entry.name] = {'text': entry.text, 'url': entry.url};
        });
    });
}

// Build the entries table
function buildEntryTable(filterString) {

    clearTableBody();

    $.each(data, function(i, category) {

        var filteredEntries = filterCategoryEntries(category.entries, filterString);
        var accordion = accordionHeader(category, i, filteredEntries.length, filterString);

        if (filteredEntries.length == 0) {
            accordion += emptyTableRow();
        }
        else {
            $.each(filteredEntries, function(j, entry) {
                accordion += entryTableRow(entry);
            });
        }

        accordion += accordionFooter();
        $('#data-table > tbody:last-child').append(accordion);
    });
}

function buildAckText() {
    var selectedCheckboxes = $(':checkbox[name=check]:checked');

    if (selectedCheckboxes.length == 0) {
        $(".tab-content > #ack").html(emptyText());
    }
    else {
        $(".tab-content > #ack").html("");
        $.each(selectedCheckboxes, function(i, box) {
            var name = $(box).val();
            $(".tab-content > #ack").append(flatDataObject[name].text+"&nbsp;");
        });
    }
}

function bindSearchInputAndCheckboxes() {
    // Trigger the build of acknowledgements text upon checkbox click
    $('.entry-checkbox').click(function () {
        buildAckText();
    });

    // Also trigger that build when clicking the table row (and making the checkbox state right)
    $('#data-table').find('tr').click(function () {
        $(this).find('.entry-checkbox').prop('checked', function (i, value) {
            return !value;
        });
        buildAckText();
    });

    $('#search-input').on('input', function(){
        buildEntryTable($('#search-input').val());
    });

}

$(document).ready(function() {
    $.getJSON('database.json', function(jsonData) {
        data = jsonData;
        buildDataObject();
        buildEntryTable($('#search-input').val());
        bindSearchInputAndCheckboxes();
    });

});
