let publicURL = 'https://api.zdrive.ir/v1/AUTH_mellatemamhossein/PM/';
let apiKey = 'bb3c6d47e70714a93d56d79c270a28e07c7020b6';

function initialize() {
    chrome.storage.sync.set({publicURL});
    chrome.storage.sync.set({apiKey});
}


chrome.runtime.onInstalled.addListener(() => initialize());
