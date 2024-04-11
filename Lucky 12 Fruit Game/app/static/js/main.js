
const fruits = ["banana","apple" ,"lemon", "mango", "guava", "papaya", "pineapple","tomato", "chillie","lychee", "orange", "kiwi"];
var selectedAmount = 0;
// Get the value displayed in the span element and parse it as an integer
var balance = parseInt(document.getElementById("balance-amount").textContent);

// Now you can use the variable balance in your JavaScript code
console.log("Balance:", balance);
// Assuming you have the username variable defined in your JavaScript code
var username = "nikhil";



console.log("balAnce", balance)
function refreshPage() {
    location.reload();
}

document.addEventListener("DOMContentLoaded", function() {

    var welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
        welcomeMessage.innerText = "Welcome, " + username;
    }

    // Update the username container
    var usernameContainer = document.getElementById("username-container");
    if (usernameContainer) {
        usernameContainer.innerText = "Username : " + username;
    }
});


const fruitNumberMapping = {};
fruits.forEach((fruit, index) => {
fruitNumberMapping[fruit] = index + 1; // Adding 1 to index to start numbering from 1
});
// Define the selectAmount function
function selectAmount(amount) {
selectedAmount = amount;
var selectedAmountElement = document.getElementById("selected-amount");
if (selectedAmountElement) {
    selectedAmountElement.innerText = amount;
} else {
    console.error("Element with ID 'selected-amount' not found.");
}
}

// Define and initialize the balance variable with a starting balance value


function getCookie(name) {
var cookieValue = null;
if (document.cookie && document.cookie !== '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Check if the cookie contains the CSRF token
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
}
return cookieValue;
}

// Update the balance amount in the balance container
function updateBalance() {
var balanceSpan = document.getElementById("balance-amount");
if (balanceSpan) {
    balanceSpan.innerText = balance;
    updateBalanceInDatabase(balance); // Update balance in the database
} else {
    console.error("Element with ID 'balance-amount' not found.");
}
}

// Update balance in the database
function updateBalanceInDatabase(newBalance) {
var csrftoken = getCookie('csrftoken');

$.ajax({
    url: '/update_balance/',
    type: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    data: { new_balance: newBalance },
    success: function (response) {
        console.log('Balance updated successfully in the database.');
    },
    error: function (xhr, status, error) {
        console.error('Error updating balance in the database:', error);
    }
});
}

// Call the updateBalance function to initialize the balance amount in the balance container
updateBalance();

function hideImages() {
var imageContainers = document.querySelectorAll('.gif-container img, .gif-container-2 img');
imageContainers.forEach(function(container) {
    container.style.display = 'none';
});
}

document.addEventListener("DOMContentLoaded", function () {
// Call the function to start the timer
startTimer();
});

var timeLeft = 30; // Initial time in seconds (30 seconds)

function startTimer() {
var timeLeftFromStorage = localStorage.getItem('timeLeft');
if (timeLeftFromStorage !== null) {
  timeLeft = parseInt(timeLeftFromStorage, 10);
  localStorage.removeItem('timeLeft'); // Clear the stored time after retrieval
}
var audio = new Audio('static/images/audio.wav');


var timerDisplay = document.getElementById('timer');

var countdownInterval = setInterval(function () {
    // Calculate minutes and seconds from timeLeft
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;

    // Display the time in minutes and seconds format
    timerDisplay.textContent = 'Time left: ' + minutes + ' : ' + seconds ;

    if (timeLeft <= 0) {
        clearInterval(countdownInterval); // Clear the interval if timeLeft is 0 or negative
        timerDisplay.textContent = 'Time\'s up!';
        console.log('Timer reached 0');
        
        
    setTimeout(function() {
            location.reload();
        }, 5000);   
        return;
    }

    timeLeft--;

    if (timeLeft === 0) {
        // Show the containers
        document.getElementById("container1").style.display = "block";
        document.getElementById("container2").style.display = "block";
        document.getElementById("container3").style.display = "block";
    
        // Hide the reels
        document.getElementById("reel1").style.display = "none";
        document.getElementById("reel2").style.display = "none";
        document.getElementById("reel3").style.display = "none";
    
        hideImages();
        updateGifSources();
    
        // Check if the time left is 2 seconds or less, then start spinning reels
        if (timeLeft <= 2) { // Change condition to 2 seconds or less
            spinReels();
            audio.play();
        }
    
        // Add this line to show the images after 4 seconds
        setTimeout(function() {
            document.getElementById("reel1").style.display = "block";
            document.getElementById("reel2").style.display = "block";
            document.getElementById("reel3").style.display = "block";
        }, 5000); // Change timeout to 4000 milliseconds
    }
    
}, 1000); // Update the timer every second
}

