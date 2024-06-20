console.log("Background script loaded");

chrome.browserAction.onClicked.addListener((tab) => {
  console.log("Browser action icon clicked");

  // Send a simple message to the popup when the browser action is clicked
  chrome.runtime.sendMessage({ action: "simpleMessage", message: "Hello from background.js!" }, () => {
    console.log("Message sent to popup.js");
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message in background:', request);
  if (request.action === "getSimpleMessage") {
    sendResponse({ message: "Hello from background.js!" });
  }
});



/*chrome.browserAction.onClicked.addListener((tab) => {
  console.log("hi");
  const url = new URL(tab.url);
  currentDomain = url.hostname;
  console.log('Current domain detected:', currentDomain);
  chrome.storage.local.set({ currentDomain: currentDomain }, () => {
    console.log('Current domain stored:', currentDomain);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  if (request.action === "getDomain") {
    chrome.storage.local.get(['currentDomain'], (result) => {
      console.log('Domain retrieved from storage:', result.currentDomain);
      sendResponse({ domain: result.currentDomain });
    });
    return true;  // Keep the message channel open for sendResponse
  } else if (request.action === "makeApiCall") {
    fetch('https://www.bing.com/api/shopping/v1/item/search', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request.body)
    })
    .then(response => response.json())
    .then(data => {
      console.log('API call success:', data);
      sendResponse({ success: true, data: data });
    })
    .catch(error => {
      console.error('API call error:', error);
      sendResponse({ success: false, error: error });
    });
    return true;  // Keep the message channel open for sendResponse
  }
});


/*
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.method === "POST" && details.url.includes("https://www.bing.com/api/shopping/v1/item/search")) {
      let postedString = String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes));
      let postedObject = JSON.parse(postedString);

      postedObject.item.seller.domain = currentDomain;
      console.log(currentDomain);

      let modifiedRequestBody = JSON.stringify(postedObject);

      return { requestBody: { raw: [{ bytes: new TextEncoder().encode(modifiedRequestBody) }] } };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"]
);
*/