// I have not written Javascript before so any comments welcome :)

// Load JSON database of acknowledgments
$.getJSON("database.json", show_checkboxes);

function show_checkboxes(data) {
  // Display the checkboxes for the provided JSON data

  content = ""

  for (var i = 0; i < data.length; i++) {

    category = data[i]

    content += '<h3>' + category.title + '</h3>\n<div><ul>'

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
    $('h3').click(function() {
        $(this).next().toggle();  // add 'slow' to toggle() to animate
        return false;
    }).next().hide();
  });

  // $( "#main_check" ).accordion();

}

function box_checked() {
  // When a box gets checked, update the acknowledgment
  $.getJSON("database.json", show_acknowledgment);
}

function show_acknowledgment(data) {
  // Display the acknowledgment corresponding to the checked boxes

  main_text = "";

  for (var i = 0; i < data.length; i++) {

    category = data[i]

    var checkedBoxes = get_checked_boxes("checkbox_" + category.short);
    for (var j = 0; j < checkedBoxes.length; j++) {
      main_text += category.content[checkedBoxes[j].value].text + " ";
      // main_text += checkedBoxes[j].value;
    }

  }

  document.getElementById("ack_main").innerHTML = main_text;

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
