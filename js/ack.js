// var latex_checkbox = document.getElementById("option_latex");
// var facilities_checkbox = document.getElementById("option_facilities");
//
// var main_text = "<h2>Suggested acknowledgment</h2>";
// var bibtex_text = "<h2>BibTeX</h2>"
//
// var facilities = [];
// var textA = [];
// var textB = [];
// var madeuseof = "made use of";
// var delim = (jQuery('#delim').length == 1) ? jQuery('#delim').val() : ";";
//
// for (var i = 0; i < this.data.length; i++) {
//
//     category = this.data[i];
//
//     var checkedBoxes = get_checked_boxes("checkbox_" + category.short);
//     for (var j = 0; j < checkedBoxes.length; j++) {
//
//         if (latex_checkbox.checked) {
//             if (category.content[checkedBoxes[j].value].latex) {
//                 text = category.content[checkedBoxes[j].value].latex
//             } else {
//                 text = category.content[checkedBoxes[j].value].text
//             }
//             if (category.content[checkedBoxes[j].value].bibtex) {
//                 bibtex_text += category.content[checkedBoxes[j].value].bibtex + "<br><br>"
//             }
//         } else {
//             text = category.content[checkedBoxes[j].value].text
//         }
//         if (text.indexOf(madeuseof) > 0){
//             tmp = text.substr(text.indexOf(madeuseof)+madeuseof.length);
//             if(tmp[tmp.length-1]==".") tmp = tmp.substr(0,tmp.length-1)
//             textA.push(tmp);
//         }else textB.push(text);
//
//         if (facilities_checkbox.checked) {
//             if (category.content[checkedBoxes[j].value].facilities) {
//                 facilities.push(category.content[checkedBoxes[j].value].facilities);
//             }
//         }
//     }
// }
//
// facilities_text = "<h2>Facilities</h2>"
// if(facilities.length > 0) {
//     facilities_text += "\\textit{Facilities:}" + facilities.join(", ")
// }
// // Build the first part of the acknowledgements which
// // concatenates the entries containing the phrase:
// // "made use of".
// if(textA.length > 0){
//     main_text += "This research made use of";
//     for(var i = 0; i < textA.length; i++){
//         // If this is not the first item, add a delimiter
//         if(i > 0) main_text += delim;
//         // Add a space
//         if(main_text[main_text.length-1] != " ") main_text += " ";
//         // Add the shortened text
//         main_text += textA[i];
//     }
//     main_text += ". "
// }
// if(textB.length > 0){
//     for(var i = 0; i < textB.length; i++){
//         // Add a space
//         if(i > 0 && main_text[main_text.length-1] != " ") main_text += " ";
//         main_text += textB[i];
//     }
// }
// document.getElementById("ack_main").innerHTML = main_text;
//


$("#option_bibtex").click(function() {
    $("#bibtex-section").toggle();
});

$("#option_facilities").click(function() {
    $("#facilities-section").toggle();
});


