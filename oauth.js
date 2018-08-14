let userAuthToken;

function loginUser() {
    return new Promise(function(resolve, reject) {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            console.log(token);
            userAuthToken = token;

            let init = {
                method: 'GET',
                async: true,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            };
            fetch(
                'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos&key=AIzaSyCjOXjhZ-46NNQIYE5R0TgG6XvBrWd5JMk',
                init)
                .then((response) => response.json())
                .then(function(data) {
                    console.log(data);

                    if (data.error) {
                        throw new Error('User did not approve access');
                    }

                    getServerToken(userAuthToken);

                    const givenName = data.names[0].givenName;
                    const userID = 'google:' + data.names[0].metadata.source.id;
                    const imgSrc = data.photos[0].url;

                    userInfo = [givenName, userID, imgSrc];

                    console.log(givenName);
                    console.log(userID);
                    console.log(imgSrc);

                    if (userInfo) {
                        resolve(userInfo);
                    } else {
                        reject(Error('There was no userInfo'));
                    }

                    // set user info in chrome storage
                    chrome.storage.local.set({'givenName': givenName,
                    'userID': userID, 'imgSRC': imgSrc});
                    // chrome.storage.local.get(['givenName',
                    // 'userID', 'imgSRC'], function(result) {
                    //     console.log(result);
                    // });

                    let init = {
                        method: 'GET',
                        async: true,
                        headers: {
                            'Authorization': 'Bearer ' + userAuthToken,
                            'Content-Type': 'application/json'
                        }
                    };
                    fetch(
                        'https://accounts.google.com/o/oauth2/revoke?token=' + userAuthToken,
                        init)
                        .then((response) => response.json())
                        .then(function(data) {
                            console.log(data);
                        });

                    chrome.identity.removeCachedAuthToken(
                        {'token': userAuthToken}, function() {
                        userAuthToken = undefined;
                    });
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    });
}

// gets the access token to the server and stores in chrome.storage
function getServerToken(oauthToken) {
    // send token to server
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
		if (xhttp.readyState == XMLHttpRequest.DONE) {
            console.log(xhttp.responseText);
			const response = JSON.parse(xhttp.responseText);
            console.log(response);
            console.log(response.token);

            chrome.storage.local.set({'token': response.token});
            chrome.storage.local.get('token', function(result) {
                console.log(result);
            });
		}
	};

	const params = '?oauthToken=' + oauthToken;
	const targetURL = 'https://localhost:3000/create-token' + params;
	xhttp.open('GET', targetURL);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function deleteServerToken(token) {
    // send token to server
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
		if (xhttp.readyState == XMLHttpRequest.DONE) {
            console.log(xhttp.responseText);
			const response = JSON.parse(xhttp.responseText);
            console.log(response);
            console.log(response.token);

            chrome.storage.local.remove('token');
            chrome.storage.local.get('token', function(result) {
                console.log(result);
            });
		}
	};

	const targetURL = 'https://localhost:3000/delete-token';
	xhttp.open('DELETE', targetURL);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    xhttp.send();
}
