jQuery(function($) {
  $fbEditor = $(document.getElementById('fb-editor')),
    $formContainer = $(document.getElementById('fb-rendered-form')),


    fbOptions = {

      disabledActionButtons: ['data'],

      controlOrder: [
        'paragraph',
        'text',
        'textarea',
        'radio',
        'checkbox-group'
      ],

      typeUserDisabledAttrs: {
        'checkbox-group': [
          'label',
        ],
        'radio-group': [
          'label',
        ],
        'textarea': [
          'label',
          'placeholder'
        ],
        'text': [
          'label',
          'placeholder'
        ],
      },

      typeHiddenAttrs: {
        'checkbox-group': [
          'name',
        ],
        'radio-group': [
          'name',
        ],
        'textarea': [
          'name',
        ],
        'text': [
          'name'
        ],
      },

      disabledAttrs: [
        'access',
        'className',
        'description',
        'inline',
        //'label',
        'max',
        'maxlength',
        'min',
        'multiple',
        'required',
        'rows',
        'step',
        'style',
        'subtype',
        'toggle',
        'value'
      ],

      disableFields: [
        'button',
        'file',
        'hidden',
        'header',
        'date',
        'number',
        'autocomplete',
        'select',
      ],

      editOnAdd: true,


      onSave: function() {
        $fbEditor.toggle();
        document.getElementById("classSetup").style.display = "none";
        document.getElementById("feedbackPreview").style.display = "";
        document.getElementById("download").style.display = "none";
        document.getElementById("uploadButton").style.display = "none ";
        document.getElementById("recommendedButton").style.display = "none ";
        document.getElementById("feedbackTemplateLabel").style.display = "";
        document.getElementById("templateBuilderLabel").style.display = "none";
        document.getElementById("copyButtonSet").style.display = "none";
        document.getElementById("rightPane").style.display = "";
        $formContainer.toggle();

        $('form', $formContainer).formRender({
          formData: formBuilder.formData
        });
        saveNames();
      }
    },

    formBuilder = $fbEditor.formBuilder(fbOptions);

//pause tutorial video and close modal
  document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('tutorialVideo').pause();
    document.getElementById('tutorialModal').style.display = 'none';
  });


  //add listener for download button and create function to download file
  document.getElementById('download').addEventListener('click',
    function(exportObj, exportName) {
      var exportObj = formBuilder.actions.getData('json');

      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));

      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", exportName + ".json");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });

  //function for edit form button: resets feedback preview and goes back to form editor
  $('.edit-form', $formContainer).click(function() {
    document.getElementById("preview").innerHTML = "";
    $fbEditor.toggle();
    $formContainer.toggle();
    document.getElementById("classSetup").style.display = "";
    document.getElementById("feedbackPreview").style.display = "none";
    document.getElementById("download").style.display = "";
    document.getElementById("uploadButton").style.display = "";
    document.getElementById("recommendedButton").style.display = "";
    document.getElementById("feedbackTemplateLabel").style.display = "none";
    document.getElementById("templateBuilderLabel").style.display = "";
    document.getElementById("students").value = "";
    document.getElementById("rightPane").style.display = "none";

    var oldStudent = document.getElementById("studentId").innerHTML;
    var activeRow = "row" + oldStudent;

    if (oldStudent) {
      document.getElementById(activeRow).style.border = null;
      document.getElementById("studentId").innerHTML = "";
    };


    var table = document.getElementById('feedbackTable');
    if (table.rows.length > 1) {
      document.getElementById('studentsLabel').innerHTML = "To add additional students, enter their names separated by commas."
    };
  });

  //uploading a Template
  document.getElementById('uploadButton').addEventListener('click',
    function() {

      if (window.File && window.FileReader && window.FileList && window.Blob) {

        document.getElementById('uploadForm').style.display = "";
        document.getElementById('submitFileButton').addEventListener('click', function uploadFiles() {

          var files = document.getElementById('uploadInput').files;

          if (files.length <= 0) {
            alert("No file was selected.");
            return;
          } else {

            var file = files[0];
            var reader = new FileReader();

            reader.onload = function(event) {
              var formData = event.target.result;
              var formattedData = JSON.parse(formData);
              console.log(formattedData);
              formBuilder.actions.setData(formattedData);
            };

            reader.readAsText(file);
            document.getElementById('uploadForm').style.display = "none";
            return;
          };
        });

        document.getElementById('cancelFileButton').addEventListener('click', function cancelFileUpload() {
          document.getElementById('uploadForm').style.display = "none";
          return;
        });

      } else {
        alert('File uploading is not fully supported in this browser. Please try another browser (like Chrome).');
      };
    });

  //function to set recommended template as form dataStr
  document.getElementById('recommendedButton').addEventListener('click', function() {

    var data = '[{"type":"paragraph","label":"This assignment asked you to"},{"type":"text","name":"text-1513547880266"},{"type":"paragraph","label":"Your work:"},{"type":"checkbox-group","name":"checkbox-group-1513547900673","values":[{"label":"thing one","value":"has this great thing"},{"label":"thing two","value":"has this other great thing"}]},{"type":"paragraph","label":"When revising your work, make sure that it"},{"type":"checkbox-group","name":"checkbox-group-1513547961507","values":[{"label":"thing one","value":"has this great thing"},{"label":"thing two","value":"has this other great thing"}]},{"type":"paragraph","label":"You are currently at a level"},{"type":"text","name":"text-1513548031407"},{"type":"radio-group","name":"radio-group-1513548141369","values":[{"label":"4","value":"(mastery)."},{"label":"3","value":"(proficiency)."},{"label":"2","value":"(developing proficiency)."}]},{"type":"paragraph","label":"To work towards mastery, you should"},{"type":"textarea","name":"textarea-1513548001796"}]';

    formBuilder.actions.setData(data);
    return;
  });

  document.getElementById('downloadTable').addEventListener('click', function() {
    var doc = new jsPDF('p', 'pt', 'letter');
    var res = doc.autoTableHtmlToJson(document.getElementById("feedbackTable"));
    var date = new Date();
    var m = date.getMonth() + 1;
    var d = date.getDate();



    doc.autoTable(res.columns, res.data, {
      startY: 60,
      theme: 'striped',
      headerStyles: {
        fillColor: [50, 140, 193]
      },
      addPageContent: function(data) {
        doc.text("created with Flexible Feedback (flexfeedback.com)", 20, 30);
      }
    });
    doc.save('flexible_feedback_' + m + "_" + d);
  });
});

