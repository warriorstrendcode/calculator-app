let history = [];
let recognition;

function appendToDisplay(value) {
    document.getElementById('display').value += value;
    adjustDisplayFontSize();
}

function clearDisplay() {
    document.getElementById('display').value = '';
    adjustDisplayFontSize();
}

function calculate() {
    try {
        const expression = document.getElementById('display').value;
        const result = eval(expression);
        document.getElementById('display').value = result;
        addToHistory(expression, result);
        adjustDisplayFontSize();
    } catch (error) {
        document.getElementById('display').value = 'Error';
    }
}

function addToHistory(expression, result) {
    history.unshift(`${expression} = ${result}`);
    if (history.length > 5) {
        history.pop();
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function adjustDisplayFontSize() {
    const display = document.getElementById('display');
    const container = document.getElementById('display-container');
    const maxWidth = container.offsetWidth - 20; // Subtracting padding
    let fontSize = 24; // Starting font size

    display.style.fontSize = fontSize + 'px';

    while (display.scrollWidth > maxWidth && fontSize > 10) {
        fontSize--;
        display.style.fontSize = fontSize + 'px';
    }
}

// Voice control
document.getElementById('start-voice').addEventListener('click', toggleVoiceControl);

function toggleVoiceControl() {
    if (recognition && recognition.running) {
        recognition.stop();
        document.getElementById('voice-status').textContent = 'Voice control is off';
        document.getElementById('start-voice').textContent = 'Start Voice Control';
    } else {
        startVoiceControl();
        document.getElementById('voice-status').textContent = 'Listening...';
        document.getElementById('start-voice').textContent = 'Stop Voice Control';
    }
}

function startVoiceControl() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = function(event) {
            const result = event.results[event.results.length - 1];
            if (result.isFinal) {
                const transcript = result[0].transcript.trim().toLowerCase();
                processVoiceCommand(transcript);
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            document.getElementById('voice-status').textContent = 'Error: ' + event.error;
        };

        recognition.start();
    } else {
        alert('Your browser does not support speech recognition. Try using Chrome.');
    }
}

function processVoiceCommand(command) {
    if (command.includes('clear')) {
        clearDisplay();
    } else if (command.includes('calculate') || command.includes('equals')) {
        calculate();
    } else {
        const numbers = command.match(/\d+/g);
        if (numbers) {
            numbers.forEach(num => appendToDisplay(num));
        }
        if (command.includes('plus')) appendToDisplay('+');
        if (command.includes('minus')) appendToDisplay('-');
        if (command.includes('times')) appendToDisplay('*');
        if (command.includes('divided by')) appendToDisplay('/');
        if (command.includes('point')) appendToDisplay('.');
    }
}

// Initial adjustment
window.addEventListener('load', adjustDisplayFontSize);
window.addEventListener('resize', adjustDisplayFontSize);
