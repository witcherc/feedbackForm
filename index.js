jQuery(function($) {
  var $fbEditor = $(document.getElementById("fb-editor")),
      $formContainer = $(document.getElementById("fb-rendered-form")),
      fbOptions = {
        onSave: function() {
          $fbEditor.toggle();
          $formContainer.toggle();
          $("form", $formContainer).formRender({
            formData: formBuilder.formData
          });
        }
      },
      formBuilder = $fbEditor.formBuilder(fbOptions);

  $(".edit-form", $formContainer).click(function() {
    $fbEditor.toggle();
    $formContainer.toggle();
  });
});
