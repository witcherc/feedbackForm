jQuery(function($) {
  var $fbEditor = $(document.getElementById('fb-editor')),
    $formContainer = $(document.getElementById('fb-rendered-form')),
    fbOptions = {
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

  $('.edit-form', $formContainer).click(function() {
    $fbEditor.toggle();
    $formContainer.toggle();
  });

  $('.preview-form', $formContainer).click(function() {
    var hWndPreviewWindow =
      window.open("", "Preview", "width=400,height=250,scrollbars=yes,resizable=yes, status=0");

//find Field Name
    var formDataNameIndex = formBuilder.formData.search("name");
    var nameEndIndex = formBuilder.formData.indexOf(",", formDataNameIndex);
    var nameValue = formBuilder.formData.substring(formDataNameIndex+7, nameEndIndex-1);

//use Field Name to return field value
    var fieldValue = formRender.formData;


    hWndPreviewWindow.document.open();
    hWndPreviewWindow.document.writeln('<HTML><HEAD><TITLE>Your Preview Window</TITLE></HEAD>');
    hWndPreviewWindow.document.writeln('<BODY>')
    hWndPreviewWindow.document.writeln('<B></B>');
    hWndPreviewWindow.document.writeln(testForm.element);
    hWndPreviewWindow.document.writeln('</BODY></HTML>');
  });
});
