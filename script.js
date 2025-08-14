/**
 * QuantumCalc Pro - Advanced Modern Calculator
 * Author: Sarajit Biswas
 * Version: 1.1.0
 * Date: 14th aug, 2025
 * 
 * Features:
 * - Basic arithmetic operations
 * - Scientific functions (square, square root, power, inverse)
 * - Memory operations (MC, MR, M+, M-)
 * - Percentage calculation
 * - Sign change and backspace
 * - Dark/light mode toggle
 * - Keyboard support
 * - Responsive design
 * - Error handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const inputDisplay = document.getElementById('input');
    const historyDisplay = document.getElementById('history');
    const memoryIndicator = document.getElementById('memoryIndicator');
    const themeToggle = document.getElementById('themeToggle');
    const keys = document.querySelectorAll('.key');
    
    // Calculator state
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetInput = false;
    let memoryValue = 0;
    
    // Update display
    function updateDisplay() {
        inputDisplay.textContent = currentInput;
        historyDisplay.textContent = previousInput;
    }
    
    // Reset calculator
    function resetCalculator() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        shouldResetInput = false;
        updateDisplay();
    }
    
    // Append number to current input
    function appendNumber(number) {
        if (currentInput === '0' || shouldResetInput) {
            currentInput = number;
            shouldResetInput = false;
        } else if (currentInput.length < 12) { // Limit input length
            currentInput += number;
        }
        updateDisplay();
    }
    
    // Append decimal point
    function appendDecimal() {
        if (shouldResetInput) {
            currentInput = '0.';
            shouldResetInput = false;
            updateDisplay();
            return;
        }
        
        if (!currentInput.includes('.')) {
            currentInput += '.';
            updateDisplay();
        }
    }
    
    // Handle operator selection
    function selectOperator(nextOperation) {
        if (operation !== null && !shouldResetInput) {
            calculate();
        }
        
        const inputValue = parseFloat(currentInput);
        
        if (previousInput === '') {
            previousInput = `${inputValue} ${nextOperation}`;
        } else {
            previousInput = `${previousInput.split(' ')[0]} ${nextOperation}`;
        }
        
        operation = nextOperation;
        shouldResetInput = true;
        updateDisplay();
    }
    
    // Perform calculation
    function calculate() {
        if (operation === null || shouldResetInput) return;
        
        const prevValue = parseFloat(previousInput.split(' ')[0]);
        const currentValue = parseFloat(currentInput);
        let result;
        
        switch (operation) {
            case '+':
                result = prevValue + currentValue;
                break;
            case '-':
                result = prevValue - currentValue;
                break;
            case '*':
                result = prevValue * currentValue;
                break;
            case '/':
                if (currentValue === 0) {
                    currentInput = 'Error';
                    previousInput = '';
                    operation = null;
                    shouldResetInput = true;
                    updateDisplay();
                    return;
                }
                result = prevValue / currentValue;
                break;
            case '^':
                result = Math.pow(prevValue, currentValue);
                break;
            default:
                return;
        }
        
        // Handle special cases
        if (result === Infinity || isNaN(result)) {
            currentInput = 'Error';
        } else {
            // Format result to avoid long decimal fractions
            result = Math.round(result * 1000000) / 1000000;
            currentInput = result.toString();
        }
        
        previousInput = '';
        operation = null;
        shouldResetInput = true;
        updateDisplay();
    }
    
    // Handle special functions
    function handleSpecialFunction(action) {
        const value = parseFloat(currentInput);
        
        switch (action) {
            case 'square':
                currentInput = (value * value).toString();
                break;
            case 'sqrt':
                if (value < 0) {
                    currentInput = 'Error';
                } else {
                    currentInput = Math.sqrt(value).toString();
                }
                break;
            case 'percentage':
                currentInput = (value / 100).toString();
                break;
            case 'sign':
                currentInput = (value * -1).toString();
                break;
            case 'inverse':
                if (value === 0) {
                    currentInput = 'Error';
                } else {
                    currentInput = (1 / value).toString();
                }
                break;
            case 'power':
                previousInput = `${currentInput} ^`;
                operation = '^';
                shouldResetInput = true;
                break;
            case 'backspace':
                if (currentInput.length === 1 || 
                    (currentInput.length === 2 && currentInput.startsWith('-'))) {
                    currentInput = '0';
                } else {
                    currentInput = currentInput.slice(0, -1);
                }
                break;
            case 'clear':
                resetCalculator();
                break;
            case 'mc': // Memory Clear
                memoryValue = 0;
                memoryIndicator.classList.remove('active');
                break;
            case 'mr': // Memory Recall
                currentInput = memoryValue.toString();
                shouldResetInput = true;
                break;
            case 'm+': // Memory Add
                memoryValue += parseFloat(currentInput);
                memoryIndicator.classList.add('active');
                break;
            case 'm-': // Memory Subtract
                memoryValue -= parseFloat(currentInput);
                memoryIndicator.classList.add('active');
                if (memoryValue === 0) {
                    memoryIndicator.classList.remove('active');
                }
                break;
        }
        
        updateDisplay();
    }
    
    // Handle key clicks
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const action = key.getAttribute('data-action');
            const number = key.getAttribute('data-number');
            
            if (number !== null) {
                appendNumber(number);
            } else if (action === '.') {
                appendDecimal();
            } else if (action === '=') {
                calculate();
            } else if (['+', '-', '*', '/'].includes(action)) {
                selectOperator(action);
            } else {
                handleSpecialFunction(action);
            }
        });
    });
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const icon = themeToggle.querySelector('i');
        
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', event => {
        if (/[0-9]/.test(event.key)) {
            appendNumber(event.key);
        } else if (event.key === '.') {
            appendDecimal();
        } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
            selectOperator(event.key);
        } else if (event.key === 'Enter' || event.key === '=') {
            calculate();
        } else if (event.key === 'Escape') {
            resetCalculator();
        } else if (event.key === 'Backspace') {
            handleSpecialFunction('backspace');
        } else if (event.key === '%') {
            handleSpecialFunction('percentage');
        }
    });
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
    }
    
    // Initialize calculator
    updateDisplay();
});