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
  // When a box gets checked, update the acknowledgment
  $.getJSON("database.json", show_acknowledgment);
}

function show_acknowledgment(data) {
  // Display the acknowledgment corresponding to the checked boxes

  // Get this from latex checkbox
  var latex_checkbox = document.getElementById("checkbox_latex");
  
  var use_latex = latex_checkbox.checked;

  main_text = "";
  bibtex_text = ""

  for (var i = 0; i < data.length; i++) {

    category = data[i]
    
    var checkedBoxes = get_checked_boxes("checkbox_" + category.short);
    for (var j = 0; j < checkedBoxes.length; j++) {

      if (use_latex) {
        if (category.content[checkedBoxes[j].value].latex) {
          text = category.content[checkedBoxes[j].value].latex
        } else {
          text = category.content[checkedBoxes[j].value].text
        }
        if (category.content[checkedBoxes[j].value].bibtex) {
          bibtex_text += category.content[checkedBoxes[j].value].bibtex
        }
      } else {
        text = category.content[checkedBoxes[j].value].text
      }
      main_text += text + " ";
    }

  }

  document.getElementById("ack_main").innerHTML = main_text;

  if(use_latex) {
    document.getElementById("ack_bibtex").innerHTML = bibtex_text;
  } else {
    document.getElementById("ack_bibtex").innerHTML = "";
    
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
