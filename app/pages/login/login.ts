import { validateForm } from "../../scripts/handlers/form.handler";
import { login, signup } from "../../scripts/services/auth.service";

let action: 'login' | 'signup' = 'login';
const form = (document.getElementById("login-form") as HTMLFormElement);
const legend = (document.getElementsByTagName('legend')[0] as HTMLLegendElement);
const txtUsername = (document.getElementById('username') as HTMLInputElement);
const txtEmail = (document.getElementById('email') as HTMLInputElement);
const txtPassword = (document.getElementById('password') as HTMLInputElement);
const btn_submit = document.getElementById('btn_submit') as HTMLDivElement;
const btn_signup = document.getElementById('btn_signup') as HTMLDivElement;

function submit() {
    switch (action) {
        case "signup":
            signup(txtEmail.value, txtPassword.value, txtUsername.value)
            break;
        default:
            login(txtEmail.value, txtPassword.value)
            break;
    }
}

function toggle_signup_form() {
    const usernameWrapper = document.getElementById('usernameWrapper') as HTMLDivElement;
    const confirmPswdWrapper = document.getElementById('confirmPswd') as HTMLDivElement;

    switch (action) {
        case "signup":
            [usernameWrapper, confirmPswdWrapper].forEach(element => {
                console.log(element);
                element.style.display = "";
                element.getElementsByTagName("input")[0]!.required = true
            });
            btn_signup.textContent = "login"
            btn_signup.previousElementSibling!.textContent = "already have an account?"
            legend.textContent = "Sign-up"
            btn_submit.textContent = "Sign-up"
            break;
        default:
            [usernameWrapper, confirmPswdWrapper].forEach(element => {
                element.style.display = "none";
                element.getElementsByTagName("input")[0]!.required = false
            });
            btn_signup.textContent = "sign-up";
            btn_signup.previousElementSibling!.textContent = "don't have an account?"
            btn_submit.textContent = "Login"
            legend.textContent = "Login"
            break;
    }
}

function btn_signup_handler() {
    action = action === "login" ? "signup" : "login"
    toggle_signup_form()
}

(() => {
    btn_signup.onclick = btn_signup_handler
    form.reset()
    validateForm(form, submit)
})();
