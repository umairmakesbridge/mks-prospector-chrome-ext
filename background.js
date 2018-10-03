
var accesstoken = "";
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
       chrome.tabs.sendMessage(activeTab.id, {"message": "browser_loaded","accesstoken":accesstoken});
     });
   }
});
function getToken(){
  chrome.identity.getAuthToken({interactive: true}, function(token) {
          accesstoken = token;
  })
  
   chrome.identity.onSignInChanged.addListener(function (account, signedIn) {
                       
        chrome.identity.getAuthToken({interactive: true,account:account.id}, function(token) {
                accesstoken = token;
        })
        
    });

  
  setTimeout(getToken,1000*60*10);
}
getToken();
