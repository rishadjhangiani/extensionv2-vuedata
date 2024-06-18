document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['productData'], function(result) {
        document.getElementById('data').innerText = JSON.stringify
    })
})