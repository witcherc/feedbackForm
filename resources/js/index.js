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
    fields = [{
      label: "Line Break",
      type: "text",
      icon: "<br>"
    }],

    formBuilder = $fbEditor.formBuilder(fbOptions);


  $('.edit-form', $formContainer).click(function() {
    document.getElementById("preview").innerHTML = "";
    $fbEditor.toggle();
    $formContainer.toggle();
  });
});


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
