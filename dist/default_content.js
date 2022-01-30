console.log("default content injected")

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // open google slide full-screen mode   
    if(request.message == "GSstart"){
        let elem = document.getElementById('punch-start-presentation-left')
        if (elem) {
            triggerClick(elem)
        }
        sendResponse({message:"done!"})
    }
    // get the user name from pages
    else if(request.message == "getUserName"){
        var userName = $(".userbutton span").html();
        sendResponse({content: userName, message:`found`})
    }

    // get course info from pages
    else if(request.message == "getTabsData"){
        var dataFilesUrl = [];
        var courseTitle = $(".page-header-headings h1").html()
        var dataFiles = $("a[href$='.txt']"); // <a> with urls end with .txt
        dataFiles.each(function(){
            dataFilesUrl.push($(this).attr("href"));
        });
        sendResponse({content: [courseTitle, dataFilesUrl], message:`found`})
    }
    return true;
});

function triggerClick (elem) {
    elem.dispatchEvent(new MouseEvent('mousedown'))
    elem.dispatchEvent(new MouseEvent('mouseup'))
}