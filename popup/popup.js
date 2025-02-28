(() => {
    // const bookmark = document.getElementById("bookmark");




    bookmark.addEventListener("click", () => {
        // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //     console.log("Ayo, i been clicked");
        //     if (tabs.length === 0) return;
        //     chrome.tabs.sendMessage(tabs[0].id, { action: "updateContent", data: "lightblue" });
        // });

        chrome.storage.local.get("currentTab", (res) => {
            console.log(res);
        })
    });



})();
