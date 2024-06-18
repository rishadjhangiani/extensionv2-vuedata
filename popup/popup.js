document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', handleFileUpload);
});

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonContent = JSON.parse(e.target.result);
                storeInMap(jsonContent);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
            }
        };
        reader.readAsText(file);
    } else {
        console.error('Please upload a valid JSON file.');
    }
}

function storeInMap(jsonContent) {
    const dataMap = new Map(Object.entries(jsonContent));
    console.log('Data stored in map:', dataMap);
}
