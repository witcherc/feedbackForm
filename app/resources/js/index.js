jQuery(function($) {
  $fbEditor = $(document.getElementById('fb-editor')),
  $formContainer = $(document.getElementById('fb-rendered-form')),

  fbOptions = {

    disabledActionButtons: ['data'],

    controlOrder: [
      'paragraph', 'text', 'textarea', 'radio', 'checkbox-group'
    ],

    typeUserDisabledAttrs: {
      'checkbox-group': [
        'label', 'name'
      ],
      'radio-group': ['label'],
      'textarea': [
        'label', 'placeholder', 'name'
      ],
      'text': ['label', 'placeholder', 'name']
    },

    disabledAttrs: [
      'access', 'className', 'description', 'inline',
      //'label',
      'max',
      'maxlength',
      'min',
      'multiple',
      //'name',
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
      'select'
    ],

    editOnAdd: true,

    onSave: function() {
      $fbEditor.toggle();
      $("#classSetup").hide();
      $('#previewContainer').removeClass('four');
      $('#previewContainer').addClass('five');
      $("#feedbackPreview").show();
      $("#download").hide();
      $("#uploadButton").hide();
      $("#recommendedButton").hide();
      $("#feedbackTemplateLabel").show();
      $("#templateBuilderLabel").hide();
      $("#key").hide();
      $("#copyButtonSet").hide();
      $("#rightPane").show();
      $('#editBtn').show();
      $('#resetBtn').show();
      $('#feedbackTable').attr('contenteditable', false);
      $('.delete-button-cell').hide();
      $('#first-page-tutorial').hide();
      $('#second-page-tutorial').show();
      $formContainer.toggle();

      $('form', $formContainer).formRender({formData: formBuilder.formData});
      saveNames();
    }

  },

  formBuilder = $fbEditor.formBuilder(fbOptions);

  //add listener for tmplate download button and create function to download file
  $('#download').on('click', function(exportObj, exportName) {
    var exportObj = formBuilder.actions.getData('json');
    var exportName = "feedback_template";
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));

    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });

  //function for edit form button: resets feedback preview and goes back to form editor
  $('#editBtn').click(function() {
    $("#preview").innerHTML = "";
    $fbEditor.toggle();
    $formContainer.toggle();
    $('#previewContainer').addClass('four');
    $('#previewContainer').removeClass('five');
    $('#editBtn').hide();
    $('#resetBtn').hide();
    $('#classSetup').show();
    $("#feedbackPreview").hide();
    $("#download").show();
    $("#uploadButton").show();
    $("#recommendedButton").show();
    $("#feedbackTemplateLabel").hide();
    $("#templateBuilderLabel").show();
    $("#students").val("");
    $("#rightPane").hide();
    $('#feedbackTable').attr('contenteditable', true);
    $('.delete-button-cell').attr('contenteditable', false);
    $('.delete-button-cell').show();

    if ($('#opened-tutorial').is(':visible')) {
      $('#key').show();
    }

  });

  //uploading a Template
  $('#uploadButton').on('click', function() {

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
            try {
              formBuilder.actions.setData(formattedData)
            } catch (error) {
              alert("Oh no! There is something wrong with this file. Try a different file. (" + error + ")");
            };
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
  $('#recommendedButton').on('click', function() {

    var data = '[{\"type\":\"paragraph\",\"label\":\"This assignment asked you to (edit me).\"},{\"type\":\"paragraph\",\"label\":\"Your work\"},{\"type\":\"textarea\"},{\"type\":\"paragraph\",\"label\":\"When revising your work&nbsp;\"},{\"type\":\"checkbox-group\",\"values\":[{\"label\":\"criteria 1\",\"value\":\"edit this first criteria description\"},{\"label\":\"criteria 2\",\"value\":\"edit this second criteria description\"}]},{\"type\":\"paragraph\",\"label\":\"Your grade for this assignment is\"},{\"type\":\"text\"},{\"type\":\"paragraph\",\"label\":\"This means that\"},{\"type\":\"text\"}]';

    formBuilder.actions.setData(data);
    return;
  });

  $('#downloadTable').on('click', function() {
    var doc = new jsPDF('p', 'pt', 'letter');
    var res = doc.autoTableHtmlToJson(document.getElementById("feedbackTable"));
    var date = new Date();
    var m = date.getMonth() + 1;
    var d = date.getDate();

    doc.autoTable(res.columns, res.data, {
      tableWidth: 'auto',
      bodyStyles: {
        valign: 'top'
      },
      styles: {
        overflow: 'linebreak'
      },
      columnStyles: {
        text: {
          columnWidth: 'auto'
        }
      },
      theme: 'grid',
      headerStyles: {
        fillColor: [37, 116, 142]
      },
      addPageContent: function(data) {
        doc.text("created with Flexible Feedback (flexfeedback.com)", 20, 30);
      }
    });
    doc.save('flexible_feedback_' + m + "_" + d);
  });

  //Excel EXPORT
  $('#downloadTableExcel').on('click', async function() {
    var date = new Date();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var filename = "Feedback_Table_" + m + "_" + d;

    await TableExport($('#feedbackTable'), {
      formats: ['xlsx'],
      filename: filename,
      ignoreCols: 0,
      trimWhitespace: false
    });

    $('.xlsx').trigger('click');

  });

  //Word EXPORT
  $('#downloadTableText').on('click', function() {
    var date = new Date();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var filename = "Feedback_Table_" + m + "_" + d;

    if (!window.Blob) {
      alert('Your legacy browser does not support this action.');
      return;
    }

    var html,
      link,
      blob,
      url,
      css;

    // EU A4 use: size: 841.95pt 595.35pt;
    // US Letter use: size:11.0in 8.5in;

    css = ('<style>' + '@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' + 'div.WordSection1 {page: WordSection1;}' + 'table{border-collapse:collapse;}td{border:1px gray solid;width:5em;padding:2px;}' + '</style>');

    var $clonedHtml = $('#feedbackTableDiv').clone();
    $clonedHtml.find('[class*="delete-button-cell"]').remove();
    html = $clonedHtml.html();
    blob = new Blob([
      '\ufeff', css + html
    ], {type: 'application/msword'});
    url = URL.createObjectURL(blob);
    link = document.createElement('A');
    link.href = url;
    // Word will append file extension - do not add an extension here.
    link.download = filename;
    document.body.appendChild(link);
    if (navigator.msSaveOrOpenBlob)
      navigator.msSaveOrOpenBlob(blob, filename + '.doc'); // IE10-11
    else
      link.click(); // other browsers
    document.body.removeChild(link);
  });

});
//function to clear the form
function clearForm() {
  $("#testForm").trigger('reset');
  document.getElementById("preview").innerHTML = "";
  $("#copyButtonSet").hide();
  enableForm();
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
  successFlash($('#copyTextBtn'));
  enableForm();
  $('#preview').attr('contenteditable', false);
};

