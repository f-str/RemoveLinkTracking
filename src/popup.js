Array.prototype.remove = function() {
    let what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

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

function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function setCurrentURL() {
    browser.tabs.query({currentWindow: true, active: true})
        .then(tabs => {
            urlbox.value =  tabs[0].url
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