// Function to update the source of GIFs for both containers
function updateGifSources() {
    // Return the GIF path based on the index of the current time
    var index = 30 - timeLeft; // Assuming the timer starts at 30 seconds

    // Update the source of the first GIF
    document.getElementById("gifImage1").src = gifPaths[index % gifPaths.length];

    // Update the source of the second GIF
    document.getElementById("gifImage2").src = gifPaths[(index + 1) % gifPaths.length];

    document.getElementById("gifImage3").src = gifPaths[(index + 2) % gifPaths.length];
}

function generateAndOpenPDF() {
// Construct the ticket string using fruitNumberMapping and betQuantities
var ticketString = Object.keys(betQuantities).map(fruit => `${fruitNumberMapping[fruit]} x ${betQuantities[fruit]}`).join(', ');

// Check if the ticket string is empty
if (ticketString.trim() === '') {
    console.log('Ticket string is empty. No PDF will be generated.');
    return; // Exit the function if the ticket string is empty
}

// Define the ticket variable or retrieve it from the element if applicable
var ticket = ticketString; // Assign ticketString to the ticket variable

// Construct the URL for AJAX call
var url = '/generate_pdf/?user=' + username + '&fruit=' + placedFruits.join(',') + '&quantity=' + globalquantity + '&amount=' + globalNewAmount + '&ticket=' + ticket;

$.ajax({
    type: 'GET',
    url: url,
    xhrFields: {
        responseType: 'blob' // Set the response type to blob to handle binary data
    },
    success: function(response) {
        // PDF generated successfully, create a temporary anchor element to download the PDF
        var anchor = document.createElement('a');
        var blob = new Blob([response], { type: 'application/pdf' });
        var url = window.URL.createObjectURL(blob);
        anchor.href = url;
        anchor.download = 'ticket.pdf'; // Specify the file name for the downloaded PDF
        anchor.click(); // Programmatically click the anchor element to trigger the download
        window.URL.revokeObjectURL(url); 
        
        // Store remaining time in local storage
        localStorage.setItem('timeLeft', timeLeft);

        // Refresh the page after downloading the PDF, excluding the timer
        setTimeout(function() {
            location.reload();
        }, 1000); // Delay the reload for 1 second to ensure PDF download completes
    },
    error: function(xhr, status, error) {
        // Handle error
        console.error(error);
    }
});
}



var bettingData = []; // Array to accumulate betting data for each fruit
var betQuantities = {};
var placedFruits = [];
var username = "nikhil"; // Assuming this value is accessible
var globalNewAmount = 0;
var totalWinningAmount = 0;
var globalquantity = 0

function placeBet(element, betType) {

if (!selectedAmount) {
    selectedAmount = 10; // Set default amount to 10 if no amount is selected
}

var amountSpan = element.querySelector(".amount");
var currentAmount = parseInt(amountSpan.innerText);
var fruitName = element.querySelector("img").getAttribute("alt").toLowerCase();
var quantity = betQuantities[fruitName] || 0; // Retrieve the quantity from betQuantities



if (selectedAmount > 0 && selectedAmount <= balance) {
var newAmount = currentAmount + selectedAmount;

amountSpan.innerHTML = '<b style="font-size: 19px; margin-top:2px;">' + newAmount + '</b>'; // Adjust the font size as needed
amountSpan.style.display = 'block';

// Deduct the bet amount from the balance
balance -= selectedAmount;
console.log("New balance after deduction:", balance); // Log the new balance

// Log the placed bet information
if (betType) {
console.log("Placed a bet of " + selectedAmount + " on " + betType);
} else {
console.log("Placed a bet of " + selectedAmount + " on " + fruitName);
console.log("User:", username);
console.log("Amount:", newAmount);
console.log("Fruit:", fruitName);
}

// Update the balance amount in the balance container
updateBalance();

// Update the total amount
var totalAmountElement = document.getElementById("total-amount");
var currentTotalAmount = parseInt(totalAmountElement.innerText);
var updatedTotalAmount = currentTotalAmount + selectedAmount;
totalAmountElement.innerText = updatedTotalAmount;
console.log("Total Amount:", updatedTotalAmount);

// Update betQuantities with the selected amount
betQuantities[fruitName] = quantity + selectedAmount; // Add the new amount to the existing quantity
console.log("Updated Bet Quantities:", betQuantities);
var quantities = [];

// Iterate through the keys of betQuantities and push the values into quantities array
Object.keys(betQuantities).forEach(function (fruit) {
quantities.push(betQuantities[fruit]);
});

// Log the quantities array
console.log("Quantities:", quantities);

if (!placedFruits.includes(fruitName)) {
placedFruits.push(fruitName);
}

globalNewAmount = updatedTotalAmount;
globalquantity = quantities;
 
} else {
amountSpan.style.display = 'none';
}


}

