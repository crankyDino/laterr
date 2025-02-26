// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     console.log("I'm here in the background!");
// });

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