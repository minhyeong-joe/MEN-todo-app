$(function () {
  const titleInput = $("#title-input");
  const descInput = $("#description-textarea");
  const addBtn = $("#add-btn");
  const todoList = $(".todo-list");
  const logoutBtn = $(".logout-btn");
  const checkbox = ".checkbox-container input";
  const deleteBtn = ".delete-btn";

  let index = 0;

  // onClick: add new todo button
  addBtn.on("click", e => {
    e.preventDefault();
    let title = titleInput.val();
    let description = descInput.val();

    let todoHTML = generateTodoItem(index, title, description);
    index++;
    titleInput.val("");
    descInput.val("");

    todoList.append(todoHTML);
  });

  // onClick: checkmark on each todo item
  $(document).on("click", checkbox, e => {
    let $this = $(e.target);
    let todoIndex = $this.data("check");
    let currentTodo = $(`.card[data-todo="${todoIndex}"]`);
    currentTodo.toggleClass("completed");
  });

  // onClick: delete X mark on each todo item
  $(document).on("click", deleteBtn, e => {
    let $this = $(e.target);
    let todoIndex = $this.data("delete");
    let currentTodo = $(`.card[data-todo="${todoIndex}"]`);

    currentTodo.remove();
    index--;
  });

  // onClick: logout button
  logoutBtn.on("click", () => {
    localStorage.clear();
    window.location.replace("/");
  });

  // template HTML for each todo item
  const generateTodoItem = (index, title, description) => {
    return `<div class="card" data-todo="${index}">
            <div class="card-header row justify-content-center align-items-center no-gutters">
                <div class="col-1">
                    <div class="checkbox-container">
                        <input type="checkbox" data-check="${index}">
                        <span class="checkmark"><i class="fas fa-check"></i></span>
                    </div>
                </div>
                <div class="col-10">
                    <button class="btn btn-block ${
                      description == "" ? "no-desc" : ""
                    }" type="button" data-toggle="collapse" data-target="#description-${index}">
                        <p class="todo-title">${title}</p>
                    </button>
                </div>
                <div class="col-1">
                    <p class="text-right"><i class="fas fa-times delete-btn" data-delete="${index}"></i></p>
                </div>
            </div>
            ${
              description == ""
                ? ""
                : `<div class="collapse" id="description-${index}">
                <div class="card-body row justify-content-center">
                    <div class="col-10">
                        <p class="todo-description">${description}</p>
                    </div>
                </div>
            </div>`
            }
        </div>`;
  };
}); // end of $document ready wrapper