//function to clear the form
function clearForm() {
  document.getElementById("testForm").reset();
  document.getElementById("preview").innerHTML = "";
  document.getElementById("copyButtonSet").style.display = "none";
  return;
};

//function to copy the preview feedback to clipboard
function copyText() {
  function selectElementText(el) {
    var range = document.createRange() // create new range object
    range.selectNodeContents(el) // set range to encompass desired element text
    var selection = window.getSelection() // get Selection object from currently user selected text
    selection.removeAllRanges() // unselect any user selected text (if any)
    selection.addRange(range) // add range to Selection object to select it
    return;
  };

  var para = document.getElementById('preview');
  selectElementText(para); // select the element's text we wish to read

  function copySelectionText() {
    var copysuccess // var to check whether execCommand successfully executed
    try {
      copysuccess = document.execCommand("copy") // run command to copy selected text to clipboard
    } catch (e) {
      copysuccess = false
    }
    return copysuccess;
  };

  copySelectionText(para);
};

// When the user clicks on the save snippet button, open the popup
function copyTooltipFunction() {
  var popup = document.getElementById("copyTooltip");
  popup.classList.toggle("show");
  setTimeout(function() {
    popup.classList.toggle("hide")
  }, 1000);
  return;
};

//function to save selected text to the bank
function dndSave() {
  function getSelectionText() {
    var selectedText = "";
    if (window.getSelection) { // all modern browsers and IE9+
      selectedText = window.getSelection().toString();
    }
    return selectedText;
  }

  function saveToBank() {
    var div = document.createElement("DIV");
    var t = getSelectionText();
    if (t != "") {
      div.setAttribute("id", Date.now());
      div.setAttribute("draggable", "true");
      div.setAttribute("class", "bank");
      div.innerHTML = t;
      document.getElementById('snippetInstructions').style.display = "";
      document.getElementById('bankInstructions').style.display = "none";
      document.getElementById("previewContainer").appendChild(div);
    };
  }
  saveToBank();
}

