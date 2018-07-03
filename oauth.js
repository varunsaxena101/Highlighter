window.onload = function () {
    document.querySelector('button').addEventListener('click', function () {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let init = {
                method: 'GET',
                async: true,
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            };
            fetch(
                /*'https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=AIzaSyC3_3dT8WIHlTm2tIWLS8XfQvKrBz8BPQY',*/
                'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos&key=AIzaSyC3_3dT8WIHlTm2tIWLS8XfQvKrBz8BPQY',
                init)
                .then((response) => response.json())
                .then(function (data) {
                    console.log(data);
                    console.log(data.names[0].displayName);
                    console.log(data.names[0].metadata.source.id);
                });
        });
    });
};