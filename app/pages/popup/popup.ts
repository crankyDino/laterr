import type { IBookmark, IBookmarkRequestPayload } from "../../lib/models/bookmark.model";
import { getCurrentUser, isAuthenticated, logout } from "../../scripts/services/auth.service";
import { createBookmark, getBookmarks, updateBookmark } from "../../scripts/services/bookmarks.service";

const btn_logout = document.getElementById("logout")!;
const btn_refresh = document.getElementById("refresh")!;
const btn_addBookmark = document.getElementById("add_bookmark")!;
const placeholder = document.getElementById("no_content")!;

// const saveBookmark = document.getElementById("save_bookmark");
const bookmarkContainer = document.getElementsByClassName("bookmark__container");

let localOnly: boolean = false
let saveBookmarkTemplate = document.createElement("div")
saveBookmarkTemplate.classList.add("bookmark");
saveBookmarkTemplate.id = "unsaved_bookmark";


function loadBookmarks() {
    var content: Array<IBookmark> = []

    switch (localOnly) {
        case true: {
            chrome.storage.local.get("bookmarks", ({ bookmarks }) => {
                addContent(Object.values(bookmarks))
            });
            break;
        }
        default: {
            getBookmarks().then(res => { addContent(res) });
            break;
        }
    }
}

function addContent(content: Array<IBookmark>) {

    if (!content.some(x => x)) { placeholder.hidden = false; return; }

    placeholder.hidden = true;

    content.forEach(c => {
        console.log('dang');
        console.log(c);

        bookmarkContainer[0]!.querySelectorAll(".bookmark").forEach((x) => x.remove());

        const marks = content.sort((x: IBookmark, y: IBookmark) => new Date(y?.last_visited).getTime() - new Date(x?.last_visited).getTime());

        // if(localOnly ){marks = }

        console.log(marks);

        marks.forEach((bookmark: IBookmark) => {
            const bookmarkTemplate = document.createElement("div");
            bookmarkTemplate.classList.add("bookmark");

            bookmarkTemplate.innerHTML = `
            <div class="bookmark__left">
            <a href="${bookmark.url}" target="_blank" class="bookmark__btn">
            <p class="bookmark__name">${bookmark.title}</p>
            </a>
            <p class="bookmark__url">${bookmark.url}</p>
            </div>
            
            <div class="bookmark__right">
            <p class="bookmark__date">${new Date(bookmark.last_visited).toLocaleDateString()}</p>
            <img src="../../assets/close-64.png" alt="bookmark icon" />
            </div>`;

            bookmarkTemplate.querySelector("img")!.addEventListener("click", () => deleteBookmark(bookmark))
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

    if (localOnly) {
        chrome.storage.local.get("bookmarks", async (b) => {
            const bookmarks = b?.bookmarks ? new Map<string, IBookmark>(Object.entries(b.bookmarks)) : new Map()
            bookmarks.set(unsavedBookmarkInput.value, await createBookmarkPayload(unsavedBookmarkInput.value, currentTab.url));
            chrome.storage.local.set({ bookmarks: Object.fromEntries(bookmarks) });
            loadBookmarks();
            unsavedBookmark.remove();
            return;
        });
        return;
    }

    createBookmarkPayload(unsavedBookmarkInput.value, currentTab.url).then(res => {
        console.log("thang thang");
        console.log(res);
        createBookmark(res).finally(() => { loadBookmarks(); })
        unsavedBookmark.remove();
    })

}

/**
 * Remove a bookmark from chrome.storage.local with the target id 
 * 
 * @param {string} bookmark 
 * @returns void
*/
function deleteBookmark(bookmark: IBookmark) {
    if (localOnly) {
        chrome.storage.local.get("bookmarks", (bm) => {
            console.log(delete bm.bookmarks[bookmark.id]);
            chrome.storage.local.set({ bookmarks: bm.bookmarks });
            loadBookmarks();
        })
        return
    }
    updateBookmark(bookmark.id, bookmark).finally(() => loadBookmarks())
}

async function createBookmarkPayload(params: string, url: string): Promise<IBookmarkRequestPayload> {
    const user = await getCurrentUser();

    const record: IBookmarkRequestPayload = {
        title: params,
        url: url,
        // last_visited: new Date(),
        active: true,
        tags_fk: [],
        user_id: user!.id
    }

    return record
}

function addBookmark() {
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

    placeholder.hidden = true;
    
    chrome.storage.local.get("currentTab", ({ currentTab }) => {
        if (!currentTab) { return; }
        bookmarkContainer[0]!.prepend(saveBookmarkTemplate)
        saveBookmarkTemplate.querySelector("input")!.focus();
        saveBookmarkTemplate.querySelector("input")!.value = currentTab.title;
        document.getElementById("save_bookmark")!.addEventListener("click", () => saveBookmark(currentTab))
        document.getElementById("cancel")!.addEventListener("click", () => document.querySelector("#unsaved_bookmark")!.remove(), placeholder.hidden = false)
        saveBookmarkTemplate.querySelector("input")!.addEventListener("keydown", (ev) => ev.key === "Enter" ? saveBookmark(currentTab) : null);
    })
};

(() => {
    loadBookmarks();
    isAuthenticated().then((res) => {
        if (!res) { return; }
        btn_addBookmark.onclick = addBookmark
        btn_logout.onclick = logout
        btn_refresh.onclick = loadBookmarks
    });
})();
