"use strict";


const inputUser = document.querySelector("#input")
const sendBtn = document.querySelector("#send")
const useMsg = document.querySelector("#useMsg")
const selectMenu = document.querySelector("#sleMenu")
const dellMsg = document.querySelector("#dellMsg")
const recordBtn = document.querySelector("#record")
const scroll = document.querySelector("#scroll")

const showLimit = document.querySelector("#showLimit")
const useSplitMsg = document.querySelector("#splitMsg")
const useNumMsg = document.querySelector("#numMsg")


const __region__ = "en-US"
const __SetResetTime__ = [15, 0, 0]
const limit = 100
const __SetTimeDisabelInput__ = 4
const initialInputHeight = inputUser.scrollHeight

// Retrieve message data stored
const __StoreDB__ = JSON.parse(
    localStorage.getItem("__msg__")
) || [];

// Get the number of tokens available 
let __LimitCount__ = parseInt(
    localStorage.getItem("__int__")
) || 0;


function getTime() {
    return new Date().toLocaleString(__region__, {
        weekday: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: false
    })
}


function __PopUp__(msg, duration = 3000) {
    const e = document.querySelector(".pop-up")    
    e.innerHTML = msg // Use message for page 
    e.style.display = "block"
    
    setTimeout(() => {
        e.innerHTML = ""
        e.style.display = "none"
    }, duration);
}
 

function __UseMultiDB__(message, role) {
    __StoreDB__.push({
        role, message,
        time: getTime()
    })
    
    // Save data for __StoreDB__ or local store 
    return localStorage.setItem(
        "__msg__", 
        JSON.stringify(__StoreDB__)
    )
}


(() => {
    return __StoreDB__.forEach(chats => {
        const time = chats.role === "user" ? chats.time : "";
        const copy = chats.role === "user" ? "" : "<svg onclick='useClipboard()' width='13px' height='13px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' class='icon-md-heavy'><path fill-rule='evenodd' clip-rule='evenodd' d='M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z' fill='#4a5568'></path></svg>";
        
        useMsg.innerHTML += `
            <li class="${chats.role==='user'?'repaly':'sender'}">
                <section>${chats.message.trim()}</section>
                <div class="time">${copy}&emsp;${time}</div>
            </li>`;
    })
})()


