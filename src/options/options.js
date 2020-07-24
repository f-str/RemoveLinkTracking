const parameterTab = document.getElementById("parameterTab")
parameterTab.addEventListener("click", () => {opentab('parameter')})
const exceptionstab = document.getElementById("exceptionsTab")
exceptionstab.addEventListener("click", () => {opentab('exceptions')})
const logstab = document.getElementById("logsTab")
logstab.addEventListener("click", () => {opentab('logs')})
const settingstab = document.getElementById("settingsTab")
settingstab.addEventListener("click", () => {opentab('settings')})

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

function onError(e) {
    console.error(e);
}

// Get paramter map from local storage
let parameterMap;
function getMap(restoredSettings) {
    parameterMap = new Map(JSON.parse(restoredSettings.parameters))
    const mapAsc = new Map([...parameterMap.entries()].sort());
    mapAsc.forEach(addParamToList)
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


// Get ownParam from local storage
let ownParam;
function getOwnParam(restoredSettings) {
    ownParam = restoredSettings.ownParam.valueOf();

    // display banner only when ownParams flag is set
    document.getElementById("banner").style.display = ownParam ? "block" : "none";
}

// On opening the options page, fetch ownParam flag
browser.storage.local.get().then(getOwnParam, onError);

// Add click action to banner close button
const bannerClose = document.getElementById("banner-close");
bannerClose.addEventListener("click", () => {closeBanner()})

function closeBanner() {
    document.getElementById("banner").style.display = "none";

    // set the ownParam flag to false so the banner does not get displayed in the future until a new parameter is added
    browser.storage.local.set({
        ownParam: false
    });
}

function addParamToList(value, key) {
    const table = document.getElementById("paramTable");
    const row = table.insertRow(table.tBodies[0].rows.length);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);

    // Create img for remove icon
    const img = document.createElement("IMG");
    img.setAttribute("src", "../img/remove16.png");
    img.style.display = "inline";
    img.style.marginLeft = "5px";
    img.style.marginRight = "10px";
    img.addEventListener("click", ()=>{removeParameter(key)})

    // Create p element for key
    const p = document.createElement("P");
    p.setAttribute("id", "key-" + key)
    p.style.display = "inline-block";
    p.innerText = key;
    cell1.appendChild(img);
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

const addButton = document.getElementById("addButton");
addButton.addEventListener("click", () => {addParameter()})

function addParameter() {
    const inputBox = document.getElementById("addParameter");
    const param = inputBox.value.trim();
    if(param === '') return;
    inputBox.value = '';
    parameterMap.set(param, true);
    activeParams.push(param);
    addParamToList(true, param);
    document.getElementById("banner").style.display = "block";

    browser.storage.local.set({
        parameters: JSON.stringify(Array.from(parameterMap)),
        active: activeParams,
        ownParam: true
    })
}

function removeParameter(parameter) {
    parameterMap.delete(parameter);
    activeParams.remove(parameter);

    browser.storage.local.set({
        parameters: JSON.stringify(Array.from(parameterMap)),
        active: activeParams,
    })
    location.reload();
}

// ---- Exceptions ----

let exceptions = [];
function getExceptions(restoredSettings) {
    exceptions = restoredSettings.exceptions;
    exceptions.forEach(addExceptionsToTable);
}

// On opening the options page, fetch the excpetions
browser.storage.local.get().then(getExceptions, onError);

function addExceptionsToTable(entry) {
    const table = document.getElementById("exceptionTable");
    const row = table.insertRow(table.tBodies[0].rows.length);
    const cell = row.insertCell(0);

    // Create img for remove icon
    const img = document.createElement("IMG");
    img.setAttribute("src", "../img/remove16.png");
    img.style.display = "inline";
    img.style.marginLeft = "5px";
    img.style.marginRight = "10px";
    img.addEventListener("click", ()=>{removeException(entry)});
    cell.append(img);

    // Url
    const p = document.createElement("p");
    p.style.display = "inline-block";
    p.innerText = entry
    cell.appendChild(p);
}

const addExceptionButton = document.getElementById("addExceptionButton");
addExceptionButton.addEventListener("click", () => {addException()})

function addException() {
    const inputBox = document.getElementById("addExceptionInput");
    let url = inputBox.value.trim();
    if(url === '') return;
    inputBox.value = '';
    exceptions.push(url);
    addExceptionsToTable(url);

    storeExceptions();
}

function removeException(url) {
    exceptions.remove(url);
    storeExceptions();
    location.reload();
}

function storeExceptions() {
    browser.storage.local.set({
        exceptions: exceptions
    });
}

// ---- Logging ----

// Get active parameters from local storage
let logs = [];
function getLogs(restoredSettings) {
    logs = restoredSettings.logs;
    logs.reverse();
    logs.forEach(addLogsToList)
}

// On opening the options page, fetch logs
browser.storage.local.get().then(getLogs, onError);

// Listen for changes in the logs
browser.storage.onChanged.addListener(changeData => {
    if (changeData.logs != null) {
        logs = changeData.logs.newValue;
    }
});

function addLogsToList(entry) {
    const table = document.getElementById("logTable");
    const row = table.insertRow(table.tBodies[0].rows.length);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);

    // Create p element for date
    const p = document.createElement("P");
    p.style.display = "inline-block";
    p.innerText = entry["date"].toString();
    cell1.appendChild(p);

    // Create elements for urls
    const div = document.createElement("DIV");
    const p1 = document.createElement("P");
    p1.innerText = entry["urlOriginal"].toString();
    const p2 = document.createElement("P");
    p2.innerText = " => ";
    const p3 = document.createElement("P");
    p3.innerText = entry["urlModified"].toString();
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    cell2.appendChild(div);

    // Crete elements for removed parameter
    const p4 = document.createElement("P");
    p4.innerText = entry["parameter"].join(", ");
    cell3.appendChild(p4);
}

// ---- Settings ----

const clearLogsButton = document.getElementById("clearLogsButton");
clearLogsButton.addEventListener("click" ,() => {
    browser.storage.local.set({
        logs: []
    });
    document.getElementById("logTable").innerHTML = "";
});