

document.addEventListener('DOMContentLoaded', function() {
    const terminal = document.getElementById('terminal');
    const commandInput = document.getElementById('commandInput');
    const closeBtn = document.getElementById('closebtn');
    const container = document.getElementById('container');
    

    closeBtn.addEventListener('click', function() {
        container.style.display = 'none';
    });

    // Function to add output to terminal
    function addToTerminal(output, className = '') {
        const outputDiv = document.createElement('div');
        outputDiv.textContent = output;
        if (className !== '') {
            outputDiv.classList.add(className);
        }
        terminal.appendChild(outputDiv);
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Function to process commands
    function processCommand(input) {
        addToTerminal('$ ' + input, 'input-line');
        
        // Example command: store data locally
        if (input.startsWith('store ')) {
            const data = input.substring(6); // Assuming 'store ' is the prefix
            localStorage.setItem('storedData', data);
            addToTerminal('Data stored locally: ' + data);
        }
        // Example command: retrieve data
        else if (input === 'retrieve') {
            const storedData = localStorage.getItem('storedData');
            if (storedData) {
                addToTerminal('Retrieved data: ' + storedData);
            } else {
                addToTerminal('No data stored locally.');
            }
        }
        
        else if (input.startsWith('saveas ')) {
            const fileName = input.substring(7); // Assuming 'saveas ' is the prefix
            const dataToSave = terminal.textContent; // Get all terminal content

            // Create a blob with the data
            const blob = new Blob([dataToSave], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            // Create a link element and click it programmatically to trigger download
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);

            addToTerminal(`File "${fileName}" saved.`);
        }

        else if(input.startsWith('print ')) {
            const parts = input.split(' ');
            if(parts.length === 3) {
                const message = parts[1];
                const count = parseInt(parts[2], 10);
                if(!isNaN(count)){
                    for(let i = 0; i < count; i++){
                        addToTerminal(message);
                    }
                }
            }
        }
        else if(input === 'clear') {
            terminal.innerHTML = '';
        }
        // Add more commands as needed
        else {
            addToTerminal('Command not recognized.');
        }
    }


    // Event listener for input
    commandInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const input = commandInput.value.trim();
            if (input !== '') {
                processCommand(input);
                commandInput.value = '';
            }
        }
    });

});