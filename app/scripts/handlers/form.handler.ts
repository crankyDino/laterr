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
function validateFormGroup(formGroup: any ) {
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




// const validationOptions = {
//     hasValue: {
//         attribute: 'required',
//         isValid: (controller:HTMLFormElement) => { return controller.value.trim() !== "" },
//         onSuccess: (label:HTMLLabelElement) => { label?.setAttribute("hidden", "") },
//         errorMsg: (controller:HTMLFormElement, label:HTMLLabelElement) => {
//             const fieldName = label?.textContent.split(":")[0] || controller.name || controller.id || 'Field';
//             return `${fieldName} is required`
//         },
//         onError: (errlabel:HTMLLabelElement) => { errLabel?.removeAttribute("hidden") }
//     },
//     maxLength: {
//         attribute: 'maxlength',
//         isValid: (controller:HTMLFormElement) => {
//             const max = controller.getAttribute('maxlength');
//             return !max || controller.value.length <= parseInt(max)
//         },
//         errorMsg: (controller:HTMLFormElement, label:HTMLLabelElement) => {
//             const fieldName = label?.textContent.split(":")[0] || controller.name || controller.id || 'Field';
//             const max = controller.getAttribute('maxlength');
//             return `${fieldName} must be ${max} characters or less`
//         },
//         onSuccess: (label:HTMLLabelElement) => { label?.setAttribute("hidden", "") },
//         onError: (errlabel:HTMLLabelElement) => { errLabel?.removeAttribute("hidden") }
//     },
//     minLength: {
//         attribute: 'minlength',
//         isValid: (controller:HTMLFormElement) => {
//             const min = controller.getAttribute('minlength');
//             return !min || controller.value.length >= parseInt(min)
//         },
//         onSuccess: (label:HTMLLabelElement) => { label?.setAttribute("hidden", "") },
//         errorMsg: (controller:HTMLFormElement, label:HTMLLabelElement) => {
//             const fieldName = label?.textContent.split(":")[0] || controller.name || controller.id || 'Field';
//             const min = controller.getAttribute('minlength');
//             return `${fieldName} must be at least ${min} characters`
//         },
//         onError: (errlabel:HTMLLabelElement) => { errLabel?.removeAttribute("hidden") }
//     },
//     emailFormat: {
//         attribute: 'type',
//         isValid: (controller:HTMLFormElement) => {
//             if (controller:HTMLFormElement.getAttribute('type') !== 'email') return true;
//             const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//             return !controller.value || emailRegex.test(controller:HTMLFormElement.value);
//         },
//         onSuccess: (label:HTMLLabelElement) => { label?.setAttribute("hidden", "") },
//         errorMsg: (controller:HTMLFormElement, label:HTMLLabelElement) => {
//             const fieldName = label?.textContent.split(":")[0] || controller.name || controller.id || 'Email';
//             return `${fieldName} must be a valid email address`
//         },
//         onError: (errlabel:HTMLLabelElement) => { errLabel?.removeAttribute("hidden") }
//     }
// }

// /**
//  * Validates a form and sets up validation event handlers
//  * @param {HTMLFormElement} form
//  * @returns {boolean} - Returns true if form is currently valid
//  */
// export function validateForm(form) {
//     if (!form) {
//         console.error('Form element is required');
//         return false;
//     }

//     form.setAttribute("novalidate", "");

//     // Set up form submission handler
//     form.addEventListener('submit', (ev) => {
//         ev.preventDefault();
//         const isValid = validateAllFormGroups(form);

//         if (isValid) {
//             console.log('Form is valid, ready to submit');
//             // Trigger custom event for successful validation
//             form.dispatchEvent(new CustomEvent('formValidated', {
//                 detail: { isValid: true }
//             }));
//         } else {
//             console.log('Form validation failed');
//             form.dispatchEvent(new CustomEvent('formValidated', {
//                 detail: { isValid: false }
//             }));
//         }
//     });

//     // Set up real-time validation
//     setupRealTimeValidation(form);

//     // Return current validation state
//     return validateAllFormGroups(form);
// }

// /**
//  * Sets up real-time validation on form inputs
//  * @param {HTMLFormElement} form
//  */
// function setupRealTimeValidation(form) {
//     const inputs = form.querySelectorAll('input, textarea');

//     inputs.forEach(input => {
//         input.addEventListener('blur', () => {
//             const formGroup = input.closest('.form__group');
//             if (formGroup) {
//                 validateFormGroup(formGroup);
//             }
//         });

//         input.addEventListener('input', () => {
//             // Clear errors on input to provide immediate feedback
//             const formGroup = input.closest('.form__group');
//             if (formGroup) {
//                 const errLabel = formGroup.querySelector('.form--error');
//                 if (errlabel:HTMLLabelElement) {
//                     errLabel.setAttribute('hidden', '');
//                 }
//             }
//         });
//     });
// }

// /**
//  * Validates all form groups in a form
//  * @param {HTMLFormElement} form
//  * @returns {boolean}
//  */
// function validateAllFormGroups(form) {
//     const formGroups = Array.from(form.querySelectorAll(".form__group"));

//     if (formGroups.length <= 0) {
//         console.warn('No form groups found');
//         return false;
//     }

//     let allValid = true;

//     formGroups.forEach((group) => {
//         const isGroupValid = validateFormGroup(group);
//         if (!isGroupValid) {
//             allValid = false;
//         }
//     });

//     return allValid;
// }

// /**
//  * Validates a single form group
//  * @param {Element} formGroup
//  * @returns {boolean}
//  */
// function validateFormGroup(formGroup) {
//     const label = formGroup.querySelector("label");
//     const formControl = formGroup.querySelector("input, textarea");
//     const errLabel = formGroup.querySelector(".form--error");

//     if (!formControl) {
//         console.warn('No form control found in group');
//         return false;
//     }

//     let isValid = true;
//     let firstError = null;

//     // Check all validation rules
//     for (const [ruleName, opt] of Object.entries(validationOptions)) {
//         if (shouldApplyRule(formControl, opt) && !opt.isValid(formControl)) {
//             if (!firstError) {
//                 firstError = opt.errorMsg(formControl, label:HTMLLabelElement);
//             }
//             isValid = false;
//             break; // Stop at first error
//         }
//     }

//     // Handle validation result
//     if (isValid) {
//         // Clear any error messages
//         if (errlabel:HTMLLabelElement) {
//             opt.onSuccess?.(errlabel:HTMLLabelElement);
//         }
//         formControl.classList.remove('error');
//         formControl.classList.add('valid');
//     } else {
//         // Show error message
//         if (errLabel && firstError) {
//             errLabel.textContent = firstError;
//             const failedRule = Object.values(validationOptions).find(opt =>
//                 shouldApplyRule(formControl, opt) && !opt.isValid(formControl)
//             );
//             failedRule?.onError?.(errlabel:HTMLLabelElement);
//         }
//         formControl.classList.remove('valid');
//         formControl.classList.add('error');
//     }

//     return isValid;
// }

// /**
//  * Determines if a validation rule should be applied to a form control
//  * @param {Element} formControl
//  * @param {Object} validationOption
//  * @returns {boolean}
//  */
// function shouldApplyRule(formControl, validationOption) {
//     const attribute = validationOption.attribute;

//     // Special case for email format validation
//     if (attribute === 'type') {
//         return formControl.getAttribute('type') === 'email';
//     }

//     return formControl.hasAttribute(attribute);
// }

// /**
//  * Programmatically validate a form (useful for testing)
//  * @param {HTMLFormElement} form
//  * @returns {boolean}
//  */
// export function checkFormValidity(form) {
//     if (!form) return false;
//     return validateAllFormGroups(form);
// }

// /**
//  * Clear all validation states and errors in a form
//  * @param {HTMLFormElement} form
//  */
// export function clearFormValidation(form) {
//     if (!form) return;

//     const inputs = form.querySelectorAll('input, textarea');
//     const errorLabels = form.querySelectorAll('.form--error');

//     inputs.forEach(input => {
//         input.classList.remove('error', 'valid');
//     });

//     errorLabels.forEach(label => {
//         label.setAttribute('hidden', '');
//     });
// }
