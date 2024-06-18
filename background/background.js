/*fetch('https://www.bing.com/api/shopping/v1/telemetry')
    .then(response => {
        if (!response.ok) {
            throw new Error("network didn't work");
        }
        return response.json();
    })
    .then(data => {
        console.log("data received: ", data);
    })
    .catch(error => {
        console.error("problem with fetch:", error);
    });*/


chrome.webRequest.onCompleted.addListener (
    function(details) {
        chrome.scripting.executeScript(
            {
                target: {tabId: details.tabId},
                function: extractData,
                args: [details.url]
            },
            (results) => {
                console.log("hi");
                if (results && results[0] && results[0].result) {
                    console.log(results[0].result);
                    chrome.storage.local.set({productData: results[0].result});
                }
            }
        );
    },
    {urls: ["<all_urls>"]}
);

function extractData(requestUrl) {
    let data = {};
    if (requestUrl.includes("https://carts.target.com/web_checkouts/v1/cart_views?cart_type=REGULAR&field_groups=ADDRESSES%2CCART%2CCART_ITEMS%2CPAYMENT_INSTRUCTIONS%2CPICKUP_INSTRUCTIONS%2CPROMOTION_CODES%2CSUMMARY%2CFINANCE_PROVIDERS&key=e59ce3b531b2c39afb2e2b8a71ff10113aac2a14&client_feature=cart") || requestUrl.includes("cart")) {
        console.log("checkout");
        let products = [];
        /*document.querySelectorAll('.product-name').forEach(item => {
            products.push(item.innerText);
        });*/
        let totalPriceELement = document.querySelector('[data-test="cart-summary-total"]');
        let totalPrice = totalPriceElement ? totalPriceELement.innerText : null;

        data = {
            url: requestUrl,
            products: products,
            totalPrice: totalPrice
        };
    }
    return data;
}

