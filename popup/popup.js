(() => {
    const addBookmark = document.getElementById("add_bookmark");
    // const saveBookmark = document.getElementById("save_bookmark");
    const bookmarkContainer = document.getElementsByClassName("bookmark__container");

    let saveBookmarkTemplate = document.createElement("div")
    saveBookmarkTemplate.classList.add("bookmark");
    saveBookmarkTemplate.id = "unsaved_bookmark";
    saveBookmarkTemplate.innerHTML = `<input type="text">
        <button class="bookmark__btn">
            <img
                id="save_bookmark"
                class="save__bookmark"
                src="../assets/save-32.png"
                alt="save icon"
            />
        </button>`;

    function loadBookmarks() {
        chrome.storage.local.get("bookmarks", ({ bookmarks }) => {
            const marks = Object.values(bookmarks);
            marks.forEach(bookmark => {

                const bookmarkTemplate = document.createElement("div")
                bookmarkTemplate.classList.add("bookmark");
                bookmarkTemplate.innerHTML = `
                <a href="${bookmark.url}" target="_blank" class="bookmark__btn">
                <p class="bookmark__name">${bookmark.title}</p>
                </a>`;

                bookmarkContainer[0].append(bookmarkTemplate)
            });
        })
    }

    function saveBookmark(currentTab) {
        const unsavedBookmark = document.getElementById("unsaved_bookmark");
        const unsavedBookmarkInput = unsavedBookmark.querySelector("input");
        console.log(unsavedBookmarkInput.value);
        console.log(currentTab);

        const bookmarks = new Map()
        bookmarks.set(unsavedBookmarkInput.value, { title: unsavedBookmarkInput.value, ur: currentTab });
        console.log(bookmarks);

        chrome.storage.local.set({ bookmarks: Object.fromEntries(bookmarks) });
        loadBookmarks();
        unsavedBookmark.remove();
    }



    addBookmark.addEventListener("click", (ev) => {
        // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //     console.log("Ayo, i been clicked");
        //     if (tabs.length === 0) return;
        //     chrome.tabs.sendMessage(tabs[0].id, { action: "updateContent", data: "lightblue" });
        // });


        console.log(ev);


        chrome.storage.local.get("currentTab", ({ currentTab }) => {
            if (!currentTab) {
                return;
            }

            bookmarkContainer[0].append(saveBookmarkTemplate)
            document.getElementById("save_bookmark").addEventListener("click", () => saveBookmark(currentTab))
        })


    });



})();
