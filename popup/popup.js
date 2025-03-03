(() => {
    const addBookmark = document.getElementById("add_bookmark");
    // const saveBookmark = document.getElementById("save_bookmark");
    const bookmarkContainer = document.getElementsByClassName("bookmark__container");

    let saveBookmarkTemplate = document.createElement("div")
    saveBookmarkTemplate.classList.add("bookmark");
    saveBookmarkTemplate.id = "unsaved_bookmark";


    function loadBookmarks() {
        chrome.storage.local.get("bookmarks", ({ bookmarks }) => {
            if (!bookmarks) { return; }

            bookmarkContainer[0].querySelectorAll(".bookmark").forEach((x) => x.remove())
            const marks = Object.values(bookmarks).sort((x, y) => new Date(y.dateCreated) - new Date(x.dateCreated))
            marks.forEach(bookmark => {

                const bookmarkTemplate = document.createElement("div")
                bookmarkTemplate.classList.add("bookmark");
                bookmarkTemplate.innerHTML = `
                <a href="${bookmark.url}" target="_blank" class="bookmark__btn">
                <p class="bookmark__name">${bookmark.title}</p>
                </a>
                <img
                    id="add_bookmark"
                    src="../assets/close-64.png"
                    alt="bookmark icon"
                  />
                `;

                bookmarkTemplate.querySelector("img").addEventListener("click", () => deleteBookmark(bookmark.title))
                bookmarkContainer[0].append(bookmarkTemplate)
            });
        })
    }

    /**
     * Toggles the target error message
     * 
     * @param {HTMLElement} elem 
     * @param {string} msg 
     * 
     */
    function showError(elem, msg) {

        elem.toggleAttribute("hidden")
        setTimeout(() => {
            elem.toggleAttribute("hidden")
        }, 3500);
    }

    /**
     * Save a bookmark with the current tab link
     * 
     * @param {string} currentTab 
     * @returns void
     */
    function saveBookmark(currentTab) {
        const unsavedBookmark = document.getElementById("unsaved_bookmark");
        const unsavedBookmarkInput = unsavedBookmark.querySelector("input");
        if (unsavedBookmarkInput.value === '') {
            showError(document.querySelector(".error"));
            return
        }

        // bookmarks.set(unsavedBookmarkInput.value, { title: unsavedBookmarkInput.value, ur: currentTab });

        chrome.storage.local.get("bookmarks", (bm) => {
            const bookmarks = bm?.bookmarks ? new Map(Object.entries(bm.bookmarks)) : new Map()

            bookmarks.set(unsavedBookmarkInput.value, {
                title: unsavedBookmarkInput.value,
                url: currentTab,
                dateCreated: new Date().toISOString()
            });

            chrome.storage.local.set({ bookmarks: Object.fromEntries(bookmarks) });

            loadBookmarks();
            unsavedBookmark.remove();
            return;
        });
    }

    /**
     * Remove a bookmark from chrome.storage.local with the target id 
     * 
     * @param {string} id 
     * @returns void
     */
    function deleteBookmark(id) {
        chrome.storage.local.get("bookmarks", (bm) => {
            console.log(delete bm.bookmarks[id]);
            chrome.storage.local.set({ bookmarks: bm.bookmarks });

            loadBookmarks();
        })
    }

    addBookmark.addEventListener("click", (ev) => {
        // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //     console.log("Ayo, i been clicked");
        //     if (tabs.length === 0) return;
        //     chrome.tabs.sendMessage(tabs[0].id, { action: "updateContent", data: "lightblue" });
        // });

        console.log("broooooo");

        if (document.querySelector("#unsaved_bookmark")) { return; }

        saveBookmarkTemplate.innerHTML = `<input type="text">
        <button class="bookmark__btn">
            <img
                id="save_bookmark"
                class="save__bookmark"
                src="../assets/save-32.png"
                alt="save icon"
            />
        </button>`;


        chrome.storage.local.get("currentTab", ({ currentTab }) => {
            if (!currentTab) {
                return;
            }

            bookmarkContainer[0].prepend(saveBookmarkTemplate)
            saveBookmarkTemplate.querySelector("input").focus();
            document.getElementById("save_bookmark").addEventListener("click", () => saveBookmark(currentTab))
        })


    });

    loadBookmarks();

})();
