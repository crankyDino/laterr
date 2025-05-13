(() => {

    // console.log(document.getElementsByTagName("h1")[0].title);
    // console.log(document.getElementsByTagName("h1")[0].textContent);
    // console.log(document.getElementsByClassName("title"));



})()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(location.href);

    switch (message.action) {
        case "addBookmark":
localStorage.
            break;

        default:
            break;
    }

    if (message.action === "updateContent") {
        console.log("Received in content script:", message.data);
        document.body.style.backgroundColor = message.data; // Example: Change background color
    }
});