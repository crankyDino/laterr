import { validateForm } from "../../scripts/handlers/form.handler";

// import { login } from "../../scripts/services/auth.service";

(() => {

    var _action = 'login';

    function submit() {
        const form = document.getElementById("login-form")
        const isValid = validateForm(form)

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log(username,
            password,
            email
        );

        // login(email,password)
    }

    function init() {
        // const form = document.getElementById("login-form")        
        document.getElementById('btn-submit').onclick = submit;
        // login(email,password)
    }

    init()
})();
