//Colton Morley Sept 2023

//Global variables to store calculator info
let input = "";
let memory = [];
let backPressedCount = 0;
let storedAnswer = NaN;

//Update calculator display to 'str'
function updateDisplay(str) {
    let disp = document.querySelector("#display");
    if(str != undefined){
    updatedSymbols = str.replace("*", '&times');
    }
    disp.innerHTML = updatedSymbols;
}

//Clear all characters on display
function clearDisplay() {
    let disp = document.querySelector("#display");
    disp.textContent = "";
    input = "";
    backPressedCount = 0;
}

//Add user input to display based on button/key pressed
function getInput(num) {
    if(needStored(num)) input = storedAnswer;
    if (input.length >= 9){
        alertDisplayLimit();
         return;}
    input = input + num;
    updateDisplay(input);
    backPressedCount = 0;
}

//Special function to handle decimal input so that only one decimal may be entered
function getInputDecimal() {
    if (input.includes('.')) return;
    input = input + '.';
    updateDisplay(input);
    backPressedCount = 0;
}

//Remove the most recently entered character
function undo() {
    input = input.slice(0, input.length - 1)
    updateDisplay(input);
}

//Get previously entered strings stored in memory array
function back() {
    input = memory[memory.length - backPressedCount - 1];
    updateDisplay(input);
    backPressedCount++;
}

//Function for enter key
//Save string to memory array, evaluate expression
//Save result so user doesn't have to reenter result to continue calculating
function enter() {
    backPressedCount = 0;
    memory.push(input);
    if (memory.length > 5) memory = memory.slice(1, memory.length - 1);
    result = evaluate(input);
    //Round to 2 to make display cleaner 
    storedAnswer = customRound(result);
    updateDisplay(result);
    input = "";
}

//divide by 0 catch

//Evaluate math expression stored in str
function evaluate(str) {
    str = str.replace(/[^-()\d/*+.]/g, '');
    try {
        str = eval(str);
    } catch (e) {
        if (e instanceof SyntaxError) {
            str = "ERROR"
        }
    }
    if (str != "ERROR" && !isFinite(str)) str = "58008";
    str = str.toString();
    return str.slice(0, 9);
}

//Add keyboard support for numbers and oeprators
document.addEventListener('keyup', function (event) {
    if (isFinite(event.key) ||
        event.key == '+' ||
        event.key == '-' ||
        event.key == '/') {
        getInput(event.key);
    };
});

//Check if user pressed operator button first
//If so use previous result as first operanc
function needStored(keyPressed) {
    if (input.length == 0) {
        if (keyPressed == '+' ||
            keyPressed == '-' ||
            keyPressed == '/' ||
            keyPressed == '*') return true;
    };
    return false;
}

//When using stored result only, rounding to 2 decimals eliminates display limit woes on irrational numbers
function customRound(str){
    num = Number(str);
    num = Math.round((num + Number.EPSILON) * 100) / 100;
    return num.toString();
}


//Display input limit message for 1.5 seconds below calcultor
function alertDisplayLimit(){
    let message = document.getElementById('limit');
    message.style.display = "block";
    setTimeout(function() { message.style.display = "none"; }, 1500);
}