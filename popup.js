window.name = "myPopup";
var loggedIn = false;
console.log(window.name);

var loginButton = document.createElement("button");
loginButton.innerHTML = "Log in";
loginButton.addEventListener("click", function () {
    loginUser().then(function (userInfo) {
        renderLoggedIn(userInfo);
    }, function (error) {
        console.log(error);
    });
});

var logoutButton = document.createElement("button");
logoutButton.innerHTML = "Log out";
logoutButton.addEventListener("click", function () {
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
    searchButton.className = 'button';
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
    
    img.src = "images/get_started128.png";
    img.className = "logo";
    
    div.innerHTML = "";
    
    p.innerHTML = "Login to Google to Begin!";
    
    div.appendChild(p);
    div.appendChild(loginButton);
    
    loggedIn = false;
}

if (loggedIn) {
    renderLoggedIn();
} else {
    renderLoggedOut();
}