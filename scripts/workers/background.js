chrome.tabs.onUpdated.addListener((tabId, tab) => {
    console.log(tab.url);

    // const queryParameters = tab.url.split("?")[1];
    // const urlParameters = new URLSearchParams(queryParameters);

    // chrome.tabs.sendMessage(tabId, {
    //     type: "NEW",
    //     videoId: urlParameters.get("v"),
    // });
});

chrome.action.onClicked.addListener(() => {
    console.log("I'm here in the background actioning");
});

chrome.runtime.onInstalled.addListener(() => {
    console.log("Laterr Extension Installed!");
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("Message received:", message);

//     if (message.type === "TEST") {
//         sendResponse({ status: "Background script is active!" });
//     }
// });

