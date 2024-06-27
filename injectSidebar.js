(function() {
  let sidebar = document.getElementById("mySidebar");
  if (sidebar) {
    sidebar.remove();
    document.body.style.marginRight = '0';  
  } else {
    sidebar = document.createElement("div");
    sidebar.id = "mySidebar";
    sidebar.style.cssText = "position:fixed;top:0;right:0;width:300px;height:100%;background:#fff;z-index:1000;box-shadow:-2px 0 5px rgba(0,0,0,0.5);";
    document.body.style.marginRight = '300px';  
    document.body.appendChild(sidebar);

    fetch(chrome.runtime.getURL("sidebar.html"))
      .then(response => response.text())
      .then(data => {
        sidebar.innerHTML = data;
        let style = document.createElement("link");
        style.rel = "stylesheet";
        style.href = chrome.runtime.getURL("sidebar.css");
        document.head.appendChild(style);
        let script = document.createElement("script");
        script.src = chrome.runtime.getURL("sidebar.js");
        document.body.appendChild(script);
      });
  }
})();