async function __HandleOutgoingChat__() {
    const msg = inputUser.value.trim()
    const select = selectMenu.value
    if (!msg) return;
   
    inputUser.value = ""
    inputUser.style.height = `${initialInputHeight}px`
    
    // Handle user input with replace /Url/Html/Sensor
    const __replace__ = msg
        .replace(/<(.*?)>/gis, "&#60;$1&#62;")
        .replace(/\b((?:https?|ftp):\/\/[^\s\°]+)/g, "<a href='$1'>$1</a>")
        .replace(new RegExp(__word__.join("|"), "gi"), "****")
        
    
    __UseMultiDB__(__replace__, "user")
    useMsg.innerHTML += `
        <li class="repaly">
            <section>${__replace__}</section>
            <div class="time">${getTime()}</div>
        </li>`;
   
    // Spinner animation when sending chat is quite long
    sendBtn.disabled = true 
    sendBtn.innerHTML = `
        <svg class="spinner" width="18px" height="18px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" class="hds-flight-icon--animation-loading">
            <g fill="#FFFFFF" fill-rule="evenodd" clip-rule="evenodd">
                <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" opacity=".2"/>
                <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z"/>
            </g>
        </svg>`;
        
    try {
        let response = await __ExectMainFeature__(select, msg)
        if (limit - __LimitCount__ <= 0) {
            return __PopUp__(`Daily token has been reached, come back at <span style="color:#ff6a80;">${__ResetTime__}</span>`)
        }
        
        __LimitCount__++;        
        
        __UseMultiDB__(response, "system")
        useMsg.innerHTML += `
            <li class="sender">
                <section>${response}</section>
                <div class="time"><svg onclick='useClipboard()' width='13px' height='13px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' class='icon-md-heavy'><path fill-rule='evenodd' clip-rule='evenodd' d='M7 5C7 3.34315 8.34315 2 10 2H19C20.6569 2 22 3.34315 22 5V14C22 15.6569 20.6569 17 19 17H17V19C17 20.6569 15.6569 22 14 22H5C3.34315 22 2 20.6569 2 19V10C2 8.34315 3.34315 7 5 7H7V5ZM9 7H14C15.6569 7 17 8.34315 17 10V15H19C19.5523 15 20 14.5523 20 14V5C20 4.44772 19.5523 4 19 4H10C9.44772 4 9 4.44772 9 5V7ZM5 9C4.44772 9 4 9.44772 4 10V19C4 19.5523 4.44772 20 5 20H14C14.5523 20 15 19.5523 15 19V10C15 9.44772 14.5523 9 14 9H5Z' fill='#4a5568'></path></svg></div>
            </li>`;                
        
        const SplitMsg = `${response.split(".")[0].substring(0, 28)}... .`
        const NumMsg = useMsg.children.length
        const ShowLimit = `
            <button class="form-control" style="--b:#f6f7fa;margin-right:4px;width:40px" id="token">
                ${limit - __LimitCount__}
            </button>`;
        
        useSplitMsg.textContent = SplitMsg
        useNumMsg.textContent = NumMsg
        showLimit.innerHTML = ShowLimit
        
        localStorage.setItem("__int__", __LimitCount__)
        localStorage.setItem("__split__", SplitMsg)
        localStorage.setItem("__num__", NumMsg)
        localStorage.setItem("__limit__", ShowLimit)
    } catch (e) {
        console.error(e.stack)
        __PopUp__("<span style='color:#e55865;'>An error occurred. Either the engine you requested does not exist or there was another issue processing your request.</span>", 9000)
    } finally {
        sendBtn.disabled = false
        sendBtn.innerHTML = `<svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Arrow / Arrow_Up_MD"><path id="Vector" d="M12 19V5M12 5L6 11M12 5L18 11" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
    }
    
    // Add handling to add culdwon to user input as a premium feature
    inputUser.disabled = true
    let setTimeColdwon = __SetTimeDisabelInput__
    
    let __DisableInput__ = setInterval(() => {
        inputUser.placeholder = 
            setTimeColdwon > 0 ?
            `Can send in ${setTimeColdwon--}s` :
            (clearInterval(__DisableInput__),
                (inputUser.disabled = false),
                (inputUser.placeholder = "Ask a question"));
    }, 1000)
    
    scroll.scrollTo({ top: scroll.scrollHeight, behavior: "smooth" }) // scroll to bottom of the message container
}


// Instance of rest the main limits for user
function __ResetDailyLimit__(stopOperation, setLimitResetTime) {
    if (stopOperation === false) {
        const __ResetTime__ = new Date(new Date().setHours(
            setLimitResetTime[0], // Clock 
            setLimitResetTime[1], // Minutes 
            setLimitResetTime[2], // Seconds 
            0 // Set milliseconds to 0
        ));
        
        let time = __ResetTime__ - new Date() // Calculate the time remaining until reset
        
        if (time < 0) {
            time += 24 * 3600 * 1000 // If the reset time has passed, add 24 hours
        }
        
        setTimeout(() => {
            alert(`Token has been reset! Happy using, ${token} tokens are restored. Reload your website!`)
            
            // Reset token every specified hour 
            setInterval(() => {
                localStorage.removeItem("__int__")
            }, 24 * 3600 * 1000)
        },time)
    } else {
        return null
    }
}


// Add copy button to grab text from object class to make it easier to copy text to clipboard 
function useClipboard() {
    __PopUp__("Text has been copied to the clipboard!")    
    return navigator.clipboard.writeText(event.target.closest(".sender").textContent.trim())
}


// Set the configuration to take the sound and return it to text form
recordBtn.addEventListener("click", () => {
    var speech = true 
    window.SpeechRecognition = window.webkitSpeechRecognition
    
    const recognition = new SpeechRecognition()
    recognition.interimResults = true
    recognition.lang = __region__
    
    recognition.addEventListener("result", (e) => {
        const transcript = Array.from(e.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("");
        
        inputUser.value = transcript  // Show recorded text
    })
    
    if (speech == true) {
        recognition.start()
    }
})



inputUser.addEventListener("input", () => {
    // Adjust the height of the input field dynamically based on its content
    inputUser.style.height = `${initialInputHeight}px`
    inputUser.style.height = `${inputUser.scrollHeight}px`
})


inputUser.addEventListener("keydown", (e) => {
    // If the Enter key is pressed without Shift and the window width is larger 
    // than 800 pixels, handle the outgoing chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        return e.preventDefault() + __HandleOutgoingChat__()
    }
})


useSplitMsg.textContent = localStorage.getItem("__split__")
useNumMsg.textContent = localStorage.getItem("__num__")
showLimit.innerHTML = localStorage.getItem("__limit__")

sendBtn.addEventListener("click", __HandleOutgoingChat__)

__ResetDailyLimit__(true, __SetResetTime__)

__PopUp__("<b style='font-size:15px;'>Welcome to <span style='color:#2aa198;'>REAPL</span>, your personal AI assistant.</b> <br><br> All your inputs such as chats with (Reapl) are not used for any specific purposes so you don't need to worry about your data, all chat data is stored in browser cookies.", 8000)


dellMsg.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear? This action cannot be undone.")) {
        localStorage.removeItem("__split__")
        localStorage.removeItem("__num__")
        localStorage.removeItem("__msg__")
        useMsg.innerHTML = ""
        __PopUp__("All chat messages have been cleared successfully. Reload the website!")
    }
})