//function to copy the preview feedback to clipboard
function editText() {

  var value = $('#preview').attr('contenteditable');

  if (!value || value === 'false') {
    disableForm();
  } else {
    enableForm();
  }

  successFlash($('#editTextBtn'));
};

function enableForm() {
  $('#preview').attr('contenteditable', false);
  $("#testForm :input").attr('disabled', false);
  $('#testForm').css('color', 'black');
  $('#preview').removeClass('editable');
}

function disableForm() {
  $("#testForm :input").attr('disabled', true);
  $("#testForm").trigger('reset');
  $('#testForm').css('color', 'gray');
  $('#preview').addClass('editable');
  $('#preview').attr('contenteditable', true);
}

//function to save selected text to the bank
function dndSave() {
  function getSelectionText() {
    var selectedText;

    if (window.getSelection) { // all browsers, except IE before version 9
      if (document.activeElement && (document.activeElement.tagName.toLowerCase() == "textarea" || document.activeElement.tagName.toLowerCase() == "input")) {
        var text = document.activeElement.value;
        selectedText = text.substring(document.activeElement.selectionStart, document.activeElement.selectionEnd);
      } else {
        var selectedRange = window.getSelection();
        selectedText = selectedRange.toString();
      }
    }
    return selectedText;
  }

  function saveToBank() {
    var div = document.createElement("DIV");
    var t = getSelectionText();
    if (t !== "") {
      div.setAttribute("id", Date.now());
      div.setAttribute("draggable", "true");
      div.setAttribute("class", "bank");
      div.setAttribute("ondblclick", "this.contentEditable=true");
      div.setAttribute("onblur", "this.contentEditable=false");
      div.setAttribute('ondragover', "allowDrop(event)");
      div.setAttribute('ondragleave', "cancelDrop(event)");
      div.setAttribute('ondrop', "drop(event)");
      div.innerHTML = t;
      document.getElementById("bank-container").appendChild(div);
    };
  }
  saveToBank();
}

function backUpBank() {
  var pom = document.createElement('a');
  var bankList = document.getElementsByClassName('bank');
  var bankArray = [];
  for (i = 0; i < bankList.length; i++) {
    var newRow = '"' + bankList[i].innerText + '"';
    bankArray.push(newRow);
  }
  var blob = new Blob([bankArray], {type: 'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  pom.href = url;
  pom.setAttribute('download', 'comment_bank.csv');
  pom.click();
  return;
};

function restoreBank() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    $('#bankUploadForm').show();

  } else {

    alert('File uploading is not fully supported in this browser. Please try another browser (like Chrome).');
    return;
  };
}

