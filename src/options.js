const parameterTab = document.getElementById("parameterTab")
parameterTab.addEventListener("click", () => {opentab('parameter')})
const exceptionstab = document.getElementById("exceptionsTab")
exceptionstab.addEventListener("click", () => {opentab('exceptions')})

// Open parameter tab by default
parameterTab.click()

function opentab(tabid) {
    // Declare all variables
    let i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabid).style.display = "block";
    event.currentTarget.className += " active";
}

// Get paramter map from local storage
let parameterMap;
function getMap(restoredSettings) {
    parameterMap = new Map(JSON.parse(restoredSettings.parameters))
    parameterMap.forEach(addParamToList)
}

// On opening the options page, fetch stored parameter map.
browser.storage.local.get().then(getMap, onError);

// Get active parameters from local storage
let activeParams;
function getActive(restoredSettings) {
    activeParams = restoredSettings.active;
}

// On opening the options page, fetch active parameters
browser.storage.local.get().then(getActive, onError);

function addParamToList(value, key) {
    const table = document.getElementById("paramTable");
    const row = table.insertRow(table.tBodies[0].rows.length);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);

    // Create p element for key
    const p = document.createElement("P");
    p.setAttribute("id", "key-" + key)
    p.innerText = key;
    cell1.appendChild(p);

    // Create fancy toggle button
    const label = document.createElement("LABEL");
    label.setAttribute("class", "switch");
    const input = document.createElement("INPUT");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", key);
    input.addEventListener("click", ()=>{clicked(input.id)});
    input.checked = value.valueOf();

    const span = document.createElement("SPAN");
    span.setAttribute("class", "slider round");

    label.appendChild(input);
    label.appendChild(span);
    cell2.appendChild(label);
}

function clicked(elementId) {
    parameterMap.set(elementId, !parameterMap.get(elementId).valueOf())
    if (activeParams.includes(elementId).valueOf()) {
        activeParams.remove(elementId);
    } else {
        activeParams.push(elementId);
    }
    browser.storage.local.set({
        active: activeParams,
        parameters: JSON.stringify(Array.from(parameterMap))
    });
}

const blockedHostsTextArea = document.querySelector("#exception-url");

// Store the currently selected settings using browser.storage.local.
function storeSettings() {
    let exceptions = blockedHostsTextArea.value.split("\n");
    browser.storage.local.set({
        exceptions
    });
}

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(restoredSettings) {
    blockedHostsTextArea.value = restoredSettings.exceptions.join("\n");
}

function onError(e) {
    console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

// Whenever the contents of the textarea changes, save the new values
blockedHostsTextArea.addEventListener("change", storeSettings);