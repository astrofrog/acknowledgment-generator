
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

    if (entry.dependencies !== undefined) {
        entryText += '<span class="subcontent-prefix">Depends on: </span><span class="subcontent">' + entry.dependencies +'</span>';
    }

    entryText += tableRowEnd();
    return entryText;
}

// Put all the data flat: no categories. Not needed at least for the acknowledgement text.
function buildDataObject() {
    flatDataObject = {};
    $.each(data, function(i, category) {
        $.each(category.entries, function(j, entry) {
            flatDataObject[entry.name.toLowerCase()] = entry;
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

function replaceTextContent(otherContent) {
    $(".tab-content > #ack").html(otherContent);
    $(".tab-content > #bib").html(otherContent);
    $(".tab-content > #fac").html(otherContent);
}

function appendAckBibFacText(entry) {
    var ack_text = (entry.latex !== undefined) ? entry.latex : entry.text;
    $(".tab-content > #ack").append(ack_text+"&nbsp;");

    var bib_text = (entry.bibtex !== undefined) ? entry.bibtex : '';
    $(".tab-content > #bib").append(bib_text+"&nbsp;");

    var fac_text = (entry.facilities !== undefined) ? entry.facilities : '';
    $(".tab-content > #fac").append(fac_text+"&nbsp;");
}

function buildAckBibFacText() {
    var selectedCheckboxes = $(':checkbox[name=check]:checked');

    if (selectedCheckboxes.length == 0) {
        replaceTextContent(emptyText());
    }
    else {
        replaceTextContent("");

        $.each(selectedCheckboxes, function(i, box) {
            var name = $(box).val();
            entry = flatDataObject[name.toLowerCase()];
            appendAckBibFacText(entry);

            if (entry.dependencies !== undefined) {
                var dependencyList = ($.type(entry.dependencies) == "string") ? entry.dependencies.split(',') : entry.dependencies;
                var cleanDependencyList = [];
                $.each(dependencyList, function(i, dependencyName) {
                    cleanDependencyList.push($.trim(dependencyName));
                });

                $.each(cleanDependencyList, function(i, dependencyName) {
                    var dependency = flatDataObject[dependencyName.toLowerCase()];
                    if (dependency !== undefined) {
                        appendAckBibFacText(dependency);
                    }
                    else {
                        console.log('[WARNING]: no acknowledgment entry for name "'+ dependencyName + '"')
                    }
                });
            }
        });
    }
}

function bindCheckboxes() {
    // Trigger the build of acknowledgements text upon checkbox click
    $('.entry-checkbox').click(function (event) {
        event.stopPropagation(); // To avoid triggering the action bound to the table row below.
        buildAckBibFacText();
    });

    // Also trigger that build when clicking the table row (and making the checkbox state right)
    $('#data-table').find('tr').click(function (event) {
        event.preventDefault();
        $(this).find('.entry-checkbox').prop('checked', function (i, value) {
            return !value;
        });
        buildAckBibFacText();
    });
}

function bindSearchInput() {
    $('#search-input').on('input', function(){
        buildEntryTable($('#search-input').val());
        bindCheckboxes();
    });
}

$(document).ready(function() {
    $.getJSON('database.json', function(jsonData) {
        data = jsonData;
        buildDataObject();
        buildEntryTable($('#search-input').val());
        bindSearchInput();
        bindCheckboxes();
    });

});
