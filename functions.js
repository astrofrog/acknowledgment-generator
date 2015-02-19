// I have not written Javascript before so any comments welcome :)

// Load JSON database of acknowledgments
$.getJSON("database.json", init);

// Initialize the main function with the data we've loaded
function init(data){
	var cite = new Citation(data);
}

// Main function to store the data so we don't have to keep requesting it
function Citation(data){
	this.data = data;
	this.show_checkboxes().show_acknowledgment();
	return this;
}

// Display the checkboxes for the provided JSON data
Citation.prototype.show_checkboxes = function(){

  // var checkedBoxes = get_checked_boxes("checkbox_options");

  content = ""

  for (var i = 0; i < this.data.length; i++) {

    category = this.data[i];

    content += '<h3 class="expandable"><img class="triangle" src="right.png">' + category.title + '</h3>\n';
    content += '<div class="options"><ul>';

    for (var short_name in category.content) {
      content += '<li><input type="checkbox" name="checkbox_' + category.short + '" value="' + short_name + '">'

      if(typeof(category.content[short_name].url) != 'undefined') {
        content += '<a href="' + category.content[short_name].url + '">'
                   + category.content[short_name].name + '\n'
                   + '</a>\n';
      } else {
        content += category.content[short_name].name + '\n';
      }
    }
    content += '</ul></div>';
    jQuery('#delim').on('change',function(){ box_checked(); });

  }

  // Add the HTML content to the page
  document.getElementById("main_check").innerHTML = content;

  // Add the change event to all the added checkboxes
  jQuery('#main_check li input[type=checkbox]').on('change',{citation:this},function(e){
  	e.data.citation.box_checked();
  });

  jQuery(document).ready(function(){
    $('.expandable').click(function() {
        $(this).next().toggle();  // add 'slow' to toggle() to animate
        title = $(this).html()
        if(title.indexOf("right") > -1) {
          $(this).html(title.replace("right", "down"));
        } else {
          $(this).html(title.replace("down", "right"));
        }
        return false;
    }).next().hide();
  });
  
  return this;
}


Citation.prototype.box_checked = function(){

  // // Resolve dependencies
  // var checkedBoxes = get_checked_boxes("checkbox_" + category.short);
  // for (var j = 0; j < checkedBoxes.length; j++) {
  //   resolve_dependents(checkedBoxes[i])
  // }
  //
  // When a box gets checked, update the acknowledgment
  this.show_acknowledgment();

}

Citation.prototype.show_acknowledgment = function() {
  // Display the acknowledgment corresponding to the checked boxes

  // Get this from latex checkbox
  var latex_checkbox = document.getElementById("option_latex");
  var facilities_checkbox = document.getElementById("option_facilities");
  
  var main_text = "<h2>Suggested acknowledgment</h2>";
  var bibtex_text = "<h2>BibTeX</h2>"

  var facilities = [];
  var textA = [];
  var textB = [];
  var madeuseof = "made use of";
  var delim = (jQuery('#delim').length == 1) ? jQuery('#delim').val() : ";";

  for (var i = 0; i < this.data.length; i++) {

    category = this.data[i];
    
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
      if (text.indexOf(madeuseof) > 0){
      	tmp = text.substr(text.indexOf(madeuseof)+madeuseof.length);
      	if(tmp[tmp.length-1]==".") tmp = tmp.substr(0,tmp.length-1)
      	textA.push(tmp);
      }else textB.push(text);

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
  // Build the first part of the acknowledgements which
  // concatenates the entries containing the phrase:
  // "made use of".
  if(textA.length > 0){
    main_text += "This research made use of";
    for(var i = 0; i < textA.length; i++){
      // If this is not the first item, add a delimiter
      if(i > 0) main_text += delim;
      // Add a space
      if(main_text[main_text.length-1] != " ") main_text += " ";
      // Add the shortened text
      main_text += textA[i];
    }
    main_text += ". "
  }
  if(textB.length > 0){
    for(var i = 0; i < textB.length; i++){
      // Add a space
      if(i > 0 && main_text[main_text.length-1] != " ") main_text += " ";
      main_text += textB[i];
    }
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

  // Add title text to any sections that need replacement
  jQuery('.replace').attr('title','This is a placeholder and should be replaced');

  return this;
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

