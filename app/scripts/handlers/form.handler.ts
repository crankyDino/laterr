const validationOptions = {
    hasValue: {
        attribute: "required",
        isValid: (controller: HTMLFormElement) => {
            return controller.value.trim() !== "";
        },
        onSuccess: (label: HTMLLabelElement) => {
            label.setAttribute("hidden", "");
        },
        errorMsg: (controller: HTMLFormElement, label: HTMLLabelElement) => {
            return `${label.textContent.split(":")[0]} is required`;
        },
        onError: (errLabel: HTMLLabelElement) => {
            errLabel.removeAttribute("hidden");
        },
    },
    maxLength: {
        attribute: "maxlength",
        isValid: (controller: HTMLFormElement) => {
            const max = controller.getAttribute("maxlength")!;
            return controller.value.length <= parseInt(max);
        },
        errorMsg: (controller: HTMLFormElement, label: HTMLLabelElement) => {
            return `${label.textContent.split(":")[0]} is too long`;
        },
        onSuccess: (label: HTMLLabelElement) => {
            label.setAttribute("hidden", "");
        },
        onError: (errLabel: HTMLLabelElement) => {
            errLabel.removeAttribute("hidden");
        },
    },
    minLength: {
        attribute: "minlength",
        isValid: (controller: HTMLFormElement) => {
            const min = controller.getAttribute("minlength")!;
            return controller.value.length >= parseInt(min);
        },
        onSuccess: (label: HTMLLabelElement) => {
            label.setAttribute("hidden", "");
        },
        errorMsg: (controller: HTMLFormElement, label: HTMLLabelElement) => {
            return `${label.textContent.split(":")[0]} is too short`;
        },
        onError: (errLabel: HTMLLabelElement) => {
            errLabel.removeAttribute("hidden");
        },
    },
    formatIsValid: {
        attribute: "minlength",
        isValid: (controller: HTMLFormElement) => {
            const min = controller.getAttribute("minlength")!;
            return controller.value.length >= parseInt(min);
        },
        onSuccess: (label: HTMLLabelElement) => {
            label.setAttribute("hidden", "");
        },
        errorMsg: (controller: HTMLFormElement, label: HTMLLabelElement) => {
            return `${label.textContent.split(":")[0]} is too short`;
        },
        onError: (errLabel: HTMLLabelElement) => {
            errLabel.removeAttribute("hidden");
        },
    },
};


/**
 *
 * @param {HTMLFormElement} form
 * @param {Function} callback
  */
export function validateForm(form: HTMLFormElement, callback: Function) {
    form.setAttribute("novalidate", "");

    form.onsubmit = (ev) => {
        ev.preventDefault();
        if (form.checkValidity()) { return callback(ev); }
        return validateAllFormGroups(form);
    };
}

/**
 *
 * @param {HTMLFormElement}form
 * @returns {boolean}
 */
function validateAllFormGroups(form: HTMLFormElement) {
    const formGroups = Array.from(form.querySelectorAll(".form__group"));

    if (formGroups.length <= 0) {
        return false;
    }

    formGroups.forEach((group) => {
        if (!validateFormGroup(group)) {
            return false;
        }
        return true;
    });
}

/**
 *
 * @param {}formGroup
 * @returns {boolean}
 */
function validateFormGroup(formGroup: any) {
    // const label = formGroup.querySelector("label")
    const formControl = formGroup.querySelector("input, textarea");
    // const errLabel = formGroup.querySelector(".form--error")
    let isValid = false;

    for (const opt of Object.values(validationOptions)) {
        if (formControl.hasAttribute(opt.attribute) && !opt.isValid(formControl)) {
            // errLabel.textContent = opt.errorMsg(formControl, label:HTMLLabelElement);
            // opt.onError(errlabel:HTMLLabelElement)
            isValid = false;
            return;
        }
        isValid = true;
    }
    return isValid;
}

