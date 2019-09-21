browser.tabs.query({ currentWindow:true, active:true })
    .then(tabs => {
        document.getElementById("link").value = tabs[0].url;
    });