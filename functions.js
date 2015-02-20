// I have not written Javascript before so any comments welcome :)

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
  this.checkboxes = [];

  for (var i = 0; i < this.data.length; i++) {

    category = this.data[i];

    content += '<h3 class="expandable"><img class="triangle" src="right.png">' + category.title + '</h3>\n';
    content += '<div class="options"><ul>';

    for (var short_name in category.content) {
      content += '<li><input type="checkbox" name="checkbox_' + category.short + '" id="' + category.short + '_' + short_name+ '" value="' + short_name + '">';
      // Keep a record of the checkboxes we are adding
      this.checkboxes.push({'id':category.short+'_'+short_name,'value':short_name,'name':category.content[short_name].name});

      if(typeof(category.content[short_name].url) != 'undefined') {
        content += '<a href="' + category.content[short_name].url + '">'
                   + category.content[short_name].name + '\n'
                   + '</a>\n';
      } else {
        content += category.content[short_name].name + '\n';
      }
    }
    content += '</ul></div>';
  }

  // Add the HTML content to the page
  document.getElementById("main_check").innerHTML = content;

  // Add the change event to all the checkboxes
  jQuery('#main_check li input[type=checkbox], #main_options li input[type=checkbox], #delim').on('change',{citation:this},function(e){
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
  
  $('#main_check').prepend('<h3><label for="filter">Search:</label> <input type="text" name="filter" id="filter" placeholder="Filter" /></h3>');

  this.typeahead('filter');

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

// Build a typeahead search field attached to the element with ID=id
Citation.prototype.typeahead = function(id){
  var t = 'typeahead';

  // Add the typeahead div and hide it
  $('body').append('<div id="'+t+'"></div>');
  $('#'+t).hide();

  // We want to remove the suggestion box if we lose focus on the 
  // input text field but not if the user is selecting from the list
  this.typeaheadactive = true;
  $('#'+t).on('mouseenter',{citation:this},function(e){
    e.data.citation.typeaheadactive = true;
  }).on('mouseleave',{citation:this},function(e){
    e.data.citation.typeaheadactive = false;
  });

  $('#'+id).on('blur',{citation:this},function(e){
    // Lose the suggestion box if we've lost focus
    if(!e.data.citation.typeaheadactive) $('#'+t).html('').hide();
  }).on('keyup',{citation:this},function(e){
    // Once a key has been typed in the search field we process it
    var s = $('#'+t+' a.selected');
    var list = $('#'+t+' a');
    if(e.keyCode==40 || e.keyCode==38){
      // Up or down cursor keys
      var i = 0;
      // If an item is selected we move to the next one
      if(s.length > 0){
      	s.removeClass('selected');
      	i = parseInt(s.attr('data'))+(e.keyCode==40 ? 1 : -1);
      	if(i >= list.length) i = 0;
      	if(i < 0) i = list.length-1;
	  }
	  // Select the new item
      $(list[i]).addClass('selected');
      // Update the search text
      $(this).val(e.data.citation.results[i].name)
    }else if(e.keyCode==13){
      // The user has pressed return
      if(s.length > 0) $(list[parseInt(s.attr('data'))]).trigger('click');
      else $(list[0]).trigger('click');
    }else{
      var html = e.data.citation.search($(this).val());
      $('#'+t).html(html).css({'position':'absolute','left':$(this).offset().left+'px','top':($(this).offset().top+$(this).outerHeight())+'px','width':$(this).outerWidth()+'px'}).show();
      $('#'+t+' a:first').addClass('selected');
      $('#'+t+' a').each(function(i){
        $(this).on('click',{citation:e.data.citation,s:s,t:t,id:id},function(e){
          e.preventDefault();
          // Trigger the click event for the item
          $('#'+e.data.citation.results[i].id).trigger('click');
          // Remove the suggestion list
          $('#'+e.data.t).html('').hide();
          // Clear the search field
          $('#'+e.data.id).val('');
        });
      
      });
    }
  });
}

// Get an HTML list of items which match str
Citation.prototype.search = function(str){
	var results = [];
	var html = "";
	if(str){
		for(var i = 0; i < this.checkboxes.length; i++){
			if(this.checkboxes[i].name.toLowerCase().indexOf(str.toLowerCase())>=0) results.push(this.checkboxes[i])
		}
		html = '<ul>';
		for(var i = 0; i < results.length; i++){
			html += '<li><a href="" data="'+i+'">'+results[i].name+'</a></li>'
		}
		html += "</ul>";
	}
	this.results = results;
	return html;
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

$(document).ready(function(){
	// Load JSON database of acknowledgments
	$.getJSON("database.json", init);
})