//listener to allow drag-and-drop of banked text
document.addEventListener('dragstart', function(event) {
  event.dataTransfer.setData('Text', event.target.innerHTML);
});

//populating the preview container with feedback
function previewForm() {
  var x = document.getElementsByClassName("rendered-form");
  var feedback = "";
  var i;
  var tag;

  for (i = 0; i < x[0].childNodes.length; i++) {

    var tag = x[0].childNodes[i].childNodes[0].tagName;

    switch (tag) {

      //manage paragraph text
      case 'P':
        feedback += x[0].childNodes[i].childNodes[0].innerHTML + " ";
        break;

        //manage form inputs
      case 'LABEL':

        //radio groups
        if (x[0].childNodes[i].childNodes[0].className === "fb-radio-group-label") {

          var optionsList = x[0].childNodes[i].childNodes[1].children;
          var listLength = optionsList.length;
          var j;

          for (j = 0; j < listLength; j++) {
            if (optionsList[j].childNodes[0].checked) {
              feedback += " " + optionsList[j].childNodes[0].value + " ";
            };
          };
          break;
        };

        //checkbox groups
        if (x[0].childNodes[i].childNodes[0].className === "fb-checkbox-group-label") {

          var optionsList = x[0].childNodes[i].childNodes[1].children;
          var checkedList = "";
          var listLength = optionsList.length;
          var j;

          for (j = 0; j < listLength; j++) { //for each item in the list, if it's checked --> add to checkedList with a bullet and break

            if (optionsList[j].childNodes[0].checked) {
              checkedList += "&#8226" + " " + optionsList[j].childNodes[0].value + "<br>";
            };
          };
          feedback += "<br>" + checkedList;
        };

        //text fields and text areas
        var type = x[0].childNodes[i].childNodes[1].type;
        switch (type) {

          case 'text':
            feedback += x[0].childNodes[i].childNodes[1].value + " ";
            break;

          case 'textarea':
            feedback += x[0].childNodes[i].childNodes[1].value + " ";
            break;

          default:
            feedback += "";
        };

      default:
        feedback += "";
    };
  };

  document.getElementById("copyButtonSet").style.display = "";
  document.getElementById("preview").innerHTML = feedback;

};

function saveNames() {

  var namesList = document.getElementById('students').value;
  var table = document.getElementById('feedbackTable');


  //if the names list has some names in it
  if (namesList != "") {

    document.getElementById('tableInstructions').style.display = "none";
    document.getElementById('listButtonSet').style.display = "";

    var namesArray = namesList.split(",");
    var length = namesArray.length;
    var i;

    for (i = 0; i < length; i++) {

      var student = namesArray[i];
      var id = namesArray[i].replace(/\s+/g, '');
      var row = table.insertRow(i + 1);
      //var cell1 = row.insertCell(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cellLabel = i;

      var p = document.createTextNode("");


      row.setAttribute("onclick", "setActive(this)");
      row.setAttribute("id", "row" + i);
      row.setAttribute("contentEditable", true);

      cell1.innerHTML = namesArray[i];

      cell2.appendChild(p);
      cell2.setAttribute("id", cellLabel);

    };

    return namesArray;
  } else {
    console.log('list is empty');
  };
};


function setActive(elem) {
  var x = elem.rowIndex - 1;
  var y = document.getElementById("feedbackTable").rows[x + 1].cells;
  var name = y[0].innerHTML;
  var rowId = "row" + x;
  var oldStudent = document.getElementById("studentId").innerHTML;
  var activeRow = "row" + oldStudent;

  if (oldStudent) {
    document.getElementById(activeRow).style.border = null;
  };

  document.getElementById(rowId).style.border = "2px solid var(--attention-color, yellow)";

  document.getElementById('activeStudentDisplay').innerHTML = "to " + name + ":";

  document.getElementById('studentId').innerHTML = x;
};

function saveToTable() {
  var feedbackText = document.getElementById('preview').innerHTML;
  var x = document.getElementById('studentId').innerHTML;
  var child = document.getElementById(x);

  if (x == "") {
    alert("Please choose a student from the list, then click save.")

  } else {
    if (child.innerHTML !== "") {
      var sure = confirm("This student already has feedback. Do you want to replace it?");
      if (sure) {
        child.innerHTML = feedbackText;
      };

    } else {
      child.innerHTML = feedbackText;
    };
  };
};
