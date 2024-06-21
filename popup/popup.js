const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'https://www.bing.com/api/shopping/v1/item/search?appid=67220BD2169C2EA709984467C21494086DF8CA85&features=persnlcashback&sf=cashback1';
const url = proxyUrl + targetUrl;

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

                    if (orderTotalSelector.includes(',')) {
                        let totalSelectors = orderTotalSelector.split(',');
                        totalSelectors.forEach(selector => {
                            console.log(selector);
                        });
                    } else {
                        console.log(orderTotalSelector);
                    }
                } else {
                    orderTotalSelector = null;
                    console.log("no order total selector found");
                }

                //find product names
                if (matchingPage.cartSelectors) {
                    productNameSelector = matchingPage.cartSelectors.productNameSelector;
                    if (!productNameSelector) {
                        productNameSelector = matchingPage.cartSelectors.productTitleSelector;
                    }

                    if (productNameSelector.includes(',')) {
                        let nameSelectors = productNameSelector.split(',');
                        nameSelectors.forEach(selector => {
                            console.log(selector);
                        });
                    } else {
                        console.log(productNameSelector);
                    }
                } else {
                    productNameSelector = null;
                    console.log("no product name selector found");
                }


                // print found selectors to popup




                document.getElementById('order-total').innerText = orderTotalSelector;
                document.getElementById('product-names').innerText = productNameSelector;


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
