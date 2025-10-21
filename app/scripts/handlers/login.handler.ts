
export function goHome() {
    chrome.action.setPopup({ popup: 'pages/popup/popup.html' });
    window.location.href = '../popup/popup.html';
}

export function goLogin () {
    chrome.action.setPopup({ popup: 'pages/login/login.html' });
    window.location.href = '../login/login.html';
}