function clearBets() {
// Clear bets from fruit images
var fruitItems = document.querySelectorAll(".fruit-item");
fruitItems.forEach(function (item) {
    var amountSpan = item.querySelector(".amount");
    var betAmount = parseInt(amountSpan.innerText);
    amountSpan.innerText = '0';
    amountSpan.style.display = 'none';

    // Add the cleared bet amount back to the balance
    balance += betAmount;
});

// Reset total amount to zero
var totalAmountElement = document.getElementById("total-amount");
totalAmountElement.innerText = '0';

// Clear the relevant data structures
betQuantities = {};
placedFruits = [];
globalNewAmount = 0;

console.log('betQuantities', betQuantities);
console.log('placedFruits',placedFruits);
// Update the balance amount in the balance container
updateBalance();
}


var hasSpunReels = false; // Define hasSpunReels and set it to false initially


var spinning = false;

setInterval(function () {
if (!spinning && (Object.keys(betQuantities).length > 0 || !hasSpunReels)) {
    spinReels();
    hasSpunReels = true; // Update flag to indicate reels have been spun
}
}, 180000);


var timerElement = document.getElementById("timer");
var currentIndexes = [0, 0, 0];
var bettingData = []; // Initialize bettingData array

let completedReels = 0; // Declare completedReels outside of the spinReels function
let winningMessages = []; // Define winningMessages array outside of the spinReels function

