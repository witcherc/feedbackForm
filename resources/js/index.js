jQuery(function($) {
  var $fbEditor = $(document.getElementById('fb-editor')),
    $formContainer = $(document.getElementById('fb-rendered-form')),
    fbOptions = {
      disabledActionButtons: ['data'],

      hiddenAttrs: ['name'],

      disabledAttrs: [
        'access',
        'className',
        'description',
        'inline',
        'label',
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
        'paragraph'
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

  //function for edit form button: resets feedback preview and goes back to form editor
  $('.edit-form', $formContainer).click(function() {
    document.getElementById("preview").innerHTML = "";
    $fbEditor.toggle();
    $formContainer.toggle();
    document.getElementById("copyText").style.display = "none";
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
