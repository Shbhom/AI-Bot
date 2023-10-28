const chatBtn = document.createElement("button")

chatBtn.id = "chat-btn"
chatBtn.innerText = "Chat bot"
chatBtn.style.position = "fixed";
chatBtn.style.bottom = "3rem";
chatBtn.style.right = "3rem";
chatBtn.style.backgroundColor = "#ffffff";
chatBtn.style.height = "3rem"
chatBtn.style.width = "auto"
chatBtn.style.borderRadius = "2rem"


document.body.appendChild(chatBtn)
var chatModal = document.createElement("div");
chatModal.id = "chat-modal";
chatModal.style.display = "none";
chatModal.style.position = "fixed";
chatModal.style.bottom = "20px";
chatModal.style.right = "20px";
chatModal.style.backgroundColor = "#ffffff";
chatModal.style.border = "1px solid #cccccc";
chatModal.style.borderRadius = "8px";
chatModal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
chatModal.style.width = "20rem"
chatModal.style.overflow = "hidden";
chatModal.style.fontFamily = "Arial, sans-serif";
// chatModal.style.transition = "all 0.3s";
document.body.appendChild(chatModal);

// Create the chat modal header
var chatHeader = document.createElement("div");
chatHeader.innerText = "AI based chatbot created by Shubhom Srivastava"
chatHeader.className = "chat-header";
chatHeader.style.backgroundColor = "#007bff";
chatHeader.style.color = "#ffffff";
chatHeader.style.padding = "10px";
chatHeader.style.display = "flex";
chatHeader.style.justifyContent = "space-between";
chatHeader.style.alignItems = "center";
chatHeader.style.borderBottom = "1px solid #cccccc";
chatHeader.style.borderRadius = "8px 8px 0 0";
chatModal.appendChild(chatHeader);

// Create the chat modal close button
var closeChatButton = document.createElement("button");
closeChatButton.innerHTML = "&times;";
closeChatButton.style.background = "none";
closeChatButton.style.border = "none";
closeChatButton.style.fontSize = "24px";
closeChatButton.style.color = "#ffffff";
closeChatButton.style.cursor = "pointer";
chatHeader.appendChild(closeChatButton);

// Create the chat messages container
var chatMessages = document.createElement("div");
chatMessages.className = "chat-messages";
chatMessages.style.maxHeight = "200px";
chatMessages.style.overflowY = "auto";
chatMessages.style.padding = "10px";
chatMessages.innerHTML = `
<div class="message-container,bot">
    <p>welcome to the AI based customer service bot!!</p>
    <p>today, how may I help you ?? </p>
</div>
`
chatModal.appendChild(chatMessages);

// Create the user input field
var userInput = document.createElement("input");
userInput.type = "text";
userInput.id = "user-input";
userInput.placeholder = "Type your message...";
userInput.style.width = "80%";
userInput.style.border = "none";
userInput.style.padding = "0.5rem";
userInput.style.margin = "0.5rem"
userInput.style.borderTop = "1px solid #cccccc";
userInput.style.borderRadius = "0 0 8px 8px";
chatModal.appendChild(userInput);

var submit = document.createElement("button")
submit.type = "submit"
submit.innerText = ">"
submit.style.borderRadius = "0 0 10px 10px"
submit.style.padding = "0"
submit.style.margin = "0"
submit.style.width = "10%"
chatModal.appendChild(submit)

var chatHistory = [];
var userQuery;

// Add an event listener for user input (when the user clicks the submit button)
submit.addEventListener("click", function () {
    userQuery = document.getElementById("user-input").value;

    // Display the user's message in the chat modal
    displayUserMessage(userQuery);

    // Handle the user's message and generate bot responses here
    var botResponse = `user's query : ${userQuery}`;
    displayBotResponse(botResponse);

    // Clear the user input field
    document.getElementById("user-input").value = "";
});


// Function to display a user message in the chat modal
function displayUserMessage(message) {
    var messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", "user");

    var messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    // Apply inline styles for user messages
    messageContainer.style.display = "flex";
    messageContainer.style.justifyContent = "flex-end";

    messageElement.style.background = "#007bff";
    messageElement.style.color = "#fff";
    messageElement.style.borderRadius = "10px";
    messageElement.style.padding = "10px";
    messageElement.style.maxWidth = "70%";
    messageElement.style.wordWrap = "break-word";

    chatMessages.appendChild(messageContainer);
    chatHistory.push({ type: "user", message: message });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function displayBotResponse(message) {
    var messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", "bot");

    var messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);

    // Apply inline styles for bot responses
    messageContainer.style.display = "flex";
    messageContainer.style.justifyContent = "flex-start";

    messageElement.style.background = "#fff";
    messageElement.style.color = "#000";
    messageElement.style.borderRadius = "10px";
    messageElement.style.padding = "10px";
    messageElement.style.maxWidth = "70%";
    messageElement.style.wordWrap = "break-word";

    chatMessages.appendChild(messageContainer);
    chatHistory.push({ type: "bot", message: message });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Add event listeners for the chat button and close button
chatBtn.addEventListener("click", function () {
    chatBtn.style.display = "none"
    chatModal.style.display = "block";
    chatModal.classList.add("animate__animated", "animate__slideInUp"); // Apply opening animation
});

closeChatButton.addEventListener("click", function () {
    chatBtn.style.display = "block";
    chatModal.classList.remove("animate__slideInUp"); // Remove opening animation
    chatModal.classList.add("animate__animated", "animate__slideOutDown"); // Apply closing animation
    setTimeout(function () {
        chatModal.classList.remove("animate__slideOutDown"); // Remove closing animation
        chatModal.style.display = "none";
    }, 900); // Adjust the delay to match the animation duration
});