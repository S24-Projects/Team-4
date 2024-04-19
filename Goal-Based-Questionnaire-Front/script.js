// Define the questions and options
const questions = [
    { question: "Rank your primary objectives for your investment portfolio?", options: ["Retirement Savings", "Wealth Accumulation", "Specific Purchase"] },
    { question: "Specify Your timeline", options: ["> 5 Years", " ~ 1 Year", "< 1 Year", " < 3 Months"] },
    { question: "Which of these accounts do you contribute to most", options: ["401K", "Roth IRA", "Self Directed Brokerage Account"] },
    { question: "What is your income range?", options: ["$200K+", "~$100k", "< $100k", "< $50K"] },
    { question: "Which of the following assets and investments do you have?", options: ["Savings Accounts", "Stocks", "Bonds", "Real Estate"]} ,
    { question: "How would you describe your investment knowledge?", options: ["Very inexperienced", "Somewhat inexperienced", "Somewhat experienced", "Experienced", "Very experienced"]}
];
let currentQuestionIndex = 0;
let selections = Array(questions.length).fill(null);

document.addEventListener('DOMContentLoaded', () => {
    renderQuestion();
    document.querySelector('.button1').addEventListener('click', goBack);
    document.querySelector('.button2').addEventListener('click', goNext);
});

function renderQuestion() {
    const nextButton = document.querySelector('.button2');
    const backButton = document.querySelector('.button1');  // Reference to the back button
    const currentQuestion = questions[currentQuestionIndex];

    document.querySelector('.question').textContent = currentQuestion.question;
    document.getElementById('questionNumber').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = questions.length;

    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = ''; // Clear previous options

    // Manage the visibility of the back button
    if (currentQuestionIndex === 0) {
        backButton.classList.add('hidden-but-occupying-space');  // Make back button invisible but keep its space
    } else {
        backButton.classList.remove('hidden-but-occupying-space');  // Ensure the back button is visible and takes space
    }

    if (currentQuestionIndex === 0) {
        const list = document.createElement('ul');
        list.className = 'sortable-list';

        let optionsToRender = selections[currentQuestionIndex] ? selections[currentQuestionIndex] : currentQuestion.options;

        optionsToRender.forEach(option => {
            const li = document.createElement('li');
            li.className = 'item';
            li.draggable = true;
            li.innerHTML = `<div class="details"><span>${option}</span></div><i class="uil uil-draggabledots"></i>`;
            list.appendChild(li);
        });

        optionsContainer.appendChild(list);
        initializeDragAndDrop();
    } else {
        currentQuestion.options.forEach((option, index) => {
            const label = document.createElement('label');
            label.className = 'option-label';
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'question';
            input.value = option;
            input.id = 'option' + index;
            input.checked = (selections[currentQuestionIndex] === option);
            label.appendChild(input);
            label.htmlFor = input.id;
            const optionText = document.createTextNode(option);
            label.appendChild(optionText);
            optionsContainer.appendChild(label);
        });
    }

    updateProgressBar();

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.style.display = "none";
        const specialButton = document.querySelector('.special-button') || document.createElement('button');
        if (!document.querySelector('.special-button')) {
            specialButton.textContent = 'Submit';
            specialButton.className = 'special-button';
            specialButton.type = 'button';
            specialButton.addEventListener('click', submitSurvey);
            document.querySelector('.buttons').appendChild(specialButton);
        }
    } else {
        nextButton.style.display = "inline-block";
        const specialButton = document.querySelector('.special-button');
        if (specialButton) {
            specialButton.remove();
        }
    }
}


function initializeDragAndDrop() {
    const sortableList = document.querySelector(".sortable-list");
    const items = sortableList.querySelectorAll(".item");
    items.forEach(item => {
        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", null); // Required for Firefox
            item.classList.add("dragging");
        });
        item.addEventListener("dragend", () => {
            item.classList.remove("dragging");
        });
    });

    sortableList.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(sortableList, e.clientY);
        const draggable = document.querySelector(".dragging");

        if (afterElement == null) {
            sortableList.appendChild(draggable);
        } else {
            sortableList.insertBefore(draggable, afterElement);
        }
    });
}


function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".item:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveSelection() {
    console.log("Saving selection for question index: ", currentQuestionIndex);
    if (currentQuestionIndex === 0) {
        const listItems = document.querySelectorAll('.sortable-list .item');
        selections[currentQuestionIndex] = Array.from(listItems).map(item => item.querySelector('span').textContent.trim());
        console.log("Saved drag-and-drop selections: ", selections[currentQuestionIndex]);
    } else {
        const options = document.getElementsByName('question');
        for (const option of options) {
            if (option.checked) {
                selections[currentQuestionIndex] = option.value;
                console.log("Saved radio selection: ", selections[currentQuestionIndex]);
                break;
            }
        }
    }
}



function goBack() {
    if (currentQuestionIndex > 0) {
        saveSelection();
        currentQuestionIndex--;
        renderQuestion();
    }
}

function goNext() {
    saveSelection();
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progressPercentage + '%';
}

function submitSurvey() {
    saveSelection(); // Save the last selection before submitting the form.
    console.log("Survey submitted with selections:", selections);
    // Implement your actual submission logic here.
    // For example, you might send the data to a server using fetch API or similar.
}