function bankCancelFileUpload() {
  document.getElementById('bankUploadForm').style.display = "none";
  document.getElementById('bankUploadForm').reset();
  return;
}

function bankUploadFile() {
  var files = document.getElementById('bankUploadInput').files;

  if (files.length <= 0) {
    alert("No file was selected.");
    return;

  } else {

    var bankReader = new FileReader();

    bankReader.readAsText(files[0]);

    bankReader.onload = async function(event) {
      await clearOld();
      await populateNew(bankReader);
      await document.getElementById('bankUploadForm').reset();
      document.getElementById('bankUploadForm').style.display = "none";
      return;
    };
  };
};

function clearOld() {
  $('.bank').remove();;
  return;
};

function populateNew(reader) {
  var newBankString = "[" + reader.result + "]";

  try {
    var newBankList = JSON.parse(newBankString);
  } catch (error) {
    alert("Oh no! There is something wrong with this file. Try a different file. (" + error + ")");
  }

  for (i = 0; i < newBankList.length; i++) {
    var t = newBankList[i];

    if (t !== "") {
      var div = document.createElement("DIV");
      div.setAttribute("id", Date.now() + i);
      div.setAttribute("draggable", "true");
      div.setAttribute("class", "bank");
      div.setAttribute("ondblclick", "this.contentEditable=true");
      div.setAttribute("onblur", "this.contentEditable=false");
      div.setAttribute('ondragover', "allowDrop(event)");
      div.setAttribute('ondragleave', "cancelDrop(event)");
      div.setAttribute('ondrop', "drop(event)");
      div.innerHTML = t;
      document.getElementById("bank-container").appendChild(div);
    };

  }
  return;
};

//listener to allow drag-and-drop of banked text
document.addEventListener('dragstart', function(event) {
  if (event.target.id != "trash") {
    event.dataTransfer.setData('Text', event.target.textContent);
  } else {
    event.dataTransfer.setData('Text', 'trash-a-roo');
  }
});

function allowDrop(allowdropevent) {
  allowdropevent.target.style.color = 'red';
  allowdropevent.preventDefault();
}

function cancelDrop(canceldropevent) {
  canceldropevent.target.style.color = 'black';
}

function drop(dropevent) {
  dropevent.target.style.color = 'black';
  if (dropevent.dataTransfer.getData('Text') == 'trash-a-roo') {
    dropevent.preventDefault();
    dropevent.target.remove();
  }
}

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

  $("#copyButtonSet").show();
  document.getElementById("preview").innerHTML = feedback;
};

function animateHover() {
  var position = $('#hover-1').position();
  var left = position.left + 25;
  var top = position.top + 15;
  $('#mouse-pointer').animate({
    top: top,
    left: left
  }, 2000, function() {

    if ($('#opened-tutorial').is(':visible')) {

      successFlash($('#uploadButton'));
      $('#mouse-pointer').delay(3000).hide(400);
    }
  });
}

function showDownloadButtons() {
  $('#save-table-button').hide();
  $('#download-options').animate({
    width: 'toggle'
  }, 350);
}

