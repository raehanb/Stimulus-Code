// Enhanced chatbot responses with keyword matching and conversation flow
const chatbotData = {
    // Basic information responses
    about: {
        keywords: ['what', 'about', 'stimulus', 'company', 'business', 'who', 'tell me', 'describe', 'explain'],
        response: "Stimulus is a forward-thinking consulting startup founded in 2025, helping businesses grow and hire smarter. We're led by industry expert Ms. Anusha K and specialize in Business Consulting, Job Recruitment, and Business Advisory services. <a href='https://stimulus.org.in' target='_blank'>Visit our website</a> to learn more!",
        quickReplies: ['Tell me about services', 'Contact information']
    },
    
    services: {
        keywords: ['service', 'services', 'offer', 'do', 'help', 'consulting', 'recruitment', 'provide', 'solutions', 'assistance', 'support', 'capabilities'],
        response: "We offer three main services to help your business succeed:",
        followUp: "Which service would you like to know more about?",
        context: 'service_selection',
        quickReplies: ['Business Consulting', 'Job Recruitment', 'Business Advisory']
    },
    
    contact: {
        keywords: ['contact', 'email', 'phone', 'reach', 'call', 'write', 'address', 'touch', 'communicate', 'talk', 'speak', 'number', 'mail'],
        response: "You can reach us through: <br>📧 Email: <a href='mailto:founder@stimulus.org.in'>founder@stimulus.org.in</a><br>🌐 Website: <a href='https://stimulus.org.in' target='_blank'>https://stimulus.org.in</a><br><br>We're always ready to help with your business consulting needs!",
        quickReplies: ['Our services', 'About Stimulus']
    },
    
    registration: {
        keywords: ['register', 'signup', 'sign up', 'join', 'enroll', 'apply', 'start', 'begin', 'get started', 'onboard', 'registration'],
        response: "To get started with Stimulus, <a href='https://stimulus.org.in' target='_blank'>visit our registration page</a> on our website. You can also contact us directly at <a href='mailto:founder@stimulus.org.in'>founder@stimulus.org.in</a> for personalized assistance with the registration process.",
        quickReplies: ['Contact us', 'Our services']
    },
    

    
    founder: {
        keywords: ['founder', 'anusha', 'leader', 'ceo', 'owner', 'who runs', 'boss', 'head', 'manager', 'director'],
        response: "Stimulus is led by <strong>Ms. Anusha K</strong>, an industry expert with extensive experience in business consulting, recruitment, and advisory services. Her expertise drives our mission to help businesses grow and hire smarter.",
        quickReplies: ['About Stimulus', 'Our services', 'Contact us']
    },

    pricing: {
        keywords: ['price', 'pricing', 'cost', 'costs', 'fee', 'fees', 'rate', 'rates', 'charge', 'charges', 'budget', 'expensive', 'affordable', 'money'],
        response: "Our pricing is customized based on your specific business needs and project scope. We offer competitive rates and flexible payment options to ensure our services are accessible to businesses of all sizes. Contact us for a personalized quote!",
        quickReplies: ['Contact us', 'Our services', 'About Stimulus']
    },

    help: {
        keywords: ['help', 'assist', 'support', 'solve', 'fix', 'problem', 'issue', 'challenge', 'need', 'require'],
        response: "We're here to help your business succeed! Whether you need strategic consulting, talent recruitment, or business advisory services, our expert team can provide tailored solutions to address your specific challenges and goals.",
        quickReplies: ['Our services', 'Contact us', 'Pricing info']
    }
};

// Contextual responses for conversation flow
const contextualResponses = {
    service_selection: {
        'business consulting': "Our Business Consulting service helps your business grow strategically. We provide expert guidance on business development, process optimization, and strategic planning to accelerate your company's growth.",
        'job recruitment': "Our Job Recruitment service focuses on finding the right talent for your company. We handle the entire recruitment process, from job posting to candidate screening and final selection.",
        'business advisory': "Our Business Advisory service provides expert guidance for critical business decisions. We offer strategic advice, market analysis, and planning support to help you make informed choices.",
        default: "Please choose one of the service options: Business Consulting, Job Recruitment, or Business Advisory."
    },
    

};

