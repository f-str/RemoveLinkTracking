const urlbox = document.getElementById("link");
const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("click", clicked);
window.onload = init;

let exceptions = [];
function loadData() {
    // Get the stored list
    browser.storage.local.get(data => {
        if (data.exceptions) {
            exceptions = data.exceptions;
        }
    });
}

function setCurrentURL() {
    browser.tabs.query({currentWindow: true, active: true})
        .then(tabs => {
            urlbox.value = tabs[0].url
        })
}

function getHostname() {
    return (new URL(urlbox.value)).hostname;
}

async function init() {
    loadData();
    setCurrentURL();
    await Sleep(100);
    const hostname = getHostname();
    checkbox.checked = exceptions.includes(hostname).valueOf();
}

function clicked() {
    loadData();

    const hostname = getHostname();
    if (checkbox.checked) {
        exceptions.push(hostname);
        console.log(hostname + " added");
    } else {
        exceptions.remove(hostname);
        console.log(hostname + " removed");
    }
    browser.storage.local.set({
        exceptions: exceptions
    });
}