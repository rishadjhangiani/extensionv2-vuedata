const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'https://www.bing.com/api/shopping/v1/item/search?appid=67220BD2169C2EA709984467C21494086DF8CA85&features=persnlcashback&sf=cashback1';
const url = proxyUrl + targetUrl;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tabUrl = new URL(tabs[0].url);
    let domain = tabUrl.hostname;
    let path = tabUrl.pathname;

    if (domain.startsWith('www.')) {
        domain = domain.substring(4);
    }
    
    console.log(domain);
    console.log(path);
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
            let matchingPage = allCheckoutPages.find(page => page.checkoutPageUrl === path);
    
            if (!matchingPage) {
                matchingPage = allCheckoutPages.find(page => path.startsWith(page.checkoutPageUrl));
            }
    
            let cart = '';
            if (matchingPage.cartSelectors) {
                cart = matchingPage.cartSelectors;
            }
            console.log(matchingPage);
            console.log(cart);
            
            if (matchingPage) {
                let selector = matchingPage.orderTotalDataElementSelector;
                let productTitleSelector = matchingPage.cartSelectors?.productTitleSelector || '';
                if(!productTitleSelector) {
                    productNamesMessage = 'Selector not found';
                    document.getElementById('product-names').innerText = productNamesMessage;
                }
                    chrome.tabs.executeScript(
                        tabs[0].id,
                        {
                            code: `
                                (function() {
                                    const orderElement = document.querySelector("${selector}");
                                    const orderTotal = orderElement ? orderElement.innerText : 'Order total element not found';
    
                                    const productElements = document.querySelectorAll("${productTitleSelector}");
                                    const productNames = Array.from(productElements).map(el => el.innerText).join(', ');
    
                                    return { orderTotal, productNames };
                                })();
                            `
                        },
                        (results) => {
                            //if (results && results[0]) {
                                console.log(results);
                                console.log(results[0]);
                                document.getElementById('order-total').innerText = results[0].orderTotal;
                                document.getElementById('product-names').innerText = results[0].productNames;
                            //} else {
                                //document.getElementById('order-total').innerText = 'Failed to retrieve the order total.';
                                //document.getElementById('product-names').innerText = 'Failed to retrieve product names.';
                            //}
                        }
                    );
                console.log(`Order Total Selector: ${matchingPage.orderTotalDataElementSelector}`);
                console.log(`Product Names: ${matchingPage.cartSelectors.productTitleSelector}`);
            } else {
                console.log('No matching path found.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
    })
    