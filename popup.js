window.name = "myPopup";
var loggedIn = false;
console.log(window.name);
//import {getUserInfo} from 'module';

var loginButton = document.createElement("button");
loginButton.innerHTML = "Log in";
loginButton.className = "btn btn-login";
loginButton.addEventListener("click", function () {
    loginUser().then((userInfo) => {
        renderLoggedIn(userInfo);
    }, function (error) {
        console.log(error);
    });
});

var logoutButton = document.createElement("button");
logoutButton.innerHTML = "Log out";
logoutButton.className = "btn btn-login";
logoutButton.addEventListener("click", function () {
    chrome.storage.local.remove(['givenName', 'userID', 'imgSRC']);
    renderLoggedOut();
});

function renderLoggedIn(userInfo) {
    'use strict';
    var img = document.getElementById("picture"),
        div = document.getElementById("buttons"),
        searchButton = document.createElement("a"),
        p = document.createElement("p");
    
    img.src = userInfo[2];
    img.className = "avatar";
    
    div.innerHTML = "";

    searchButton.innerHTML = "Search Saves";
    searchButton.href = 'searchPage.html';
    searchButton.className = 'btn btn-search';
    searchButton.target = "_blank";

    p.innerHTML = "Hello, " + userInfo[0];
    
    div.appendChild(p);
    div.appendChild(searchButton);
    div.appendChild(logoutButton);
    
    loggedIn = true;
}

function renderLoggedOut() {
    var img = document.getElementById("picture"),
        div = document.getElementById("buttons"),
        p = document.createElement("p");
        p2 = document.createElement("p");
    
    img.src = "images/get_started128.png";
    img.className = "logo";
    
    div.innerHTML = "";

    p2.innerHTML = "Welcome to SaveSearcher"
    p2.className = "welcome"
    
    p.innerHTML = "Sign in with Google to Begin!";
    
    div.appendChild(p2);
    div.appendChild(p);
    div.appendChild(loginButton);
    
    loggedIn = false;
}

getUserInfo().then(function (result) {
    console.log(result);
    loggedIn = true;
    result = [result.givenName, result.userID, result.imgSRC];
    console.log(result);
    renderLoggedIn(result);
}).catch(function (error) {
    console.log(error);
    loggedIn = false;
    renderLoggedOut();
});

