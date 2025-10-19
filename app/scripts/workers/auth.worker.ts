chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
        //update current url to current tab
        chrome.storage.local.set({ currentTab: { url: tabs[0]!.url, title: tabs[0]!.title } })
    }
});