function spinReels() {

spinning = true; // Set spinning to true when spinReels starts

let winningFruit = null;
let lowerRowFruits = [];
let chosenFruit = getChosenFruit();
let totalWinningAmount = 0;
bettingData = [];

document.querySelectorAll('.right-container > .fruit-item:nth-child(n+6)').forEach((fruitItem) => {
    lowerRowFruits.push(fruitItem.querySelector('img').getAttribute('alt').toLowerCase());
});



function displayWinningMessage(message) {
    var winningModal = document.getElementById("winningModal");
    var winningMessageContent = document.getElementById("winningMessageContent");
    winningMessageContent.innerText = message;
    winningModal.style.display = "block";
}

// Function to close the winning message modal
function closeWinningModal() {
    var winningModal = document.getElementById("winningModal");
    winningModal.style.display = "none";
}
const reel1Symbols = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const reel2Symbols = ["banana", "apple", "lemon", "mango", "guava", "papaya", "pineapple", "tomato", "chillie", "lychee", "orange", "kiwi"];
const reel3Symbols = ["1times", "2times", "3times", "4times"];

const reels = [
    { reelElement: document.getElementById('reel1'), symbols: reel1Symbols },
    { reelElement: document.getElementById('reel2'), symbols: reel2Symbols },
    { reelElement: document.getElementById('reel3'), symbols: reel3Symbols }
];

const randomOffset = Math.floor(Math.random() * 11); // Generate a random offset between 0 and 10 (inclusive)
const initialIndex = randomOffset % reel1Symbols.length; // Starting index for reel1

reels.forEach((reel, index) => {
const interval = setInterval(() => {
    let newIndex;
    if (index === 2) {
        // For the third reel, introduce more randomness by using a combination of Math.random and Math.floor
        newIndex = Math.floor(Math.random() * reel.symbols.length);
    } else {
        // Use the same random offset for the first two reels
        newIndex = (initialIndex + currentIndexes[0]) % reel.symbols.length;
        currentIndexes[0] += 0; // Increment the current index for the first reel
    }
    const symbol = reel.symbols[newIndex];
    reel.reelElement.innerHTML = `<img src="{% static 'images/' %}${symbol}.png" alt="${symbol}">`;

    const fruitName = symbol.split('.')[0];
    if (fruits.includes(fruitName)) {
        winningFruit = fruitName;
    }
}, 200);


    setTimeout(() => {
        clearInterval(interval);

        completedReels++;
        if (completedReels === reels.length) {
            let winningMessage = 'Sorry, no winner this time. Try again!';
            for (const fruit in betQuantities) {
                if (betQuantities.hasOwnProperty(fruit) && fruit === winningFruit) {
                    totalWinningAmount += betQuantities[fruit];
                    winningMessage = `Congratulations! ${winningFruit} is the winner! \n You won ${totalWinningAmount} coins!`;
                    winningMessages.push(winningMessage);
                    break;
                }
            }

            displayWinningMessage(winningMessage);
            const fruitImageUrl = `static/images/${winningFruit}.png`; // Adjust the path as needed
            console.log('The winning fruit is: ', fruitImageUrl);


            console.log("Winning Fruit:", winningFruit);
            console.log("Inside Spin Reels");
            console.log("username:", username);
            console.log("ticket:", betQuantities);  // Original dictionary
            console.log("Amount:", globalNewAmount);
            var quantitiesArray = Object.values(betQuantities);
            var sum = quantitiesArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            console.log("Quantities:", sum);
            console.log("Placed Fruits:", placedFruits);
            var placedFruitsString = placedFruits.join(', ');
            console.log("Placed Fruits String:", placedFruitsString);
            console.log("Selected Amount:", selectedAmount); // Log the value of selectedAmount
            
            console.log("reel1 image URL:", document.getElementById('reel1')?.querySelector('img')?.src);
            console.log("reel3 image URL:", document.getElementById('reel3')?.querySelector('img')?.src);
            

            if (Object.keys(betQuantities).length > 0) {
                var quantitiesArray = Object.values(betQuantities);
                var sum = quantitiesArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                var placedFruitsString = placedFruits.join(', ');
                var ticketString = Object.keys(betQuantities).map(fruit => `${fruitNumberMapping[fruit]} x ${betQuantities[fruit]}`).join(', ');

                bettingData.push({
                    fruit: placedFruitsString,
                    quantity: sum,
                    amount: globalNewAmount,
                    ticket: ticketString
                });
               
                $.ajax({
                    url: '/place_bet/',
                    type: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    data: { betting_data: JSON.stringify(bettingData) },
                    success: function (response) {
                        console.log(response.message);
                        bettingData = [];
                        completedReels = 0;
                        spinning = false; // Set spinning to false after successful bet placement
                    },
                    error: function (xhr, status, error) {
                        console.error('Error placing bets:', error);
                    }
                });
            }
            const resultImageMapping = {
                banana: ["result1.png", "one.png"],
                apple: ["result2.png", "two.png"],
                lemon: ["result3.png", "three.png"],
                mango: ["result4.png", "four.png"],
                guava: ["result5.png", "five.png"],
                papaya: ["result6.png", "six.png"],
                pineapple: ["result7.png", "seven.png"],
                tomato: ["result8.png", "eight.png"],
                chillie: ["result9.png", "nine.png"],
                lychee: ["result10.png", "ten.png"],
                orange: ["result11.png", "eleven.png"],
                kiwi: ["result12.png", "twelve.png"] // Add more mappings as needed
            };
            function getNumImageUrl(fruitName) {
                if (resultImageMapping.hasOwnProperty(fruitName)) {
                    return `static/images/${resultImageMapping[fruitName][1]}`;
                } else {
                    return ""; // Return empty string if fruit name is not found in the mapping
                }
            }
            function getResultImageUrl(fruitName) {
                if (resultImageMapping.hasOwnProperty(fruitName)) {
                    return `static/images/${resultImageMapping[fruitName][0]}`;
                } else {
                    return ""; // Return empty string if fruit name is not found in the mapping
                }
            }

            const numImageUrl = getNumImageUrl(winningFruit); // Get numImageUrl for the specified fruit name
            console.log("numImageUrl:", numImageUrl);
            
            // Check if winningFruit is set correctly
            console.log('winningFruit:', winningFruit);
            
            // Check if resultImageMapping contains the correct mappings
            console.log('resultImageMapping:', resultImageMapping);
            
            
          
            const resultImageUrl = getResultImageUrl(winningFruit)

            console.log("resultImageUrl:", resultImageUrl);

            
            
            $.ajax({
                url: '/add_bet_result/',
                type: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
                data: {
                    user: "nikhil",
                    winning_fruit: winningFruit,
                    amount: totalWinningAmount,
                    result_image_url: resultImageUrl,
                    fruit_image_url: fruitImageUrl,
                    number_image_url: numImageUrl
                    // Add other data as needed
                },

            
                success: function (response) {
                    console.log(response.message);
                    if (winningMessages.length === reels.length) {
                        displayWinningMessage(winningMessages.join(' '));
                        updateBalanceInDatabase(newBalance);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error adding bet result:', error);
                }
            });
            
            
        } else {
            console.error('Image URLs are null or undefined.');
        }
        
        // Update the balance amount here
        var balanceElement = document.getElementById('balance-amount');
        console.log('balanceElement',balanceElement)

        var currentBalance = parseFloat(balanceElement.innerText);
        console.log('currentBalance',currentBalance)

        var newBalance = currentBalance + (totalWinningAmount );
        console.log('new_balance',newBalance)

        balanceElement.innerText = newBalance.toFixed(2);
        updateBalanceInDatabase(newBalance);
    }, 4000);
});
}

$(document).ready(function(){
// Initialize total winning amount
var totalWinningAmount = 0;
$(document).ready(function(){
    // Initialize total winning amount
    var totalWinningAmount = 0;
    $.ajax({
        url: '/fetch_history/',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            // Handle successful response
            if (response.bet_results.length > 0) {
                // Get the latest result item from the response
                var latestResultItem = response.bet_results[0];

                // Define the result image mapping outside of the loop
                const resultImageMapping = {
                    banana: ["result1.png", "one.png", "banana.png"],
                    apple: ["result2.png", "two.png", "apple.png"],
                    lemon: ["result3.png", "three.png", "lemon.png"],
                    mango: ["result4.png", "four.png", "mango.png"],
                    guava: ["result5.png", "five.png", "guava.png"],
                    papaya: ["result6.png", "six.png", "papaya.png"],
                    pineapple: ["result7.png", "seven.png", "pineapple.png"],
                    tomato: ["result8.png", "eight.png", "tomato.png"],
                    chillie: ["result9.png", "nine.png", "chillie.png"],
                    lychee: ["result10.png", "ten.png", "lychee.png"],
                    orange: ["result11.png", "eleven.png", "orange.png"],
                    kiwi: ["result12.png", "twelve.png", "kiwi.png"] // Add more mappings as needed
                };

                // Get the latest fruit from the result item
                const fruit = latestResultItem.winning_fruit;
                console.log('Fruit ', fruit);

                const fruitResultImage = resultImageMapping[fruit][0];
                const fruitNumberImage = `static/images/${resultImageMapping[fruit][1]}`;
                console.log('Fruit Num',fruitNumberImage)
                const fruitImage =  `static/images/${resultImageMapping[fruit][2]}`;

                console.log('Fruit Image:', fruitImage);
                document.getElementById('reel1').querySelector('img').src = fruitNumberImage;
                document.getElementById('reel2').querySelector('img').src = fruitImage;
            
                document.getElementById('reel4').querySelector('img').src = fruitNumberImage;
                document.getElementById('reel5').querySelector('img').src = fruitImage;


                const reel1ImagePath = $('#reel1 img').attr('src');
                const reel2ImagePath = $('#reel2 img').attr('src');
                
                // Append all history items to the "history" container
                var historyContainer = $('#history-container');
                historyContainer.empty(); // Clear previous history
                response.bet_results.forEach(function(resultItem) {
                    // Create a new history item with both fruit name, image, and winning amount
                    const fruit = resultItem.winning_fruit;
                    const fruitResultImage = resultImageMapping[fruit][0];
                    const fruitNumberImage = resultImageMapping[fruit][1];
                    const FruitImage = resultImageMapping[fruit][2];
                    console.log('FruitImage',FruitImage);

                    const winningFruitImageUrl = `/static/images/${fruitResultImage}`;
                    const historyItem = $("<div class='history-card' style='position: relative;'>");
                    const timestamp = $("<span style='position: absolute; font-size: 12px; top: 1px; left: 8px; font-weight: bold; background-color: #b4c0d6; padding: 5px;'>").text(resultItem.timestamp);
                    const fruitImage = $("<img class='card-img-top' style='position: relative;'>").attr('src', winningFruitImageUrl);
                    const fruitName = $("<p style='font-size: 0px;'>").text(resultItem.winning_fruit);

                    historyItem.append(fruitImage, fruitName, timestamp);

                    // Append the history item to the container
                    historyContainer.append(historyItem);
                });
            }
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error('Error fetching history:', error);
        }
    });
});
});

