const browser = window.browser || window.chrome;

browser.webRequest.onBeforeRequest.addListener(
    removeTracking,
    {urls: ['<all_urls>'], types: ['main_frame', 'sub_frame']},
    ['blocking']
);

// Generate map from keywords and true
const paramMap = new Map();
for(let keyword of Keywords) {
    paramMap.set(keyword, true)
}

// Set the default empty list on installation.
browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        let active = Keywords;
        let deletedParams = deleted_Keywords;
        let logs = [];

        browser.storage.local.get(data => {
            if (data.deletedParams) {
                deletedParams = deletedParams.concat(data.deletedParams).unique();
            }
            if (data.active) {
                active = active.concat(data.active).unique().filter((el) => !deletedParams.includes(el));
            }
            if (data.logs) {
                logs = data.logs;
            }
        });

        browser.storage.local.set({
            exceptions: [],
            parameters: JSON.stringify(Array.from(paramMap.entries())),
            active: active,
            ownParam: false,
            logging: true,
            logs: logs,
            showPageAction: false,
            deletedParams: deletedParams
        });
    }
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
    if (changeData.exceptions != null) {
        exceptions = changeData.exceptions.newValue;
    }
});

function removeTracking({url}) {

    if (exceptions.some((entry) => {return new URL(url).hostname.endsWith(entry)})) {
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