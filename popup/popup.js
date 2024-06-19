document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    
    let form = document.getElementById("upload");
    let file = document.getElementById("file");
    let output = document.getElementById("output");

    const xhr = new XMLHttpRequest();
xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
xhr.send();
xhr.responseType = "json";
xhr.onload = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    console.log("api!");
    console.log(xhr.response);
  } else {
    console.log(`Error: ${xhr.status}`);
  }
};


    /*function logFile (event) {
        let str = event.target.result;
        let json = JSON.parse(str);
        let result = JSON.stringify(json, null, 2);
        console.log('string', str);
        console.log('json', json);
        console.log('json one', result);
        for(var key in json){
            console.log(key + ' is ' + result[key]);
        }

        output.textContent = JSON.stringify(json, null, 2);
    }

    function handleSubmit (event) {
        event.preventDefault();
        if (!file.value.length) return;
        let reader = new FileReader();
        reader.onload = logFile;
        reader.readAsText(file.files[0]);
    }

    form.addEventListener('submit', handleSubmit);
    */
});

