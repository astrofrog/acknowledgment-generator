// I have not written Javascript before so any comments welcome :)

// Load JSON database of acknowledgments
$.getJSON("database.json", show_checkboxes);

function show_checkboxes(data) {
  // Display the checkboxes for the provided JSON data

  // var checkedBoxes = get_checked_boxes("checkbox_options");

  content = ""

  for (var i = 0; i < data.length; i++) {

    category = data[i]

    content += '<h3 class="expandable">' + category.title + '</h3>\n<div class="options"><ul>'

    for (var short_name in category.content) {
      content += '<li><input type="checkbox" name="checkbox_' + category.short
                 + '" value="' + short_name
                 + '" onchange="box_checked()">'

      if(typeof(category.content[short_name].url) != 'undefined') {
        content += '<a href="' + category.content[short_name].url + '">'
                   + category.content[short_name].name + '\n'
                   + '</a>\n';
      } else {
        content += category.content[short_name].name + '\n';
      }
    }

    content += '</div></ul>'

  }

  document.getElementById("main_check").innerHTML = content;

  jQuery(document).ready(function(){
    $('.expandable').click(function() {
        $(this).next().toggle();  // add 'slow' to toggle() to animate
        return false;
    }).next().hide();
  });

}

function box_checked() {

  // // Resolve dependencies
  // var checkedBoxes = get_checked_boxes("checkbox_" + category.short);
  // for (var j = 0; j < checkedBoxes.length; j++) {
  //   resolve_dependents(checkedBoxes[i])
  // }
  //
  // When a box gets checked, update the acknowledgment
  $.getJSON("database.json", show_acknowledgment);

}

function show_acknowledgment(data) {
  // Display the acknowledgment corresponding to the checked boxes

  // Get this from latex checkbox
  var latex_checkbox = document.getElementById("option_latex");
  var facilities_checkbox = document.getElementById("option_facilities");
  
  main_text = "<h2>Suggested acknowledgment</h2>";
  bibtex_text = "<h2>BibTeX</h2>"

  facilities = [];

  for (var i = 0; i < data.length; i++) {

    category = data[i]
    
    var checkedBoxes = get_checked_boxes("checkbox_" + category.short);
    for (var j = 0; j < checkedBoxes.length; j++) {

      if (latex_checkbox.checked) {
        if (category.content[checkedBoxes[j].value].latex) {
          text = category.content[checkedBoxes[j].value].latex
        } else {
          text = category.content[checkedBoxes[j].value].text
        }
        if (category.content[checkedBoxes[j].value].bibtex) {
          bibtex_text += category.content[checkedBoxes[j].value].bibtex + "<br><br>"
        }
      } else {
        text = category.content[checkedBoxes[j].value].text
      }
      main_text += text + " ";

      if (facilities_checkbox.checked) {
        if (category.content[checkedBoxes[j].value].facilities) {
          facilities.push(category.content[checkedBoxes[j].value].facilities);
        }
      }

    }

  }

  facilities_text = "<h2>Facilities</h2>"
  if(facilities.length > 0) {
    facilities_text += "\\textit{Facilities:}" + facilities.join(", ")
  }
  document.getElementById("ack_main").innerHTML = main_text;

  if(latex_checkbox.checked) {
    document.getElementById("ack_bibtex").innerHTML = bibtex_text;
  } else {
    document.getElementById("ack_bibtex").innerHTML = "";
  }

  if(facilities_checkbox.checked) {
    document.getElementById("ack_facilities").innerHTML = facilities_text;
  } else {
    document.getElementById("ack_facilities").innerHTML = "";
  }


}


function get_checked_boxes(checkbox_name) {
  // Find all checked checkboxes

  var checkboxes = document.getElementsByName(checkbox_name);
  var checkboxes_checked = [];

  // loop over them all
  for (var k = 0; k < checkboxes.length; k++) {
    // And stick the checked ones onto an array...
    if (checkboxes[k].checked) {
      checkboxes_checked.push(checkboxes[k]);
    }
  }
  // Return the array if it is non-empty, or null
  return checkboxes_checked;
}


$.getJSON("database.json", show_acknowledgment);


