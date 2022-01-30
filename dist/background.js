// page action
var urlPattern = "*://docs.google.com/presentation/*"; 

function queryTabsAndShowPageActions(queryObject) {  
    chrome.tabs.query(queryObject,  
        function(tabs) {  
            if (tabs && tabs.length > 0) {  
                for (var i = 0; i < tabs.length; i++) {  
                    if (tabs[i].status === "complete") chrome.pageAction.show(tabs[i].id);  
                }  
            }  
        }  
    );  
}  

chrome.runtime.onInstalled.addListener(function() {  
    queryTabsAndShowPageActions({"active": false, "currentWindow": true, "url": urlPattern});  
});  

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {  
    queryTabsAndShowPageActions({"active": true, "currentWindow": true,"url": urlPattern});  
});
// page action ends

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // execute the Vue file
    // insert the content UI
    if(request.message == "InjectNewContentScript"){
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {file: "dist/build.js"}
            );
            sendResponse({ content: "", message:"Injection Done"})
        })
    }
    // get the user name from pages
    else if(request.message == "getUserName"){
        chrome.tabs.query({"url": "https://ummoodle.um.edu.mo/course/*"}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {content:"", message:"getUserName"}, function(response){
                chrome.storage.local.set({'userName': response.content}, function() {
                    console.log('UserName settings saved');
                    sendResponse({content: "", message:"found"})
                });            
            });
        })
    }
    
    // get course info from pages
    else if(request.message == "getTabsData"){
        chrome.tabs.query({"url": "https://ummoodle.um.edu.mo/course/*"}, function(tabs){
            var courseTitle = [];
            var courseInfo = [];
            for (var i=0; i<tabs.length; i++){
                chrome.tabs.sendMessage(tabs[i].id, {content:"", message:"getTabsData"}, function(response){
                    courseTitle.push(response.content[0]);
                    courseInfo.push(response.content[1]);
                    chrome.storage.local.set({'courseTitle': courseTitle, 'courseInfo': courseInfo}, function() {
                        console.log('Course Title and Course Info settings saved');
                    });
                });
            }
            sendResponse({content: "", message:"found"})
        })
    }
    
    return true;
});