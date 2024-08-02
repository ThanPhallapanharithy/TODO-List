$(document).ready(function () {
  $("#save").hide();
  var count = 1;
  $("#add").click(function () {
    var todo = $("#task").val();
    var time = $("#time").val();
    if (!todo) {
      $("#task").addClass("is-invalid");
      $("#task").focus();
      return;
    }
    $("#task").removeClass("is-invalid");

    if (!time) {
      $("#time").addClass("is-invalid");
      $("#time").focus();
      return;
    }

    if (!formatTime(time)) {
      $("#time").addClass("is-invalid");
      $(".time-feedback").html("Time is not a valid format");
      return;
    }

    appendTask(todo, time);

    $("#task").val("");
    $("#time").val("");
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your task has been saved",
      showConfirmButton: false,
      timer: 1500,
    });
  });
  $("#task").on("input", function () {
    $("#task").removeClass("is-invalid");
    $("#task").addClass("is-valid");
  });
  $("#time").on("input", function () {
    $("#time").removeClass("is-invalid");
    $("#time").addClass("is-valid");
  });
  function appendTask(todo, time) {
    var newTask =
      `
      <div class="my-3 px-5 task-data">
        <div class="container-task my-3">
        <input type="hidden" value="` +
      count +
      `">
          <div class="task">
            <p>
              <span style="color: rgb(255, 0, 0 ); class="done"><i class="fa-regular fa-circle px-2 check" ></i>
                <p class="tasks">` +
      todo +
      `</p>
                </span>
              </p>
              <p class="times">` +
      formatTime(time) +
      `</p>
          </div>
          <div class="task edit-delete">
            <div class="px-2 edit">
              <span><i class="fa-solid fa-pencil"></i></span>
            </div>
            <div class="px-3 delete">
              <span><i class="fa-regular fa-trash-can"></i></span>
            </div>
          </div>
          <div class="cancel">
              <div class="px-3">
                  <span>
                    <i class="fa-solid fa-circle-xmark"></i>
                  </span>
              </div>
          </div>
      </div>
      `;
    $(".over").append(newTask);
    $(".delete").click(function () {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success ",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            $(this).parent().parent().remove();
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Your task has been deleted.",
              icon: "success",
            });
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Your task is safe :)",
              icon: "error",
            });
          }
        });
    });
    $(".edit").click(function () {
      
      // Remove any existing "editing" class from other rows
      $(".container-task").removeClass("editing");

      // Add the "editing" class to the current row
      var containerTask = $(this).parent().parent();
      containerTask.addClass("editing");

      var taskId = containerTask.find("input[type='hidden']").val();
      var taskText = containerTask.find(".tasks").text();
      var timeText = containerTask.find(".times").text();
      var timeParts = timeText.split(" ");
      var time = timeParts[0];
      var period = timeParts[1];

      var time12h = convertTimeTo12HourFormat(time, period);
      $("#save").show();
      $("#add").hide();
      $("#task").val(taskText.trim());
      $("#time").val(time12h);
      $("#period").text(period); // Update the period indicator
      $(this).find('.edit-delete').hide();
      var clickedRow = $(this);
      $('.task-data').not(clickedRow).find('.edit-delete').css("display", "flex");
      $('.task-data').not(clickedRow).find('.cancel').hide();
      $(this).parent().siblings().eq(2).css("display", "flex");
      clickedRow.parent().hide();

      $("#save")
        .off("click")
        .on("click", function () {
          $(".container-task").removeClass("editing");
          var updatedTask = {
            id: taskId,
            task: $("#task").val(),
            time: formatTime($("#time").val()), // Format the time with AM/PM indicator
          };

          // Update task display
          containerTask.find(".tasks").text(updatedTask.task);
          containerTask.find(".times").text(updatedTask.time);

          $("#add").show();
          $(".edit-delete").show();
          $(".cancel").hide();
          $("#save").hide();
          //remove all field
          $("#task").val("");
          $("#time").val("");
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your task has been Updated",
            showConfirmButton: false,
            timer: 1500,
          });
        });
        
    });
    $(".cancel").click(function () {
      $(".container-task").removeClass("editing");
      $("#add").show();
      $(".edit-delete").show();
      $(".cancel").hide();
      $("#save").hide();
      //remove all field
      $("#task").val("");
      $("#time").val("");
    });

    $(".check")
      .off("click")
      .on("click", function () {
        var containerTask = $(this).closest(".container-task");
        $(this).toggleClass("green");
        containerTask.find(".tasks, .times").toggleClass("done");
        containerTask.find(".edit").toggle();
      });

    count++;
  }
});

function formatTime(time) {
  // Split the time string into hours and minutes
  var parts = time.split(":");
  var hours = parseInt(parts[0], 10);
  var minutes = parseInt(parts[1], 10);

  // Check if it's afternoon or morning
  var period = hours >= 12 ? " PM" : " AM";

  // Convert hours to 12-hour format
  hours = hours % 12 === 0 ? 12 : hours % 12;

  // Pad single digit hours with a leading zero
  hours = hours < 10 ? "0" + hours : hours;

  // Pad single digit minutes with a leading zero
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Construct the formatted time string
  return hours + ":" + minutes + period;
}

function convertTimeTo12HourFormat(time24h) {
  // Split the time string into hours and minutes
  var parts = time24h.split(":");
  var hours = parseInt(parts[0], 10);
  var minutes = parseInt(parts[1], 10);

  // Check if it's afternoon or morning
  var period = hours >= 12 ? "PM" : "AM";

  // Pad single digit hours with a leading zero
  hours = hours < 10 ? "0" + hours : hours;

  // Pad single digit minutes with a leading zero
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Construct the formatted time string
  return hours + ":" + minutes;
}


