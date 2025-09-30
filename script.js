// Elementos do DOM
const displaySecondaryEl = document.getElementById('displaySecondary');
const displayPrimaryEl = document.getElementById('displayPrimary');
const clearBtnEl = document.getElementById('clearBtn');
const deleteBtnEl = document.getElementById('deleteBtn');
const percentBtnEl = document.getElementById('percentBtn');
const divideBtnEl = document.getElementById('divideBtn');
const btnnumberEl = document.querySelectorAll('.btn-number')
const multiplyBtnEl = document.getElementById('multiplyBtn');
const subtractBtnEl = document.getElementById('subtractBtn');
const addBtnEl = document.getElementById('addBtn');
const toggleSignBtnEl = document.getElementById('toggleSignBtn');
const decimalBtnEl = document.getElementById('decimalBtn');
const equalsBtnEl = document.getElementById('equalsBtn');
const clearHistoryBtnEl = document.getElementById('clearHistoryBtn');
const historyContentEl = document.getElementById('historyContent');

// Variáveis de estado da calculadora
let currentOperand = '';
let previousOperand = '';
let operation = undefined;
let isResultDisplayed = false;
let lastOperand = '';
let lastOperation = '';
const history = [];


// Função para formatar os números do display
function formatNumberForDisplay(numberString) {
    numberString = numberString.toString();
    let formattedNumber;

    if (numberString.endsWith('.')){
        const wholePart = numberString.slice(0, -1);
        const formattedWholePart = parseFloat(wholePart).toLocaleString('pt-BR');

        formattedNumber = formattedWholePart + ',';
    }else{
        if(numberString.includes('.')){
            const parts = numberString.split('.')
            const  integerPartFormatted = parseFloat(parts[0]).toLocaleString('pt-BR');
            const decimalPartString = parts[1];
            return  integerPartFormatted + ',' + decimalPartString;    
        }
    const number = parseFloat(numberString);
    if (!Number.isFinite(number)) {
        return numberString;
    }
    formattedNumber = number.toLocaleString('pt-BR');
    }

    return formattedNumber;
}

//Ajusta o tamanho da fonte
function adjustFontSize(){
    const textLength = displayPrimaryEl.textContent.length;
    if(textLength > 15){
        displayPrimaryEl.style.fontSize = '1.5em';
    }else if(textLength > 12){
        displayPrimaryEl.style.fontSize = '1.9em';
    }else if(textLength > 10){
        displayPrimaryEl.style.fontSize = '2em';
    }else{
        displayPrimaryEl.style.fontSize = '2.2em';
    }
}

// Função para atualizar os displays
function updateDisplay() {
    displayPrimaryEl.textContent = formatNumberForDisplay(currentOperand) || formatNumberForDisplay(previousOperand) || '0';
    displaySecondaryEl.textContent = operation ? `${formatNumberForDisplay(previousOperand)} ${operation}` : '';
    adjustFontSize();
}

// Atualiza a exibição do histórico
function updateHistory() {
    historyContentEl.innerHTML = history.map(item => `<div>${item}</div>`).join('');
}

// Limpa o histórico
function clearHistory() {
    history.length = 0;
    historyContentEl.innerHTML = '<span>Nenhum cálculo ainda</span>';
}

// Adiciona um número ao operando atual
function appendNumber(number) {
    if(currentOperand.length >= 16) return;
    if (isResultDisplayed) {
        currentOperand = number;
        isResultDisplayed = false;
    }else if(currentOperand === 'Indefinido' || currentOperand === 'Erro' || currentOperand === '0') {
        currentOperand = number;
    }else {
        currentOperand += number;
    }

    updateDisplay();
}

// Adiciona o ponto decimal
function appendDecimal() {
    if (isResultDisplayed) {
        currentOperand = '0.';
        isResultDisplayed = false;
    } else if (!currentOperand.includes('.')) {
        currentOperand = currentOperand === '' ? '0.' : currentOperand + '.';
    }

    updateDisplay();
}

// Altera o sinal do número
function toggleSign() {
    isResultDisplayed = true;
    currentOperand = (currentOperand * -1).toString();
    updateDisplay();
}

// Calcula o percentual
function calculatePercent() {
    isResultDisplayed = true;
    currentOperand = currentOperand / 100;
    updateDisplay();
}

