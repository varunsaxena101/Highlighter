//chrome storage sends an empty object if nothing is found
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function getUserInfo() {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(['givenName', 'userID', 'imgSRC'], function(result) {
            console.log(result);
            console.log(isEmpty(result));
            if (!isEmpty(result)) {
                resolve(result);
            } else {
                reject(Error('User is not logged in'));
            }
        });
    });
}

var contextMenuItem = {
    "id": "save",
    "title": "Save for Search",
    "contexts": ["selection"]
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(clickInfo) {
    if (clickInfo.menuItemId == "save" && clickInfo.selectionText) {
        //alert(clickInfo.selectionText);
        //highlight();

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        
            var url = tabs[0].url;
            console.log(url);
            var xhttp = new XMLHttpRequest();
            getUserInfo().then((userInfo) => {
                var payload = { 
                    userId: userInfo.userID,
                    addrURL: url, 
                    title: tabs[0].title,
                    highlight: clickInfo.selectionText
                    //label: "General"
                };
                console.log(payload);
        
                xhttp.onreadystatechange = function() {
                    console.log('callback called');
                    if (xhttp.readyState == XMLHttpRequest.DONE) {
                        console.log(xhttp.responseText);
                    }
                };
        
                xhttp.open('POST', 'http://localhost:3000/urls');
                xhttp.setRequestHeader('Content-Type', 'application/json');
                //xhttp.send(new URLSearchParams.append('url', url));
                xhttp.send(JSON.stringify(payload));
            }).catch((error) => {
                console.log(error);
            });
    
        });
    }
});

function highlight() {
    var selection = document.getSelection();
    if (selection.rangeCount == 0) {
        alert("There is no selection");
    } else {
        var range = selection.getRangeAt(0);
        var span = document.createElement("span");
        span.className = "highlighted-text";
        span.style.backgroundColor = 'yellow';
        span.style.cursor = 'pointer';
        span.innerHTML = range.toString();
        range.deleteContents();
        range.insertNode(span);
    }
    
}