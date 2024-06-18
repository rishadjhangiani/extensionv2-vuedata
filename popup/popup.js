document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    
    let form = document.getElementById("upload");
    let file = document.getElementById("file");
    let output = document.getElementById("output");

    function logFile (event) {
        let str = event.target.result;
        let json = JSON.parse(str);
        console.log('string', str);
        console.log('json', json);

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
});

