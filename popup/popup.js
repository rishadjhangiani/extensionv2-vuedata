const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
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


chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tabUrl = new URL(tabs[0].url);
    let domain = tabUrl.hostname;
    let path = tabUrl.pathname;

    let parts = domain.split('.');
    //split at dot so like if www.example or pay.ebay

    if (parts.length > 2) {
        //if there are multiple parts
        domain = parts.slice(parts.length - 2).join('.');
    }

    document.getElementById('domain-name').textContent = domain;

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
        return response.json(); // parses JSON response into native JavaScript objects
    }

    postData(url, body)
        .then(data => {
            console.log(data); // JSON data parsed by `response.json()` call
            const allCheckoutPages = data.deals.retailerData.allCheckoutPages;
            const allFinalCheckoutPages = data.deals.retailerData.allFinalCheckoutPages;
            //check if in allCheckoutPages
            let matchingPage = "";
            if (allCheckoutPages.find(page => page.checkoutPageUrl === path && page.pageType === "CheckoutPage")) {
                matchingPage = allCheckoutPages.find(page => page.checkoutPageUrl === path && page.pageType === "CheckoutPage");
            } else if (allCheckoutPages.find(page => path.startsWith(page.checkoutPageUrl) && page.pageType === "CheckoutPage")) {
                matchingPage = allCheckoutPages.find(page => path.startsWith(page.checkoutPageUrl) && page.pageType === "CheckoutPage");
                //check if path has dynbamic parts
            } else {
                //check if in allFinalCheckoutPages
                matchingPage = allFinalCheckoutPages.find(page => page.checkoutPageUrl === path);
            }

            if (matchingPage) {
                let orderTotalSelector = '';
                let productNameSelector = '';
                // all main logic for after finding correct matching page
                //find order total
                if (matchingPage.orderTotalDataElementSelector) {
                    orderTotalSelector = matchingPage.orderTotalDataElementSelector;
                    getSelectorInnerText(orderTotalSelector, 'order-total');
                } else {
                    document.getElementById('order-total').innerText = 'No order total selector found';
                    console.log("no order total selector found");
                }

                //find product names
                if (matchingPage.cartSelectors) {
                    productNameSelector = matchingPage.cartSelectors.productNameSelector;
                    if (!productNameSelector) {
                        productNameSelector = matchingPage.cartSelectors.productTitleSelector;
                    }

                    getSelectorInnerText(productNameSelector, 'product-names');
                } else {
                    console.log("no product name selector found");
                    document.getElementById('product-names').innerText = 'No product name selector found';
                }

            } else {
                console.log("no checkout page found");
                //throw error that no checkout page was found

                document.getElementById('order-total').innerText = 'Failed to retrieve the order total.';
                document.getElementById('product-names').innerText = 'Failed to retrieve product names.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('order-total').textContent = 'Error fetching data';
            document.getElementById('product-names').textContent = 'Error fetching data';
        });
});


function getSelectorInnerText(selectors, elementId) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.executeScript(tabs[0].id, {
            code: `(${function(selectors) {
                let selectorArray = selectors.includes(',') ? selectors.split(',').map(sel => sel.trim()) : [selectors]; 
                //if multiple selectors, iterate through until one works + returns non-null innerText!
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