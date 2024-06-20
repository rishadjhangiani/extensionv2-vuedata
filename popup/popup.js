document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");

  // Listen for the message from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in popup.js:", request);
    if (request.action === "simpleMessage") {
      displayMessage(request.message);
    }
  });

  // Request a simple message from the background script
  chrome.runtime.sendMessage({ action: "getSimpleMessage" }, (response) => {
    console.log("Response from background.js:", response);
    if (response && response.message) {
      displayMessage(response.message);
    }
  });
});

function displayMessage(message) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  console.log("Displayed message in popup.js:", message);
}



/*document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");

  document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the form from submitting and reloading the page

    makeApiCall();

    /*chrome.runtime.sendMessage({ action: "getDomain" }, (response) => {
      console.log('Response from getDomain:', response);
      if (response && response.domain) {
        makeApiCall(response.domain);
      } else {
        console.error("No domain found in response");
        displayError("No domain found in response");
      }
    });*/
  /*});
});

function makeApiCall() {
  const requestBody = {
    "AgeGroup": 0,
    "IsAADSignedIn": true,
    "IsBingSignedInUser": false,
    "IsMSASignedIn": false,
    "IsOffTheRecord": false,
    "IsPersonalizationDataConsentChanged": false,
    "IsPersonalizationDataConsentEnabled": false,
    "IsSSOEnabled": false,
    "LdClickData": "",
    "MsClickId": "",
    "ReturnedToCashbackActivatedDomain": false,
    "UClickData": "",
    "item": {
      "seller": {
        "IsEdgeRebatesFlow": false,
        "domain": "amazon.com",
        "path": "/"
      }
    },
    "sourceTypes": [
      "deals"
    ]
  };

  chrome.runtime.sendMessage({ action: "makeApiCall", body: requestBody }, (response) => {
    console.log('response:', response);
    if (response.success) {
      console.log('works!', response.data);
      displayResults("good");
    } else {
      console.error("doesnt work:", response.error);
      displayError(response.error);
    }
  });
}

function displayResults(data) {
  const resultsDiv = document.getElementById('results');
  if (data === "good") {
    resultsDiv.textContent = "correct!";
  } else {
    resultsDiv.textContent = "bad";
  }
}

function displayError(error) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.textContent = `error: ${error}`;
}*/
