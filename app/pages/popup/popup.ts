import { isAuthenticated, logout } from "../../scripts/services/auth.service";

const btn_logout = document.getElementById("logout")!;
const addBookmark = document.getElementById("add_bookmark")!;
// const saveBookmark = document.getElementById("save_bookmark");
const bookmarkContainer = document.getElementsByClassName("bookmark__container");

let saveBookmarkTemplate = document.createElement("div")
saveBookmarkTemplate.classList.add("bookmark");
saveBookmarkTemplate.id = "unsaved_bookmark";


function loadBookmarks() {
    chrome.storage.local.get("bookmarks", ({ bookmarks }) => {
        if (!bookmarks) { return; }

        bookmarkContainer[0]!.querySelectorAll(".bookmark").forEach((x) => x.remove())
        const marks = Object.values(bookmarks).sort((x: any, y: any) => new Date(y.dateCreated).getTime() - new Date(x.dateCreated).getTime())
        marks.forEach((bookmark: any) => {

            const bookmarkTemplate = document.createElement("div")
            bookmarkTemplate.classList.add("bookmark");
            bookmarkTemplate.innerHTML = `
            <div class="bookmark__left">
            <a href="${bookmark.url}" target="_blank" class="bookmark__btn">
            <p class="bookmark__name">${bookmark.title}</p>
            </a>
            <p class="bookmark__url">${bookmark.url}</p>
            </div>
            
            <div class="bookmark__right">
            <p class="bookmark__date">${new Date(bookmark.dateCreated).toLocaleDateString()}</p>
            <img src="../../assets/close-64.png" alt="bookmark icon" />
            </div>
            `;

            bookmarkTemplate.querySelector("img")!.addEventListener("click", () => deleteBookmark(bookmark.title))
            bookmarkContainer[0]!.append(bookmarkTemplate)
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
function showError(elem: HTMLElement, msg?: string) {

    elem.toggleAttribute("hidden")
    setTimeout(() => {
        elem.toggleAttribute("hidden")
    }, 3500);
}

/**
 * Save a bookmark with the current tab link
 * 
 * @param {{url:string,title:string}} currentTab 
 * @returns void
*/
function saveBookmark(currentTab: { url: string, title: string }) {
    const unsavedBookmark = document.getElementById("unsaved_bookmark")!;
    const unsavedBookmarkInput = unsavedBookmark.querySelector("input")!;
    if (unsavedBookmarkInput.value === '') {
        showError(document.querySelector(".error")!);
        return
    }

    chrome.storage.local.get("bookmarks", (bm) => {
        const bookmarks = bm?.bookmarks ? new Map(Object.entries(bm.bookmarks)) : new Map()

        bookmarks.set(unsavedBookmarkInput.value, {
            title: unsavedBookmarkInput.value,
            url: currentTab.url,
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
function deleteBookmark(id: string) {
    chrome.storage.local.get("bookmarks", (bm) => {
        console.log(delete bm.bookmarks[id]);
        chrome.storage.local.set({ bookmarks: bm.bookmarks });

        loadBookmarks();
    })
}

addBookmark.addEventListener("click", (ev) => {
    if (document.querySelector("#unsaved_bookmark")) {
        document.querySelector("#unsaved_bookmark")!.remove();
        return;
    }

    saveBookmarkTemplate.innerHTML = `
    <div class="bookmark__left">
    <input type="text" class="bookmark__name">
    <p class="bookmark__url">new bookmark</p>
    </div>
    
    <div class="bookmark__right">
    <p class="bookmark__date">${new Date().toLocaleDateString()}</p>
    
    <div>
    <img id="save_bookmark" style="height: 1.6em;"class="save__bookmark" src="../../assets/save-32.png" alt="save icon"/>
    <img id="cancel" src="../../assets/close-64.png" alt="bookmark icon" />
    </div>
    </div>`;


    chrome.storage.local.get("currentTab", ({ currentTab }) => {
        if (!currentTab) { return; }

        bookmarkContainer[0]!.prepend(saveBookmarkTemplate)
        saveBookmarkTemplate.querySelector("input")!.focus();
        saveBookmarkTemplate.querySelector("input")!.value = currentTab.title;
        document.getElementById("save_bookmark")!.addEventListener("click", () => saveBookmark(currentTab))
        document.getElementById("cancel")!.addEventListener("click", () => document.querySelector("#unsaved_bookmark")!.remove())
        saveBookmarkTemplate.querySelector("input")!.addEventListener("keydown", (ev) => ev.key === "Enter" ? saveBookmark(currentTab) : null);
    })
});

(() => {
    loadBookmarks();
    isAuthenticated().then((res) => {
        if (!res) {

        }
        
        btn_logout.onclick = logout
    });
})();
