const parameterTab = document.getElementById("parameterTab")
parameterTab.addEventListener("click", () => {
    opentab('parameter')
})
const exceptionstab = document.getElementById("exceptionsTab")
exceptionstab.addEventListener("click", () => {
    opentab('exceptions')
})
const logstab = document.getElementById("logsTab")
logstab.addEventListener("click", () => {
    opentab('logs')
})
const settingstab = document.getElementById("settingsTab")
settingstab.addEventListener("click", () => {
    opentab('settings')
})

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

// Get stored parameters from local storage
browser.storage.local.get().then(loadParameter, onError);

/**
 * Prints out a given error. This should be used in .get().then(..) cases.
 * @param e for the error object.
 */
function onError(e) {
    console.error(e);
}

/**
 * Loads needed parameter from local storage.
 * @param stored for access to all stored parameter.
 */
function loadParameter(stored) {
    setParameterMap(stored.parameters);
    setActiveParameter(stored.active);
    setOwnParam(stored.ownParam);
    setExceptions(stored.exceptions);
    setLogs(stored.logs);
    setShowPageAction(stored.showPageAction);
    setLogging(stored.logging);
}

let parameterMap;

/**
 * Stores the given parameterMap to a local variable, sorts them alphabetically and add them to the table.
 * @param storedParameterMap for the stored parameter map.
 */
function setParameterMap(storedParameterMap) {
    parameterMap = new Map(JSON.parse(storedParameterMap))
    const mapAsc = new Map([...parameterMap.entries()].sort());
    mapAsc.forEach(addParamToList)
}

let activeParams;

/**
 * Stores the given storedActiveParameter to a local variable.
 * @param storedActiveParameter for the stored active parameter list.
 */
function setActiveParameter(storedActiveParameter) {
    activeParams = storedActiveParameter;
}

let ownParam;

/**
 * Stores the given storedOwnParameter in a local variable and display the banner if the own parameter flag is set to {@code true}
 * @param storedOwnParameter for the stored own parameter flag.
 */
function setOwnParam(storedOwnParameter) {
    ownParam = storedOwnParameter.valueOf();

    // display banner only when ownParams flag is set
    document.getElementById("banner").style.display = ownParam ? "block" : "none";
}

let exceptions = [];

/**
 * Stores the given storedExceptions list in a local variable and add them to the table.
 * @param storedExceptions for the stored exceptions list.
 */
function setExceptions(storedExceptions) {
    exceptions = storedExceptions;
    exceptions.forEach(addExceptionsToTable);
}

let logs = [];

/**
 * Stores the given storedLogs list in a local variable in a reversed order and add them to the table.
 * @param storedLogs for the stored logs list.
 */
function setLogs(storedLogs) {
    logs = storedLogs;
    logs.reverse();
    logs.forEach(addLogsToList)
}

let logging;

/**
 * Store the given storedLogging flag in a local variable and set the checkbox according to it.
 * @param storedLogging for the stored flag.
 */
function setLogging(storedLogging) {
    logging = storedLogging;

    document.getElementById("enableLogsCheckbox").checked = logging;
}

let showPageAction;

/**
 * Store the given storedShowPageAction flag in a local variable and set the checkbox according to it.
 * @param storedShowPageAction for the stored flag.
 */
function setShowPageAction(storedShowPageAction) {
    showPageAction = storedShowPageAction;

    document.getElementById("enablePageActionCheckbox").checked = showPageAction;
}

// Add click action to banner close button
const bannerClose = document.getElementById("banner-close");
bannerClose.addEventListener("click", () => {
    closeBanner()
})

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
    img.addEventListener("click", () => {
        removeParameter(key)
    })

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
    input.addEventListener("click", () => {
        clicked(input.id)
    });
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
addButton.addEventListener("click", () => {
    addParameter()
})

function addParameter() {
    const inputBox = document.getElementById("addParameter");
    const param = inputBox.value.trim();
    if (param === '') return;
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
    img.addEventListener("click", () => {
        removeException(entry)
    });
    cell.append(img);

    // Url
    const p = document.createElement("p");
    p.style.display = "inline-block";
    p.innerText = entry
    cell.appendChild(p);
}

const addExceptionButton = document.getElementById("addExceptionButton");
addExceptionButton.addEventListener("click", () => {
    addException()
})

function addException() {
    const inputBox = document.getElementById("addExceptionInput");
    let url = inputBox.value.trim();
    if (url === '') return;
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

// Clear logs button
const clearLogsButton = document.getElementById("clearLogsButton");
clearLogsButton.addEventListener("click", () => {
    browser.storage.local.set({
        logs: []
    });
    document.getElementById("logTable").innerHTML = "";
});

// Logging checkbox
const enableLogsCheckbox = document.getElementById("enableLogsCheckbox");

function setEnableLogsCheckbox() {
    logging = !logging;
    browser.storage.local.set({
        logging: logging
    });
}

enableLogsCheckbox.addEventListener("check", () => {
    setEnableLogsCheckbox();
})

// Page action checkbox
const enablePageActionCheckbox = document.getElementById("enablePageActionCheckbox");

function setEnablePageAction() {
    showPageAction = !showPageAction;
    browser.storage.local.set({
        showPageAction: showPageAction
    });
}

enablePageActionCheckbox.addEventListener("check", () => {
    setEnablePageAction();
})