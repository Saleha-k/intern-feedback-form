const form = document.querySelector("#feedbackForm");
const nameinput = document.querySelector("#name");
const emailinput = document.querySelector("#email");
const categoryinput = document.querySelector("#category");
const messageinput = document.querySelector("#message");
const submitbutton = document.querySelector("#submitButton");
const statusmessage = document.querySelector("#statusMessage");
const charactercount = document.querySelector("#characterCount");
const nameerror = document.querySelector("#nameError");
const emailerror = document.querySelector("#emailError");
const categoryerror = document.querySelector("#categoryError");
const ratingerror = document.querySelector("#ratingError");
const messageerror = document.querySelector("#messageError");

// character counter

messageinput.addEventListener("input", function () {
    const numberofcharacters = messageinput.value.length;
    charactercount.textContent =
        `${numberofcharacters} / 500`;

});
// form submission

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearerrors();
    const formisvalid = validateform();
    if (formisvalid === false) {
        return;
    }
    const selectedrating =
        document.querySelector(
            'input[name="rating"]:checked'
        );
    const feedbackdata = {
        name: nameinput.value.trim(),
        email: emailinput.value.trim(),
        category: categoryinput.value,
        rating: Number(selectedrating.value),
        message: messageinput.value.trim()
    };
    submitbutton.disabled = true;
    showstatus(
        "Saving your feedback.",
        "loading"
    );
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(feedbackdata)
            }
        );
        if (!response.ok) {
            throw new Error("Request failed");
        }
        const result = await response.json();
        showstatus(
            `Thanks, ${feedbackdata.name}! Saved with ID ${result.id}.`,
            "success"
        );
        form.reset();
        charactercount.textContent = "0 / 500";
    } catch (error) {
        showstatus(
            "Something went wrong. Please try again.",
            "error"
        );
    } finally {
        submitbutton.disabled = false;
    }
});
// validate form
function validateform() {
    let formisvalid = true;
    // name valid
    const name = nameinput.value.trim();
    if (name.length < 3 || name.length > 50) {
        nameerror.textContent =
            "name must be between 3 and 50 characters.";
        formisvalid = false;
    }
    // email validation
    const email = emailinput.value.trim();
    if (isvalidemail(email) === false) {
        emailerror.textContent =
            "please enter a valid email address.";
        formisvalid = false;
    }
    // category validation
    if (categoryinput.value === "") {
        categoryerror.textContent =
            "please select a category.";
        formisvalid = false;
    }
    // rating valid
    const selectedrating =
        document.querySelector(
            'input[name="rating"]:checked'
        );
    if (selectedrating === null) {
        ratingerror.textContent =
            "please select a rating from 1 to 5.";
        formisvalid = false;
    }
    // message 
    const message = messageinput.value.trim();
    if (message.length < 10 || message.length > 500) {
        messageerror.textContent =
            "message must be between 10 and 500 characters.";
        formisvalid = false;
    }
    return formisvalid;
}
// email Format

function isvalidemail(email) {
    const emailpattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailpattern.test(email);
}
// ERROR message
function clearerrors() {
    nameerror.textContent = "";
    emailerror.textContent = "";
    categoryerror.textContent = "";
    ratingerror.textContent = "";
    messageerror.textContent = "";
}
// status message

function showstatus(message, type) {
    statusmessage.textContent = message;
    statusmessage.className =
        `statusmessage ${type}`;
}