$(document).ready(function() {
  $('#opened-tutorial').slideDown(1000, function() {
    animateHover();
  });

  $('#download-options').hide();

  $('#save-table-button').on('click', function() {
    $(this).hide();
    $('#download-options').show(300);
  })

  $('#download-options').on('click', function() {
    $(this).hide();
    $('#save-table-button').show();
  })

  $('#close-tutorial-button').on('click', function() {
    $('#close-tutorial-button').toggleClass('down');

    if ($('#opened-tutorial').is(":visible")) {
      $('#opened-tutorial').slideUp();
      $('.tutorial-numbers').hide();
      $('#key').hide();
    } else {
      $('#opened-tutorial').slideDown();
      $('.tutorial-numbers').show();
      if ($('#first-page-tutorial').is(':visible')) {
        $('#key').show();
      }
    }

  });

  $('#editBtn').on('click', function() {
    $('#second-page-tutorial').hide();
    $('#first-page-tutorial').show();
  });

  $('#hover-1').on('mouseenter', function() {
    $('#uploadButton').addClass('pulse');
  })

  $('#hover-1').on('mouseleave', function() {
    $('#uploadButton').removeClass('pulse');
  })

  $('#hover-2').on('mouseenter', function() {
    $('#recommendedButton').addClass('pulse');
  })

  $('#hover-2').on('mouseleave', function() {
    $('#recommendedButton').removeClass('pulse');
  })

  $('#hover-3').on('mouseenter', function() {
    $('#students').addClass('pulse');
  })

  $('#hover-3').on('mouseleave', function() {
    $('#students').removeClass('pulse');
  })

  $('#hover-4').on('mouseenter', function() {
    $('.save-template').addClass('pulse');
  })

  $('#hover-4').on('mouseleave', function() {
    $('.save-template').removeClass('pulse');
  })

  $('#hover-5').on('mouseenter', function() {
    $('#saveFeedbackToList').addClass('pulse');
  })

  $('#hover-5').on('mouseleave', function() {
    $('#saveFeedbackToList').removeClass('pulse');
  })

  $('#hover-6').on('mouseenter', function() {
    $('#copyTextBtn').addClass('pulse');
  })

  $('#hover-6').on('mouseleave', function() {
    $('#copyTextBtn').removeClass('pulse');
  })

  $('#hover-7').on('mouseenter', function() {
    $('#editBtn').addClass('pulse');
  })

  $('#hover-7').on('mouseleave', function() {
    $('#editBtn').removeClass('pulse');
  })

  $('#hover-8').on('mouseenter', function() {
    $('#saveSelectedText').addClass('pulse');
  })

  $('#hover-8').on('mouseleave', function() {
    $('#saveSelectedText').removeClass('pulse');
  })

  $('#hover-9').on('mouseenter', function() {
    $('#backUpBank').addClass('pulse');
  })

  $('#hover-9').on('mouseleave', function() {
    $('#backUpBank').removeClass('pulse');
  })

  $('#hover-10').on('mouseenter', function() {
    $('#restoreBank').addClass('pulse');
  })

  $('#hover-10').on('mouseleave', function() {
    $('#restoreBank').removeClass('pulse');
  })

  $('#hover-11').on('mouseenter', function() {
    $('#trash').addClass('pulse');
  })

  $('#hover-11').on('mouseleave', function() {
    $('#trash').removeClass('pulse');
  })

});

async function saveNames() {
  await populateTable();
  await setIds();
  makeDropdown();
  return;
};

function populateTable() {
  //if the names list has some names in it
  var namesList = $('#students').val();
  var table = document.getElementById('tbody');
  var namesArray;
  if (namesList != "") {
    $('#feedbackTableDiv').show();
    $('#active-student-dropdown').show();
    $('#saveFeedbackToList').show();
    $('#tableInstructions').hide();
    $('#downloadTableSet').show();
    $('#listButtonSet').show();

    namesArray = namesList.split(",");
    var length = namesArray.length;
    var i;

    for (i = 0; i < length; i++) {

      var student = namesArray[i];
      var row = document.createElement("tr");
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cellLabel = i;
      var deleteBtn = document.createElement("BUTTON");
      var p = document.createTextNode("");

      table.appendChild(row);
      cell2.innerHTML = namesArray[i];
      deleteBtn.setAttribute('class', "delete-button");
      cell3.appendChild(p);
      cell1.appendChild(deleteBtn);
      cell1.setAttribute('class', 'delete-button-cell');
      deleteBtn.setAttribute("onclick", 'deleteStudent(this);');
      deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
      cell3.setAttribute("id", cellLabel);
      cell2.setAttribute("class", 'student-name');
    };
  };
};

function deleteStudent(elem) {
  var sure = confirm('Delete this student?');
  if (sure) {
    $(elem).parent().parent().remove();
  } else {
    return;
  }
};

function setIds() {
  $('#tbody tr').attr('id', function(index) {
    return 'row' + (
    index);
  });
};

function makeDropdown() {
  var data = {};
  $selectionDropdown = $('#active-student-dropdown');

  $('#tbody .student-name').each(function(i, item) {
    var name = $(item).html();
    data[i] = name;
  })
  var s = $('<select class="select-student" />');
  for (var val in data) {
    $('<option />', {
      value: val,
      text: data[val]
    }).appendTo(s);
  }
  $selectionDropdown.html(s);
};

function successFlash(elem) {
  $(elem).addClass('success-flash');
  setTimeout(function() {
    $(elem).removeClass('success-flash');
  }, 2000);
}

function saveToTable() {
  var feedbackText = $('#preview').html();
  var activeStudent = $('#active-student-dropdown').find(':selected').val();
  var $activeStudentFeedback = $('#tbody')[0].children[activeStudent].children[2];
  if ($activeStudentFeedback.innerHTML !== "") {
    var sure = confirm("This student already has feedback. Do you want to replace it?");
    if (sure) {
      $activeStudentFeedback.innerHTML = feedbackText;
      successFlash($('#saveFeedbackToList'));
      $('#preview').attr('contenteditable', false);
      enableForm();
    };
  } else {
    $activeStudentFeedback.innerHTML = feedbackText;
    successFlash($('#saveFeedbackToList'));
    $('#preview').attr('contenteditable', false);
    enableForm();
  };

};

window.onbeforeunload = function() {
  return "Data will be lost if you leave the page, are you sure?";
};
