console.log('Chrome Storage:', chrome.storage); // Add this line to check if chrome.storage is defined


const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // TODO: set up a proxy server in node js (after local storage)
const targetUrl = 'https://www.bing.com/api/shopping/v1/item/search?appid=67220BD2169C2EA709984467C21494086DF8CA85&features=persnlcashback&sf=cashback1';
const url = proxyUrl + targetUrl;

// TODO: fix html, make it detachable (close button), highlight the elemnts
// TODO: everytime the extension is clicked, i dont wanna keep making the api call
// key, value --> key is domain name + value is api call object
// seonc pdart --> using local storage
// TODO: make caching; local storage for extension so that we dont make the api call every day [caching timeline like 2 days]
     // --> figure out how i can configure the caching timeline [another page that i can change the api call timeline]
// TODO: say that this is not checkout url + show what the matching urls are
// TODO: if any info is null, local storage check if possible
// TODO: connecting to kusto table

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('detachBtn').addEventListener('click', function () {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const tabUrl = tabs[0].url;
            const encodedUrl = encodeURIComponent(tabUrl);
            const popupUrl = chrome.runtime.getURL(`popup/window.html?url=${encodedUrl}`);
            chrome.windows.create({
                url: popupUrl,
                type: 'popup',
                width: 400,
                height: 600
            });
            let urlObj = new URL(tabUrl);
            let domain = urlObj.hostname;
            let path = urlObj.pathname;

            let parts = domain.split('.');
            if (parts.length > 2) {
                domain = parts.slice(parts.length - 2).join('.');
            }
            document.getElementById('domain-name').textContent = domain;
            
            
            // ISSUE: tryna send domain name to window.html 
            chrome.runtime.sendMessage({type: 'domainName', domain: domain}, (response) => {
                console.log("domain stored in background:", response.status);
            });

        

            // check if domain exists in local storage
            console.log(domain);
            makeApiCall(domain, path);
            // if domain does not exist in local storage
            

            
        });

    });
});


// function to call api giving domain

function makeApiCall(domain, path) {
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

    postData(url, body).then(response => {
        console.log(response);
        // Handle the response data as needed
    }).catch(error => {
        console.error('Error:', error);
    });
}

// Function to post data to the API
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
    });
    console.log(data);
    return response.json(); // parses JSON response into native JavaScript objects
}




// function to get selectors + get inner text





// detach button stores tab url to session storage
    // opens new window
    // get domain + path of stored tab url 
    // checks if stored tab url is:
        // starts with chrome-extension
            // return error that no ecommerce link was found
        // domain is in local storage
            // find selectors + print to div
        
        // domain is not in local storage
            // call api + store in local storage
            // find selectors + print to div

/*
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tabUrl = new URL(tabs[0].url);
    let domain = tabUrl.hostname;
    let path = tabUrl.pathname;
    console.log(tabUrl);
    const storageKey = `${domain}${path}`;

    let parts = domain.split('.');
    if (parts.length > 2) {
        domain = parts.slice(parts.length - 2).join('.');
    }
    document.getElementById('domain-name').textContent = domain;

    chrome.storage.local.get([storageKey], function(result) {
        const now = Date.now();
        if (result[storageKey]) {
            const { timestamp, data } = result[storageKey];
            if (now - timestamp < STORAGE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000) {
                console.log('Data found in storage');
                const { ProductNames, OrderTotal } = data;
                document.getElementById('order-total').textContent = OrderTotal;
                document.getElementById('product-names').textContent = ProductNames.join(', ');
                return;
            } else {
                console.log('data expired, making API call');
                chrome.storage.local.remove(storageKey);
            }
        }
        console.log('didnt find data');
        makeApiCall(domain, path, storageKey);
    });
});

function makeApiCall(domain, path, storageKey) {
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

    async function postData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }

    postData(url, body)
        .then(data => {
            console.log(data);

            const allCheckoutPages = data.deals.retailerData.allCheckoutPages;
            const allFinalCheckoutPages = data.deals.retailerData.allFinalCheckoutPages;
            let matchingPage = "";
            if (allCheckoutPages.find(page => page.checkoutPageUrl === path && page.pageType === "CheckoutPage")) {
                matchingPage = allCheckoutPages.find(page => page.checkoutPageUrl === path && page.pageType === "CheckoutPage");
            } else if (allCheckoutPages.find(page => path.startsWith(page.checkoutPageUrl) && page.pageType === "CheckoutPage")) {
                matchingPage = allCheckoutPages.find(page => path.startsWith(page.checkoutPageUrl) && page.pageType === "CheckoutPage");
            } else {
                matchingPage = allFinalCheckoutPages.find(page => page.checkoutPageUrl === path);
            }

            if (!matchingPage) {
                document.getElementById('domain-name').innerText = 'No Checkout Page Found';
            }

            if (matchingPage) {
                let orderTotalSelector = '';
                let productNameSelector = '';
                if (matchingPage.orderTotalDataElementSelector) {
                    orderTotalSelector = matchingPage.orderTotalDataElementSelector;
                    getSelectorInnerText(orderTotalSelector, 'order-total');
                } else {
                    document.getElementById('order-total').innerText = 'No order total selector found';
                }

                if (matchingPage.cartSelectors) {
                    productNameSelector = matchingPage.cartSelectors.productNameSelector;
                    if (!productNameSelector) {
                        productNameSelector = matchingPage.cartSelectors.productTitleSelector;
                    }
                    getSelectorInnerText(productNameSelector, 'product-names');
                } else {
                    document.getElementById('product-names').innerText = 'No product name selector found';
                }

                const productNames = document.getElementById('product-names').textContent.split(', ');
                const orderTotal = document.getElementById('order-total').textContent;

                const storageData = {
                    timestamp: Date.now(),
                    data: {
                        ProductNames: productNames,
                        OrderTotal: orderTotal
                    }
                };

                chrome.storage.local.set({
                    [storageKey]: storageData
                }, function() {
                    console.log("Data saved to chrome storage");
                });
            } else {
                document.getElementById('order-total').innerText = 'Failed to retrieve the order total.';
                document.getElementById('product-names').innerText = 'Failed to retrieve product names.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('order-total').textContent = 'Error fetching data';
            document.getElementById('product-names').textContent = 'Error fetching data';
        });
}

function getSelectorInnerText(selectors, elementId) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(tabs[0].id, {
            code: `(${function(selectors) {
                let selectorArray = selectors.includes(',') ? selectors.split(',').map(sel => sel.trim()) : [selectors]; 
                for (let selector of selectorArray) {
                    let element = document.querySelector(selector);
                    if (element && element.innerText) {
                        return element.innerText;
                    }
                }
                return 'all selectors are incorrect or elements not found';
            }})(${JSON.stringify(selectors)})`
        }, (results) => {
            if (results && results[0]) {
                document.getElementById(elementId).textContent = results[0];
            } else {
                document.getElementById(elementId).textContent = 'error retrieving data';
            }
        });
    });
}
*/