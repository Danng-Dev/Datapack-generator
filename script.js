document.addEventListener('DOMContentLoaded', function () {
    const namespaceStep = document.getElementById('namespaceStep');
    const functionNameStep = document.getElementById('functionNameStep');
    const functionCodeStep = document.getElementById('functionCodeStep');
    const optionalFunctionsStep = document.getElementById('optionalFunctionsStep');
    const downloadLink = document.getElementById('downloadLink');
    
    document.getElementById('nextToFunctionName').addEventListener('click', function () {
        const namespace = document.getElementById('namespace').value.trim();
        if (namespace) {
            localStorage.setItem('namespace', namespace);
            namespaceStep.style.display = 'none';
            functionNameStep.style.display = 'block';
        } else {
            alert('Please enter a namespace.');
        }
    });

    document.getElementById('nextToFunctionCode').addEventListener('click', function () {
        const functionName = document.getElementById('functionName').value.trim();
        if (functionName) {
            localStorage.setItem('functionName', functionName);
            functionNameStep.style.display = 'none';
            functionCodeStep.style.display = 'block';
        } else {
            alert('Please enter a function name.');
        }
    });

    document.getElementById('nextToOptionalFunctions').addEventListener('click', function () {
        const functionCode = document.getElementById('functionCode').value.trim();
        if (functionCode) {
            localStorage.setItem('functionCode', functionCode);
            functionCodeStep.style.display = 'none';
            optionalFunctionsStep.style.display = 'block';
            hljs.highlightBlock(document.getElementById('functionCode'));
        } else {
            alert('Please enter function code.');
        }
    });

    document.getElementById('generateDatapack').addEventListener('click', function () {
        const namespace = localStorage.getItem('namespace');
        const functionName = localStorage.getItem('functionName');
        const functionCode = localStorage.getItem('functionCode');
        const loadFunction = document.getElementById('loadFunction').value.trim();
        const tickFunction = document.getElementById('tickFunction').value.trim();

        const zip = new JSZip();
        const dataFolder = zip.folder('data');
        const namespaceFolder = dataFolder.folder(namespace);
        const functionsFolder = namespaceFolder.folder('functions');

        // Create the function file
        functionsFolder.file(`${functionName}.mcfunction`, functionCode);

        // Create the pack.mcmeta file
        zip.file('pack.mcmeta', JSON.stringify({
            pack: {
                pack_format: 48,
                description: "Generated Datapack"
            }
        }, null, 2));

        // Create the load.json and tick.json files if provided
        if (loadFunction) {
            const tagsFolder = namespaceFolder.folder('tags').folder('functions');
            tagsFolder.file('load.json', JSON.stringify({
                values: [`${namespace}:${loadFunction}`]
            }, null, 2));
        }

        if (tickFunction) {
            const tagsFolder = namespaceFolder.folder('tags').folder('functions');
            tagsFolder.file('tick.json', JSON.stringify({
                values: [`${namespace}:${tickFunction}`]
            }, null, 2));
        }

        // Generate the zip file
        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                downloadLink.href = URL.createObjectURL(content);
                downloadLink.download = `${namespace}.zip`;
                downloadLink.style.display = 'block';
                downloadLink.textContent = 'Download Datapack';
            });
    });

    // Populate fields with stored data if available
    if (localStorage.getItem('namespace')) {
        document.getElementById('namespace').value = localStorage.getItem('namespace');
    }
    if (localStorage.getItem('functionName')) {
        document.getElementById('functionName').value = localStorage.getItem('functionName');
    }
    if (localStorage.getItem('functionCode')) {
        document.getElementById('functionCode').value = localStorage.getItem('functionCode');
        hljs.highlightBlock(document.getElementById('functionCode'));
    }
});
