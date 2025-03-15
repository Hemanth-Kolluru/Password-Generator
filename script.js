const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[]}|\:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 7px 7px ${color}`;
}

function getRandomInteger(min,max)
{
    return Math.floor(Math.random() * (max-min + 1)) + min;
}

function generateRandomNumber()
{
    return String(getRandomInteger(0,9));
}

function getRandomLowerCase()
{
    return String.fromCharCode(getRandomInteger(97,122));
}

function getRandomUpperCase()
{
    return String.fromCharCode(getRandomInteger(65,90));
}

function generateSymbol()
{
    const randNum = getRandomInteger(0,symbols.length - 1);
    return symbols.charAt(randNum);
}

function calcStrength()
{
    let upper = false;
    let lower = false;
    let num = false;
    let symbol = false;
    if(uppercaseCheck.checked) upper=true;
    if(lowercaseCheck.checked) lower=true;
    if(numbersCheck.checked) num=true;
    if(symbolsCheck.checked) symbol = true;

    if(upper && lower && (num || symbol) && passwordLength >=8)
    {
        setIndicator("#2aff4d");
    }
    else if((upper || lower) && (num || symbol) && passwordLength >=6)
    {
        setIndicator("#ffc800");
    }
    else{
        setIndicator("#ff2b2b");
    }
}

async function copyContent()
{
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(
        () => { copyMsg.classList.remove("active");}
        , 2000
    );
}

function shufflePassword(array)
{
    //fisher yates method
    for(let i=array.length - 1;i>0;i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach(
        (temp) => { str += temp}
    );
    return str;
}

function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach(
        (checkbox) => {
            if(checkbox.checked) checkCount++;
        });
    
    if(passwordLength < checkCount) 
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(
    (checkbox) => {
        checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = Number(e.target.value);
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) copyContent();
})

generateBtn.addEventListener('click' , () => {
    if(checkCount <=0) return;
    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";
    let funcArr = [];
    if(uppercaseCheck.checked) funcArr.push(getRandomUpperCase);
    if(lowercaseCheck.checked) funcArr.push(getRandomLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) funcArr.push(generateSymbol);
    for(let i=0;i<funcArr.length;i++)
    {
        password += funcArr[i]();
    }
    for(let i=0;i<passwordLength - funcArr.length;i++)
    {
        let randIndex = getRandomInteger(0,funcArr.length - 1);
        password += funcArr[randIndex]();
    }
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
})
