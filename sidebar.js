document.getElementById('closeButton').addEventListener('click', function() {
    let sidebar = document.getElementById('mySidebar');
    if (sidebar) {
      sidebar.remove();
      document.body.style.marginRight = '0';  // Reset the margin
    }
  });
  
  
  document.addEventListener('DOMContentLoaded', async function () {
    const contentDiv = document.getElementById('content');
  
    async function getDomainInfo() {
      return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const tab = tabs[0];
          const url = new URL(tab.url);
          resolve(url.hostname);
        });
      });
    }
  
    async function callApi(domain, path) {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = 'https://www.bing.com/api/shopping/v1/item/search?appid=67220BD2169C2EA709984467C21494086DF8CA85&features=persnlcashback&sf=cashback1';
      const url = proxyUrl + targetUrl;
  
      const body = {
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
            "domain": domain,
            "path": path
          }
        },
        "sourceTypes": [
          "deals"
        ]
      };
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return data;
    }
  
    function saveToStorage(domain, data) {
      const storageData = {};
      storageData[domain] = data;
      chrome.storage.local.set(storageData);
    }
  
    function getFromStorage(domain) {
      return new Promise((resolve) => {
        chrome.storage.local.get(domain, (result) => {
          resolve(result[domain]);
        });
      });
    }
  
    function displayData(data) {
      document.getElementById('domain-name').textContent = data.domain;
      document.getElementById('order-total').textContent = data.orderTotal || 'N/A';
      document.getElementById('product-names').textContent = data.productNames ? data.productNames.join(', ') : 'N/A';
    }
  
    const domain = await getDomainInfo();
    let data = await getFromStorage(domain);
  
    if (!data) {
      const urlObj = new URL(window.location.href);
      const path = urlObj.pathname;
      data = await callApi(domain, path);
      saveToStorage(domain, data);
    }
  
    displayData({ domain, ...data });
  });
  