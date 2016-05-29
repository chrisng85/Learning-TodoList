/*
 * @author Shaumik "Dada" Daityari
 * @copyright December 2013
 * Code is cloned and modified for my learning purpose only
 */


var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

(function(todo, data, $) {

  var defaults = {
    todoTask: "todo-task",
    todoHeader: "task-header",
    todoDate: "task-date",
    todoOwner: "task-owner",
    todoDescription: "task-description",
    taskId: "task-",
    formId: "todo-form",
    dataAttribute: "data",
    deleteDiv: "delete-div"
  };

  var codes = {
    "1" : "#pending",
    "2" : "#inProgress",
    "3" : "#completed"
  };
  
  var code_wrappers = {
    "1" : "#pending-wrapper",
    "2" : "#inProgress-wrapper",
    "3" : "#completed-wrapper"
  };

  todo.init = function (options) {

    options = options || {};
    options = $.extend({}, defaults, options);

    $.each(data, function (index, params) {
        generateElement(params);
    });

    // Adding drop function to each category of task
    $.each(codes, function (index, value) {
      $(value).droppable({
        drop: function (event, ui) {
          var element = ui.helper,
              css_id = element.attr("id"),
              id = css_id.replace(options.taskId, ""),
              object = data[id];

          // Removing old element
          removeElement(object);

          // Changing object code
          object.code = index;

          // Generating new element
          generateElement(object);

          // Updating Local Storage
          data[id] = object;
          localStorage.setItem("todoData", JSON.stringify(data));

          // Hiding Delete Area
          $("#" + defaults.deleteDiv).hide();
        }
      });
    });

    // Adding drop function to delete div
    $("#" + options.deleteDiv).droppable({
      drop: function(event, ui) {
        var element = ui.helper,
            css_id = element.attr("id"),
            id = css_id.replace(options.taskId, ""),
            object = data[id];

        // Removing old element
        removeElement(object);

        // Updating local storage
        delete data[id];
        localStorage.setItem("todoData", JSON.stringify(data));

        // Hiding Delete Area
        $("#" + defaults.deleteDiv).hide();
      }
    });

  };

  // Add Task
  var generateElement = function(params){
    var parent = $(code_wrappers[params.code]),
        wrapper,
        info = "";

    if (!parent) {
        return;
    }
    
    if ((params.owner !== "") && (params.date !== "")) {
      info = params.owner + " " + "*" + " " + params.date;
    } else {
      info = params.owner + params.date;
    }

    wrapper = $("<div />", {
      "class" : defaults.todoTask,
      "id" : defaults.taskId + params.id,
      "data" : params.id
    }).appendTo(parent);

    $("<div />", {
      "class" : defaults.todoHeader,
      "text": params.title
    }).appendTo(wrapper);

    $("<div />", {
      "class" : defaults.todoDate,
      "text": info
    }).appendTo(wrapper);

    $("<div />", {
      "class" : defaults.todoDescription,
      "text": params.description
    }).appendTo(wrapper);

    wrapper.draggable({
      start: function() {
        $("#" + defaults.deleteDiv).show();
      },
      stop: function() {
        $("#" + defaults.deleteDiv).hide();
      },
      revert: "invalid",
      revertDuration : 200
    });

  };

  // Remove task
  var removeElement = function (params) {
    $("#" + defaults.taskId + params.id).remove();
  };

  todo.add = function() {
    var inputs = $("#" + defaults.formId + " :input"),
      errorMessage = "Title can not be empty",
      id, title, description, date, tempData;

    if (inputs.length !== 5) {
      return;
    }

    title = inputs[0].value;
    owner = inputs[1].value;
    description = inputs[2].value;
    date = inputs[3].value;

    if (!title) {
      confirm(errorMessage);
      return;
    }

    id = new Date().getTime();

    tempData = {
      id : id,
      code: "1",
      title: title,
      owner: owner,
      date: date,
      description: description
    };

    // Saving element in local storage
    data[id] = tempData;
    localStorage.setItem("todoData", JSON.stringify(data));

    // Generate Todo Element
    generateElement(tempData);

    // Reset Form
    inputs[0].value = "";
    inputs[1].value = "";
    inputs[2].value = "";
    inputs[3].value = "";
  };

})(todo, data, jQuery);