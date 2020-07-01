// shorthand for $(document).ready(function() {})
$(function () {
  const LOGIN = "login";
  const SIGNUP = "signup";

  const FIELD_REQUIRED_MSG = "Please fill in all required fields";

  // backend response constants
  const USER_NOT_EXIST = "USER_NOT_EXIST";
  const INCORRECT_PASSWORD = "INCORRECT_PASSWORD";
  const USER_ALREADY_EXIST = "USER_ALREADY_EXIST";

  const usernameInput = $("#username-input");
  const passwordInput = $("#password-input");
  const btn = $('button[type="submit"]');
  const anchor = $("a.signup");
  const loader = $(".loader");
  const errorMsg = $(".invalid-feedback");
  let currentPage = LOGIN; // login OR signup

  $(document).on(
    "change paste keydown keyup",
    [usernameInput, passwordInput],
    e => {
      removeFormInvalid(e.target);
    }
  );

  btn.on("click", e => {
    e.preventDefault();
    if (!isFormValid()) {
      displayFormInvalid(FIELD_REQUIRED_MSG);
      return;
    }
    // if at login page
    if (currentPage == LOGIN) {
      showLoader();
      fetch("api/users/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput.val(),
          password: passwordInput.val(),
        }),
      })
        .then(response => response.json())
        .then(res => {
          if (res.success) {
            localStorage.setItem("auth-token", res.token);
            localStorage.setItem("user-id", res.user.userId);
            localStorage.setItem("user-name", res.user.username);
            window.location.replace("/todos.html");
          } else {
            displayFormInvalid(res.msg, res.type);
          }
        })
        .catch(err => {
          displayFormInvalid("Something went wrong.");
          console.error(err);
        })
        .finally(hideLoader());
    }
    // else if at signup page
    else {
      showLoader();
      fetch("api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput.val(),
          password: passwordInput.val(),
        }),
      })
        .then(response => response.json())
        .then(res => {
          if (res.success) {
            clearForm();
            // head back to login screen
            currentPage = LOGIN;
            btn.removeClass("btn-primary").addClass("btn-success");
            anchor.removeClass("login").addClass("signup");
            btn.html("login");
            anchor.html("Sign Up");
            // show success and hide
            $(".alert-success").text(res.msg).removeClass("d-none").show();
            setTimeout(() => {
              $(".alert-success").slideUp("slow");
            }, 1500);
          } else {
            displayFormInvalid(res.msg, res.type);
          }
        })
        .catch(err => {
          displayFormInvalid("Something went wrong.");
          console.error(err);
        })
        .finally(hideLoader());
    }
  });

  anchor.on("click", e => {
    e.preventDefault();
    clearForm();
    // if at login page
    if (currentPage == LOGIN) {
      currentPage = SIGNUP;
      btn.removeClass("btn-success").addClass("btn-primary");
      anchor.removeClass("signup").addClass("login");
      btn.html("sign up");
      anchor.html("Back to Login");
    }
    // else if at signup page
    else {
      currentPage = LOGIN;
      btn.removeClass("btn-primary").addClass("btn-success");
      anchor.removeClass("login").addClass("signup");
      btn.html("login");
      anchor.html("Sign Up");
    }
  });

  // show loader, remove button and link
  const showLoader = () => {
    btn.hide();
    anchor.hide();
    loader.show();
  };
  // hide loader, show button and link
  const hideLoader = () => {
    btn.show();
    anchor.show();
    loader.hide();
  };

  // check if form is valid
  const isFormValid = () => {
    return usernameInput.val() !== "" && passwordInput.val() !== "";
  };

  // display error feedbacks on the form
  const displayFormInvalid = (message, invalidType = null) => {
    if (
      usernameInput.val() == "" ||
      invalidType === USER_NOT_EXIST ||
      invalidType === USER_ALREADY_EXIST
    ) {
      usernameInput.addClass("is-invalid");
    }
    if (passwordInput.val() == "" || invalidType === INCORRECT_PASSWORD) {
      passwordInput.addClass("is-invalid");
    }
    errorMsg.text(message).show();
    btn.addClass("btn-dark").attr("disabled", true);
  };

  // hide corresponding error feedbacks
  const removeFormInvalid = input => {
    $(input).removeClass("is-invalid");
    if (isFormValid()) {
      errorMsg.hide();
      btn.removeClass("btn-dark").attr("disabled", false);
    }
  };

  // reset the form (inc. error msg and button disabled)
  const clearForm = () => {
    usernameInput.val("").removeClass("is-invalid");
    passwordInput.val("").removeClass("is-invalid");
    errorMsg.hide();
    btn.removeClass("btn-dark").attr("disabled", false);
  };
}); // end of document ready wrapper
