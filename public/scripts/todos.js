$(function () {
  const TODO_ENDPOINT = "api/todos";
  const titleInput = $("#title-input");
  const descInput = $("#description-textarea");
  const addBtn = $("#add-btn");
  const successFeedback = $('.success-feedback')
  const errFeedback = $('.error-feedback');
  const todoList = $(".todo-list");
  const logoutBtn = $(".logout-btn");
  const checkbox = ".checkbox-container input";
  const deleteBtn = ".delete-btn";

  const loadTodos = () => {
    const endpoint = `${TODO_ENDPOINT}/${localStorage.getItem("user-id")}`;
    const token = localStorage.getItem("auth-token");
    fetch(endpoint, {
      method: "GET",
      headers: {
        'Authorization': token
      }
    })
    .then(response => response.json())
    .then(res => {
      if (res.success) {
        res.todos.forEach((todo) => {
          let todoHTML = generateTodoItem(todo._id, todo.title, todo.description? todo.description:"", todo.isDone);
          todoList.append(todoHTML)
        });
      } else {
        showFeedback(res.msg);
      }
    })
    .catch(err => {
      console.error(err);
      showFeedback("Something went wrong. Please try again later.");
    })
  }

  // initially load todos
  loadTodos();

  // onClick: add new todo button
  addBtn.on("click", e => {
    e.preventDefault();
    let title = titleInput.val();
    let description = descInput.val();

    if (title == "") {
      showFeedback("Please fill in the title");
      return;
    }

    fetch(TODO_ENDPOINT, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('auth-token')
      },
      body: JSON.stringify({
        userId: localStorage.getItem("user-id"),
        title:  title,
        description: description
      })
    })
    .then(response => response.json())
    .then(res => {
      if (res.success) {
        showFeedback("Successfully added a new todo item", "success");
        let todoHTML = generateTodoItem(res.newTodo._id, res.newTodo.title, res.newTodo.description);
        titleInput.val("");
        descInput.val("");
        todoList.append(todoHTML);
      } else {
        showFeedback(res.msg);
      }
    })
    .catch(err => {
      console.error(err);
      showFeedback("Something went wrong. Please try again later.");
    })
  });

  // onClick: checkmark on each todo item
  $(document).on("click", checkbox, e => {
    let todoId = $(e.target).data("check");
    let isChecked = $(e.target).is(":checked");
    
    fetch(TODO_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Authorization': localStorage.getItem('auth-token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "todoId": todoId,
        "isDone": isChecked
      })
    })
    .then(response => response.json())
    .then(res => {
      let currentTodo = $(`.card[data-todo="${todoId}"]`);
      currentTodo.toggleClass("completed");
    })
    .catch(err => {
      console.error(err);
      showFeedback("Something went wrong. Please try again later.");
    })


  });

  // onClick: delete X mark on each todo item
  $(document).on("click", deleteBtn, e => {
    let todoId = $(e.target).data("delete");
    const endpoint = `${TODO_ENDPOINT}/${todoId}`;

    fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': localStorage.getItem('auth-token')
      }
    })
    .then(response => response.json())
    .then(res => {
      console.log(res);
      if (res.success) {
        showFeedback(res.msg, "success");
        let currentTodo = $(`.card[data-todo="${todoId}"]`);
        currentTodo.remove();
      } else {
        showFeedback(res.msg);
      }
    })
    .catch(err => {
      console.error(err);
      showFeedback("Something went wrong. Please try again later");
    });
  });

  // onClick: logout button
  logoutBtn.on("click", () => {
    localStorage.clear();
    window.location.replace("/");
  });

  // template HTML for each todo item
  const generateTodoItem = (key, title, description, isDone=false) => {
    return `<div class="card ${isDone? "completed":""}" data-todo="${key}">
            <div class="card-header row justify-content-center align-items-center no-gutters">
                <div class="col-1">
                    <div class="checkbox-container">
                        <input type="checkbox" data-check="${key}" ${isDone? "checked": ""}>
                        <span class="checkmark"><i class="fas fa-check"></i></span>
                    </div>
                </div>
                <div class="col-10">
                    <button class="btn btn-block ${
                      description == "" ? "no-desc" : ""
                    }" type="button" data-toggle="collapse" data-target="#description-${key}">
                        <p class="todo-title">${title}</p>
                    </button>
                </div>
                <div class="col-1">
                    <p class="text-right"><i class="fas fa-times delete-btn" data-delete="${key}"></i></p>
                </div>
            </div>
            ${
              description == ""
                ? ""
                : `<div class="collapse" id="description-${key}">
                <div class="card-body row justify-content-center">
                    <div class="col-10">
                        <p class="todo-description">${description}</p>
                    </div>
                </div>
            </div>`
            }
        </div>`;
  };

  const showFeedback = (message, type="error") => {
    const feedbackElement = type == "success"? successFeedback: errFeedback;
    feedbackElement.text(message).show();
    setTimeout(() => {
      feedbackElement.slideUp(800);
    }, 2000);
  }

}); // end of $document ready wrapper
