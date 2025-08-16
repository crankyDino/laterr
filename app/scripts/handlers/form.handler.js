const validationOptions = {
    hasValue: {
        attribute: 'required',
        isValid: (controller) => { return controller.value.trim() !== "" },
        onSuccess: (label) => { label.setAttribute("hidden", "") },
        errorMsg: (controller, label) => { return `${label.textContent.split(":")[0]} is required` },
        onError: (errLabel) => { errLabel.removeAttribute("hidden") }
    },
    maxLength: {
        attribute: 'maxlength',
        isValid: (controller) => {
            const max = controller.getAttribute('maxlength');
            return controller.value.length <= parseInt(max)
        },
        errorMsg: (controller, label) => { return `${label.textContent.split(":")[0]} is too long` },
        onSuccess: (label) => { label.setAttribute("hidden", "") },
        onError: (errLabel) => { errLabel.removeAttribute("hidden") }
    },
    minLength: {
        attribute: 'minlength',
        isValid: (controller) => {
            const min = controller.getAttribute('minlength');
            return controller.value.length >= parseInt(min)
        },
        onSuccess: (label) => { label.setAttribute("hidden", "") },
        errorMsg: (controller, label) => { return `${label.textContent.split(":")[0]} is too short` },
        onError: (errLabel) => { errLabel.removeAttribute("hidden") }
    },
    formatIsValid: {
        attribute: 'minlength',
        isValid: (controller) => {
            const min = controller.getAttribute('minlength');
            return controller.value.length >= parseInt(min)
        },
        onSuccess: (label) => { label.setAttribute("hidden", "") },
        errorMsg: (controller, label) => { return `${label.textContent.split(":")[0]} is too short` },
        onError: (errLabel) => { errLabel.removeAttribute("hidden") }
    },
}

/**
 * 
 * @param {HTMLFormElement} form 
 * @returns {boolean}
 */
export function validateForm(form) {
    form.setAttribute("novalidate", "")
    let isValid = false;

    form.onsubmit = (ev) => {
        ev.preventDefault()
        if (form.checkValidity()) {
            isValid = true
            return
        }

        isValid = validateAllFormGroups(form)
    }
    return isValid
}

/**
 * 
 * @param {HTMLFormElement}form 
 * @returns {boolean}
 */
function validateAllFormGroups(form) {
    const formGroups = Array.from(form.querySelectorAll(".form__group"))

    if (formGroups.length <= 0) { return false }

    formGroups.forEach((group) => {
        if (!validateFormGroup(group)) { return false }
        return true
    })
}

/**
 * 
 * @param {}formGroup 
 * @returns {boolean}
 */
function validateFormGroup(formGroup) {
    // const label = formGroup.querySelector("label")
    const formControl = formGroup.querySelector("input, textarea")
    // const errLabel = formGroup.querySelector(".form--error")
    let isValid = false

    for (const opt of Object.values(validationOptions)) {
        if (formControl.hasAttribute(opt.attribute) && !opt.isValid(formControl)) {
            // errLabel.textContent = opt.errorMsg(formControl, label);
            // opt.onError(errLabel)
            isValid = false;
            return
        }
        isValid = true;
    }
    return isValid
}