function updateClock() {
var currentTime = new Date();
var hours = currentTime.getHours();
var minutes = currentTime.getMinutes();
var seconds = currentTime.getSeconds();

// Convert hours to 12-hour format
var meridiem = hours >= 12 ? 'PM' : 'AM';
hours = hours % 12;
hours = hours ? hours : 12; // Handle midnight (0 hours)

// Add leading zeros to hours, minutes, and seconds if they are less than 10
hours = ('0' + hours).slice(-2);
minutes = ('0' + minutes).slice(-2);
seconds = ('0' + seconds).slice(-2);

// Update the clock display
document.getElementById('hours').innerText = hours;
document.getElementById('minutes').innerText = minutes;
document.getElementById('seconds').innerText = seconds;

// Update AM/PM indicator
document.getElementById('ampm').innerText = meridiem;

// Update the clock every second
setTimeout(updateClock, 1000);
}

// Start updating the clock
updateClock();


function selectOdd() {
var oddFruits = document.querySelectorAll(".fruit-item:nth-child(odd)");
oddFruits.forEach(function (item) {
    placeBet(item, "odd");
});
}

function selectEven() {
var evenFruits = document.querySelectorAll(".fruit-item:nth-child(even)");
evenFruits.forEach(function (item) {
    placeBet(item, "even");
});
}

