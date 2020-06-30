// shorthand for $(document).ready(function() {})
$(function() {

    const LOGIN = 'login';
    const SIGNUP = 'signup';

    let usernameInput = $('#username-input');
    let passwordInput = $('#password-input');
    let btn = $('button[type="submit"]');
    let anchor = $('a.signup');
    let currentPage = LOGIN;  // login OR signup

    btn.on('click', (e) => {
        e.preventDefault();
        // if at login page
        if (currentPage == LOGIN) {
            // login logic here
            console.log("Login:", usernameInput.val(), passwordInput.val());
        }
        // else if at signup page 
        else {
            console.log("Signup:", usernameInput.val(), passwordInput.val());
        }
    });

    anchor.on('click', (e) => {
        e.preventDefault();
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

}); // end of document ready wrapper