jQuery(function($) {
  var fbEditor = document.getElementById('fb-editor');
  var formBuilder = $(fbEditor).formBuilder();
  $(fbTemplate).formBuilder();
});


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

          formData = event.target.result;
          formBuilder.actions.setData(formData);
        };

        reader.readAsText(file);

      } else {
        alert("Not an accepted file type. You must upload a .json file.");
      };

    });
  });
