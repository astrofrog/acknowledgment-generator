// I have not written Javascript before so any comments welcome :)

// Load JSON database of acknowledgments
$.getJSON("database.json", show_checkboxes);

function show_checkboxes(data) {
  // Display the checkboxes for the provided JSON data
  checkboxes = ""
  for (var short_name in data.codes) {
    checkboxes += '<input type="checkbox" name="checkbox" value="'
                  + short_name
                  + '" onchange="box_checked()">'
                  + data.codes[short_name].name + '\n'
  }
  document.getElementById("checkboxes").innerHTML = checkboxes;
}

function box_checked() {
  // When a box gets checked, update the acknowledgment
  $.getJSON("database.json", show_acknowledgment);
}

function show_acknowledgment(data) {
  // Display the acknowledgment corresponding to the checked boxes
  var checkedBoxes = get_checked_boxes("checkbox");
  main_text = "";
  for (var i = 0; i < checkedBoxes.length; i++) {
    main_text = main_text + data.codes[checkedBoxes[i].value].acknowledgment;
  }
  document.getElementById("main_ack").innerHTML = main_text;
}


function get_checked_boxes(checkbox_name) {
  // Find all checked checkboxes

  var checkboxes = document.getElementsByName(checkbox_name);
  var checkboxes_checked = [];

  // loop over them all
  for (var i = 0; i < checkboxes.length; i++) {
    // And stick the checked ones onto an array...
    if (checkboxes[i].checked) {
      checkboxes_checked.push(checkboxes[i]);
    }
  }
  // Return the array if it is non-empty, or null
  return checkboxes_checked;
}
