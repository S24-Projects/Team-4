// Define the questions and options
const questions = [
    { question: "Rank your primary objectives for your investment portfolio?", options: ["Retirement Savings", "Wealth Accumulation", "Specific Purchase"] },
    { question: "Specify Your timeline", options: ["> 5 Years", " ~ 1 Year", "< 1 Year", " < 3 Months"] },
    { question: "Which of these accounts do you contribute to most", options: ["401K", "Roth IRA", "Self Directed Brokerage Account"] },
    { question: "What is your income range?", options: ["$200K+", "~$100k", "< $100k", "< $50K"] },
    { question: "Which of the following assets and investments do you have?", options: ["Savings Acounts", "Stocks", "Bonds", "Real Estate"]} ,
    { question: "How would you describe your investment knowledge?", options: ["Very inexperienced", "Somewhat inexperienced", "Somewhat experienced", "Experienced", "Very experienced"]}
];
let currentQuestionIndex = 0;
let selections = Array(questions.length).fill(null); // Array to store user selections

function renderQuestion() {

    const nextButton = document.querySelector('.button2');

    const currentQuestion = questions[currentQuestionIndex];
    document.querySelector('.question').textContent = currentQuestion.question;
    document.getElementById('questionNumber').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = questions.length;

    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = ''; // Clear previous options

    currentQuestion.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'option-label';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'question';
        input.value = option;
        input.id = 'option' + index;
        input.checked = (selections[currentQuestionIndex] === option); // Check if this option was selected before
        
        label.appendChild(input);
        label.htmlFor = input.id; // Ensure the label corresponds to the input
        
        const optionText = document.createTextNode(option);
        label.appendChild(optionText);
        
        optionsContainer.appendChild(label);

        //add if last question
        if (currentQuestionIndex === questions.length - 1) {
            nextButton.style.display = "none";
            if (!document.querySelector('.special-button')) {
                const specialButton = document.createElement('button');
                specialButton.textContent = 'Submit'; // 
                specialButton.className = 'special-button'; // styling
                specialButton.type = 'button';
                specialButton.addEventListener('click', function() {
                    
                });
    
                // add the button to the buttons container
                document.querySelector('.buttons').appendChild(specialButton);
            }
        } else {
            const specialButton = document.querySelector('.special-button');

            nextButton.style.display = "inline-block";
            if (specialButton) {
                specialButton.remove();
            }
        }
    });
}

function saveSelection() {
    const options = document.getElementsByName('question');
    for (const option of options) {
        if (option.checked) {
            selections[currentQuestionIndex] = option.value;
            break;
        }
    }
}

function goBack() {
    if (currentQuestionIndex > 0) {
        saveSelection(); // Save the selection before going back
        currentQuestionIndex--;
        renderQuestion();
    }
}

function goNext() {
    saveSelection(); // Save the selection before going next
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}



document.addEventListener('DOMContentLoaded', () => {
    renderQuestion();
    document.querySelector('.button1').addEventListener('click', goBack);
    document.querySelector('.button2').addEventListener('click', goNext);
});