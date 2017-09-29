
// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
   if(changeInfo.status == 'complete'){
     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
       var activeTab = tabs[0];
       chrome.tabs.sendMessage(activeTab.id, {"message": "browser_loaded"});
     });
   }
});