// Deleta o último caractere
function deleteDigit() {
    let newOperand = currentOperand.slice(0, -1);
    if(newOperand === '' || newOperand === '-'){
        currentOperand = '0';
    }else{
        currentOperand = newOperand;
    }
    updateDisplay();
}

// Limpa todos os dados da calculadora
function clear() {
    currentOperand = '';
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

// Escolhe a operação
function chooseOperation(operator) {
    if(previousOperand === '' && currentOperand === '') return;

    if (currentOperand === '' && previousOperand !== '') {
        operation = operator;
        updateDisplay();
        return;
    }

    if (previousOperand !== '') {
        calculate();
    }

    previousOperand = currentOperand;
    operation = operator;
    currentOperand = '';
    isResultDisplayed = false;
    updateDisplay();
}

// Executa o cálculo
function calculate() {
    if(currentOperand === ''){
        currentOperand = previousOperand;
    }
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    let result;

    switch (operation) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case 'x': result = prev * current; break;
        case '÷':
            if (prev === 0 && current === 0) {
                currentOperand = 'Indefinido';
                previousOperand = '';
                operation = undefined;
                updateDisplay();
                return;
            } else if (current === 0) {
                currentOperand = 'Erro';
                previousOperand = '';
                operation = undefined;
                updateDisplay();
                return;
            }
            result = prev / current;
            break;
    }
    
    result = parseFloat(result.toFixed(10));

    // Adiciona a operação ao histórico
    history.push(`${formatNumberForDisplay(previousOperand)} ${operation} ${formatNumberForDisplay(currentOperand)} = ${formatNumberForDisplay(result)}`);
    updateHistory();

    currentOperand = result.toString();
    isResultDisplayed = true;
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

// // Decide se calcula ou repete a última operação
function handleEqualsLogic (){
     if(previousOperand !== '' && currentOperand === ''){
        currentOperand = previousOperand;
    }
    
    if (previousOperand !== '' && currentOperand !== '') {
        lastOperand = currentOperand;
        lastOperation = operation;
        calculate();
    } else if (lastOperand !== '' && lastOperation !== '') {
        let computation;
        switch (lastOperation) {
            case '+': computation = parseFloat(currentOperand) + parseFloat(lastOperand); break;
            case '-': computation = parseFloat(currentOperand) - parseFloat(lastOperand); break;
            case 'x': computation = parseFloat(currentOperand) * parseFloat(lastOperand); break;
            case '÷': computation = parseFloat(currentOperand) / parseFloat(lastOperand); break;
        }

        history.push(`${formatNumberForDisplay(currentOperand)} ${lastOperation} ${formatNumberForDisplay(lastOperand)} = ${formatNumberForDisplay(computation)}`);
        updateHistory();

        currentOperand = computation;
        isResultDisplayed = true;
        updateDisplay();
    }

}

// Listeners
btnnumberEl.forEach(button => {
    button.addEventListener('click', () => appendNumber(button.textContent));
});

addBtnEl.addEventListener('click', () => chooseOperation('+'));
subtractBtnEl.addEventListener('click', () => chooseOperation('-'));
multiplyBtnEl.addEventListener('click', () => chooseOperation('x'));
divideBtnEl.addEventListener('click', () => chooseOperation('÷'));

equalsBtnEl.addEventListener('click', handleEqualsLogic);
clearBtnEl.addEventListener('click', clear);
deleteBtnEl.addEventListener('click', deleteDigit);
percentBtnEl.addEventListener('click', calculatePercent);
toggleSignBtnEl.addEventListener('click', toggleSign);
decimalBtnEl.addEventListener('click', appendDecimal);
clearHistoryBtnEl.addEventListener('click', clearHistory);


// Mapeia teclas do teclado para funções da calculadora
document.addEventListener('keydown', (event) => {
    event.preventDefault();
    const numberKeys = '0123456789.';
    const keyMap = { '*': 'x', '/': '÷', ',': '.'}; 
    let key = keyMap[event.key] || event.key;

    if (numberKeys.includes(key)) {
        appendNumber(key);
    } else if ('+-x÷'.includes(key)) {
        chooseOperation(key);
    } else if (key === '=' || key === 'Enter') {
        handleEqualsLogic();
    } else if (key === 'Backspace') {
        deleteDigit();
    } else if (key === 'Delete') {
        clear();
    }
    updateDisplay();
});








