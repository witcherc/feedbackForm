jQuery(function($) {
  var formData;
  var $fbEditor = $(document.getElementById('fb-editor')),

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

      hiddenAttrs: {
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
        $formContainer.toggle();
        $('form', $formContainer).formRender({
          formData: formBuilder.formData
        });
      }
    },

    formBuilder = $fbEditor.formBuilder(fbOptions);

  //add listener for download button and create function to download file
  document.getElementById('download').addEventListener('click',
    function downloadObjectAsJson(exportObj, exportName) {
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
    document.getElementById("copyText").style.display = "none";
  });

  //uploading a Template
  document.getElementById('uploadButton').addEventListener('click',
    function() {
      //get the button to go away
      document.getElementById('uploadButton').style.display = "none";

      //get a text area to show up
      document.getElementById('uploadInput').style.display = "";
      document.getElementById('submitFileButton').style.display = "";

      //when submitFileButton is clicked, read JSON file, if valid: use, update tempalte, and reset hide/show elements

      document.getElementById('submitFileButton').addEventListener('click', function() {

        var files = document.getElementById('uploadInput').files;

        if (files.length <= 0) {
          alert("No file was selected.");
          return false;
        };

        if (files[0].type === 'application/json') {

          var file = files[0];
          var reader = new FileReader();

          reader.onload = function(event) {
            var formData = event.target.result;
            var formattedData = JSON.parse(formData);
            console.log(formattedData);
            formBuilder.actions.setData(formattedData);
          };

          reader.readAsText(file);

        } else {
          alert("Not an accepted file type. You must upload a .json file.");
        };

        document.getElementById('uploadInput').style.display = "none";
        document.getElementById('submitFileButton').style.display = "none";
        document.getElementById('uploadButton').style.display = "";
      });
    });
});

//function to clear the form
function clearForm() {
  document.getElementById("testForm").reset();
  document.getElementById("preview").innerHTML = "";
  document.getElementById("copyText").style.display = "none";
};

//function to copy the preview feedback to clipboard
function copyText() {
  function selectElementText(el) {
    var range = document.createRange() // create new range object
    range.selectNodeContents(el) // set range to encompass desired element text
    var selection = window.getSelection() // get Selection object from currently user selected text
    selection.removeAllRanges() // unselect any user selected text (if any)
    selection.addRange(range) // add range to Selection object to select it
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

// When the user clicks on the button, open the popup
function copyTooltipFunction() {
  var popup = document.getElementById("copyTooltip");
  popup.classList.toggle("show");
  setTimeout(function() {
    popup.classList.toggle("hide")
  }, 1000);
};

//function to save selected text to the bank
function dndSave() {
  function getSelectionText() {
    var selectedText = "";
    if (window.getSelection) { // all modern browsers and IE9+
      selectedText = window.getSelection().toString();
    }
    return selectedText;
  };

  function saveToBank() {
    var div = document.createElement("DIV");
    var t = getSelectionText();
    div.setAttribute("id", Date.now());
    div.setAttribute("draggable", "true");
    div.setAttribute("class", "bank");
    div.innerHTML = t;
    document.getElementById("previewContainer").appendChild(div);
  };

  saveToBank();
};

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
          var listLength = optionsList.length;
          var j;

          for (j = 0; j < listLength; j++) {
            if (j > 0) {
              if (optionsList[j - 1].childNodes[0].checked) {
                if (optionsList[j].childNodes[0].checked) {
                  feedback += "&#8226" + " " + optionsList[j].childNodes[0].value + "<br>";
                };
              };
            } else if (optionsList[j].childNodes[0].checked) {
              feedback += "<br>" + "&#8226" + " " + optionsList[j].childNodes[0].value + "<br>";
            };
          };
          break;
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

  document.getElementById("copyText").style.display = "";
  document.getElementById("preview").innerHTML = feedback;

};