// Chat state management
let chatState = {
    context: null,
    lastResponse: null
};

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const quickReplies = document.getElementById('quickReplies');

// Utility function to normalize text
function normalizeText(text) {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
}

// Function to show typing indicator
function showTypingIndicator() {
    typingIndicator.style.display = 'block';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to hide typing indicator
function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// Function to show quick reply buttons
function showQuickReplies(replies) {
    quickReplies.innerHTML = '';
    if (replies && replies.length > 0) {
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply-btn';
            button.textContent = reply;
            button.onclick = () => handleQuickReply(reply);
            quickReplies.appendChild(button);
        });
        quickReplies.style.display = 'flex';
    } else {
        quickReplies.style.display = 'none';
    }
}

// Function to handle quick reply button clicks
function handleQuickReply(reply) {
    userInput.value = reply;
    handleUserInput();
}

// Function to add message to chat
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    messageBubble.innerHTML = message;
    
    messageDiv.appendChild(messageBubble);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enhanced keyword matching function
function findBestMatch(userMessage) {
    const normalizedMessage = normalizeText(userMessage);
    const words = normalizedMessage.split(' ');
    
    let bestMatch = null;
    let maxScore = 0;
    
    // Check if we're in a conversation context
    if (chatState.context && contextualResponses[chatState.context]) {
        const contextData = contextualResponses[chatState.context];
        
        // Check for exact matches in context
        for (const [key, response] of Object.entries(contextData)) {
            if (key !== 'default') {
                const keyWords = normalizeText(key).split(' ');
                const matchScore = keyWords.filter(word => words.includes(word)).length;
                
                if (matchScore > 0 && matchScore >= keyWords.length * 0.7) {
                    return {
                        response: response,
                        quickReplies: ['Contact us', 'Our services'],
                        clearContext: true
                    };
                }
            }
        }
        
        // If no match in context, return default context response
        return {
            response: contextData.default,
            quickReplies: Object.keys(contextData).filter(key => key !== 'default'),
            clearContext: false
        };
    }
    
    // Check main responses
    for (const [key, data] of Object.entries(chatbotData)) {
        let score = 0;
        
        // Calculate match score based on keywords
        data.keywords.forEach(keyword => {
            if (normalizedMessage.includes(keyword)) {
                score += keyword.length; // Longer keywords get higher scores
            }
        });
        
        if (score > maxScore) {
            maxScore = score;
            bestMatch = data;
        }
    }
    
    return bestMatch;
}

// Function to get bot response
function getBotResponse(userMessage) {
    const match = findBestMatch(userMessage);
    
    if (match) {
        let response = match.response;
        
        // Handle follow-up questions
        if (match.followUp) {
            response += "<br><br>" + match.followUp;
        }
        
        // Update chat state
        if (match.context) {
            chatState.context = match.context;
        } else if (match.clearContext) {
            chatState.context = null;
        }
        
        return {
            message: response,
            quickReplies: match.quickReplies || []
        };
    }
    
    // Default response for unmatched queries
    chatState.context = null;
    return {
        message: "I'm sorry, I don't understand that question. Try asking me about our services, contact information, registration, or company details. You can also <a href='https://stimulus.org.in' target='_blank'>visit our website</a> for more information.",
        quickReplies: ['Our services', 'Contact us', 'Pricing info']
    };
}

// Function to handle user input
function handleUserInput() {
    const message = userInput.value.trim();
    
    // Check if message is not empty
    if (message === '') {
        return;
    }
    
    // Hide quick replies when user types
    quickReplies.style.display = 'none';
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input field
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate and add bot response after a delay
    setTimeout(() => {
        hideTypingIndicator();
        
        const botResponse = getBotResponse(message);
        addMessage(botResponse.message, false);
        
        // Show quick reply buttons if available
        setTimeout(() => {
            showQuickReplies(botResponse.quickReplies);
        }, 300);
        
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);

userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Focus on input field when page loads
window.addEventListener('load', function() {
    userInput.focus();
    
    // Show initial quick replies after a short delay
    setTimeout(() => {
        showQuickReplies(['What is Stimulus?', 'Our services', 'Contact us', 'Pricing info']);
    }, 2000);
});

