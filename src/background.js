const browser = window.browser || window.chrome;

browser.webRequest.onBeforeRequest.addListener(
    removeTracking,
    {urls: ['<all_urls>'], types: ['main_frame', 'sub_frame']},
    ['blocking']
);

// Set the default empty list on installation.
browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install' || details.reason === 'update') {
        let active = Keywords;
        let paramMap = new Map();
        let deletedParams = deleted_Keywords;
        let logs = [];
        let exceptions = [];
        let ownParam = false;
        let logging = true;
        let showPageAction = false;

        // Get currently stored values
        browser.storage.local.get(data => {
            if (data.deletedParams) {
                deletedParams = deletedParams.concat(data.deletedParams).unique();
            }
            if (data.active) {
                active = active.concat(data.active).unique().filter((el) => !deletedParams.includes(el));
            }
            if (data.parameters) {
                paramMap = new Map(JSON.parse(data.parameters))
            }
            if (data.logs) {
                logs = data.logs;
            }
            if (data.exceptions) {
                exceptions = data.exceptions;
            }
            if (data.logging) {
                logging = data.logging.valueOf();
            }
            if (data.ownParam) {
                ownParam = data.ownParam.valueOf();
            }
            if (data.showPageAction) {
                showPageAction = data.showPageAction.valueOf();
            }
        });

        // Add new Keywords to parameterMap
        for(let keyword of Keywords) {
            if (!paramMap.has(keyword)) {
                paramMap.set(keyword, true);
            }
        }

        // Remove deleted keywords from parameter map
        deleted_Keywords.forEach(key => paramMap.delete(key))

        // Store new values
        browser.storage.local.set({
            exceptions: exceptions,
            parameters: JSON.stringify(Array.from(paramMap.entries())),
            active: active,
            ownParam: ownParam,
            logging: logging,
            logs: logs,
            showPageAction: showPageAction,
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