function selectLower() {
var lowerFruits = document.querySelectorAll(".right-container > .fruit-item:nth-child(n+7)");
lowerFruits.forEach(function (item) {
    placeBet(item, "lower");
});
}

function selectUpper() {
var upperFruits = document.querySelectorAll(".right-container > .fruit-item:nth-child(-n+6)");
upperFruits.forEach(function (item) {
    placeBet(item, "upper");
});
}






// Function to get a random fruit for the computer's choice     
function getRandomFruit() {
const fruits = ["banana","apple" ,"lemon", "mango", "guava", "papaya", "pineapple", "tomato","chiilie","lychee", "orange", "kiwi"]; // List of fruits on the second reel
const randomIndex = Math.floor(Math.random() * fruits.length);
return fruits[randomIndex];
}

// Function to get the chosen fruit
function getChosenFruit() {
let chosenFruit = "";

// Find the chosen fruit
document.querySelectorAll(".fruit-item").forEach((fruitItem) => {
    var amountElement = fruitItem.querySelector(".amount b");
    if (amountElement) {
        var amount = parseInt(amountElement.innerText);
        if (amount > 0) {
            chosenFruit = fruitItem.querySelector("img").getAttribute("alt").toLowerCase();
        }
    }
});

return chosenFruit;
}
// JavaScript click event to display the modal
var addButton = document.getElementById("add-balance-btn");
addButton.onclick = function () {
var depositModal = document.getElementById("depositModal");
depositModal.style.display = "block";
}


// JavaScript click event to close the modal
var closeModalButton = document.getElementById("closeModal");
closeModalButton.onclick = function () {
var depositModal = document.getElementById("depositModal");
depositModal.style.display = "none";
}

// Close the modal when the user clicks anywhere outside of it
window.onclick = function (event) {
var depositModal = document.getElementById("depositModal");
if (event.target == depositModal) {
    depositModal.style.display = "none";
}
}


document.getElementById("confirmDeposit").onclick = function () {
var depositAmount = parseInt(document.getElementById("depositAmount").value);

// Perform AJAX request to update balance
var csrftoken = getCookie('csrftoken');

$.ajax({
    url: '/update_balance/',
    type: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    data: { new_balance: depositAmount }, // Use depositAmount as the new balance
    success: function (response) {
        // Update the balance amount displayed on the main page
        balance += depositAmount;
        updateBalance(); // Update the balance displayed on the page
        console.log('Deposit successful.');
    },
    error: function (xhr, status, error) {
        console.error('Error depositing amount:', error);
    }
});

// Close the modal after processing
var depositModal = document.getElementById("depositModal");
depositModal.style.display = "none";
}

