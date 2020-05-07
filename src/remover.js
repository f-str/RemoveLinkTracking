let keywords = [];

// Get the stored list of active keywords
browser.storage.local.get(data => {
    if (data.active) {
        keywords = data.active;
    }
});

// Listen for changes in the active list
browser.storage.onChanged.addListener(changeData => {
    if(changeData.active != null) {
        keywords = changeData.active.newValue;
    }
});

class REMOVER {

    static mayContain(url) {
            for (let keyword of keywords) {
                if (url.includes(keyword))
                    return true
            }
        return false;
    }

    static remove(url) {
        const parsedURL = new URL(url);

        for (let param of [...parsedURL.searchParams.keys()]) {
            for (let keyword of keywords) {
                if (param.startsWith(keyword))
                    parsedURL.searchParams.delete(param);
            }
        }

        const parsedFragment = new URLSearchParams(parsedURL.hash.substring(1));
        for (let param of [...parsedFragment.keys()]) {
            for (let keyword of keywords) {
                if (param.startsWith(keyword))
                    parsedFragment.delete(param)
            }
        }

        return parsedURL.toString();
    }
}
