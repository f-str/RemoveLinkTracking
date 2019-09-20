let gettingActiveTab = browser.tabs.query({currentWindow: true});
gettingActiveTab.then((tabs) => { document.getElementById("link").value=tabs[0].url(); Console.log(tabs[0].url())});