// Define a function to play the audio
function playAudio() {
var audio = new Audio('static/images/buttonaudio.wav');
audio.play();
}

// Add an event listener to the button element
document.addEventListener('DOMContentLoaded', function() {
var button = document.getElementById('myButton');
if (button) {
    button.addEventListener('click', function() {
        // Call the playAudio function when the button is clicked
        playAudio();
    });
}
});
// Function to generate time options
function generateTimeOptions() {
var futureTimesDiv = document.getElementById("future-times-checkboxes");
futureTimesDiv.innerHTML = ""; // Clear previous checkboxes

// Get current time
var currentTime = new Date();
var currentHour = currentTime.getHours();
var currentMinute = currentTime.getMinutes();

// Generate checkboxes for future times
var numberOfOptions = 5 * 60 / 3; // 5 hours with a checkbox every 3 minutes
for (var i = 0; i < numberOfOptions; i++) {
    // Calculate future time
    var futureHour = currentHour;
    var futureMinute = currentMinute + (i * 3);
    if (futureMinute >= 60) {
        futureHour++;
        futureMinute -= 60;
    }
    if (futureHour >= 24) {
        futureHour -= 24;
    }

    // Format future time
    var formattedTime = ("0" + futureHour).slice(-2) + ":" + ("0" + futureMinute).slice(-2);

    // Create checkbox element
    var checkboxLabel = document.createElement("label");
    var checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.name = "future-time";
    checkboxInput.value = formattedTime;
    checkboxLabel.appendChild(checkboxInput);
    checkboxLabel.appendChild(document.createTextNode(" " + formattedTime));
    checkboxLabel.appendChild(document.createElement("br"));

    // Append checkbox to futureTimesDiv
    futureTimesDiv.appendChild(checkboxLabel);
}
}

// Function to open the pop-up dialog box
function openPopup() {
var popup = document.getElementById("popup");
popup.style.display = "block";
}

// Function to close the pop-up dialog box
function closePopup() {
var popup = document.getElementById("popup");
popup.style.display = "none";
}

// Function to place bets based on selected future times
function placeBets() {
// Get all selected checkboxes
var checkboxes = document.querySelectorAll('input[name="future-time"]:checked');

// Place bets for each selected future time
checkboxes.forEach(function(checkbox) {
    var futureTime = checkbox.value;
    // Place bets for the future time (e.g., using AJAX)
    console.log("Placing bets for " + futureTime + " in advance...");
});

// Close the pop-up dialog box after placing bets
closePopup();
}

// Function to open the pop-up and generate time options
function openPopupAndGenerateTimeOptions() {
openPopup();
generateTimeOptions();
}
function closePopup() {
document.getElementById('popup').style.display = 'none';
}
// Event listener for opening the pop-up and generating time options when the button is clicked
document.getElementById("clear-button-1").addEventListener("click", openPopupAndGenerateTimeOptions);

// Event listener for placing bets when the "Place Bets" button is clicked
document.getElementById("place-bets-btn").addEventListener("click", placeBets);


// Function to redirect the user to the bet history HTML page
function goToBetHistory() {
// Set a flag in sessionStorage to indicate that the user is viewing the bet history
sessionStorage.setItem('viewingBetHistory', 'true');

// Store the remaining time in localStorage
localStorage.setItem('timeLeft', timeLeft);

// Redirect the user to the bet history HTML page
window.location.href = "/bet_History/";
}

// When the page loads
window.addEventListener('load', function() {
// Check if the user is currently viewing the bet history
var viewingBetHistory = sessionStorage.getItem('viewingBetHistory');

// If the user is viewing the bet history, retrieve the remaining time from localStorage
if (viewingBetHistory === 'true') {
    // Retrieve the remaining time from localStorage
    var timeLeft = localStorage.getItem('timeLeft');
    
    // You can add any additional logic here as needed
    // For example, restart the timer with the retrieved remaining time
    
    // Reset the flag
    sessionStorage.removeItem('viewingBetHistory');
    
    // Clear the stored remaining time from localStorage
    localStorage.removeItem('timeLeft');
}
});
