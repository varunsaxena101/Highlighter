function initialize() {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(['name', 'id', 'img'], function(result) {
            console.log(result.toString());
            if (result) {
                resolve(result);
            } else {
                reject(Error('User is not logged in'));
            }
        });
    });
}