let currentDomain = '';

chrome.browserAction.onClicked.addListener((tab) => {
  const url = new URL(tab.url);
  currentDomain = url.hostname;
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.method === "POST" && details.url.includes("https://www.bing.com/api/shopping/v1/item/search")) {
      let postedString = String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes));
      let postedObject = JSON.parse(postedString);

      postedObject.item.seller.domain = currentDomain;

      let modifiedRequestBody = JSON.stringify(postedObject);

      return { requestBody: { raw: [{ bytes: new TextEncoder().encode(modifiedRequestBody) }] } };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"]
);
