document.getElementById('datapackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const namespace = document.getElementById('namespace').value.trim();
    const functionName = document.getElementById('functionName').value.trim();
    const functionCode = document.getElementById('functionCode').value.trim();
    
    if (!namespace || !functionName || !functionCode) {
        alert('Please fill in all fields.');
        return;
    }
    
    const zip = new JSZip();
    const path = `${namespace}/functions/${functionName}.mcfunction`;
    zip.file(path, functionCode);
    
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        const link = document.getElementById('downloadLink');
        link.href = URL.createObjectURL(content);
        link.download = `${namespace}.zip`;
        link.style.display = 'block';
        link.textContent = 'Download Datapack';
    });
});
