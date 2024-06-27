// window.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("window.js loaded");

    chrome.runtime.onMessage.addListener(function(domain, sender, sendResponse) {
        console.log(domain);
    })

    
    document.getElementById('close').addEventListener('click', function () {
        console.log("Close button clicked");
        window.close();
    });
});
