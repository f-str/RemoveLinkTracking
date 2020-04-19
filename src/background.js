const browser = window.browser || window.chrome;

browser.webRequest.onBeforeRequest.addListener(
    removeTracking,
    {urls: ['<all_urls>'], types: ['main_frame', 'sub_frame']},
    ['blocking']
);

// Set the default empty list on installation.
browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set({
        exceptions: []
    });
});

let exceptions = [];

// Get the stored list of exceptions
browser.storage.local.get(data => {
    if (data.exceptions) {
        exceptions = data.exceptions;
    }
});

// Listen for changes in the exceptions list
browser.storage.onChanged.addListener(changeData => {
    exceptions = changeData.exceptions.newValue;
});

function removeTracking({url}) {

    if (exceptions.indexOf((new URL(url).hostname)) !== -1) {
        return
    } else if (!REMOVER.mayContain(url)) {
        return
    }

    const redirectUrl = REMOVER.remove(url);

    if (redirectUrl === url) {
        return
    }

    return {
        redirectUrl
    }
}