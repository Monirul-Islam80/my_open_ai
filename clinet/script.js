import bot from "./public/images/bot.svg"
import user from "./public/images/user.svg"
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadingAnimation;

const loading = element => {
    element.textContent = "";
    loadingAnimation = setInterval(() => {
        element.textContent += ".";
        if (element.textContent === "....") {
            element.textContent = "";
        }
    }, 400);
}
const typetext = (element, text) => {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);

}
const generateId = () => {
    const date = Date.now();
    const randomNum = Math.random(10);
    const hexrandomNum = randomNum.toString(16);

    return `id-${date}-${hexrandomNum}`;
}

const chatmessages = (isAi, value, mesid) => {
    return (
        `
        <div class="mescontainer ${isAi && "ai"}" >
        <div class="chat">
        <div class="profile">
        <img src="${isAi ? bot : user}" alt="${isAi ? "bot" : "user"}" srcset="" />
        </div>
        <div class="message" id=${mesid}>${value}</div>
        </div>
        </div>
        `
    )
}
const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    chatContainer.innerHTML += chatmessages(false, data.get("chat"));

    form.reset();
    const mesid = generateId();
    chatContainer.innerHTML += chatmessages(true, " ", mesid);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const mesDiv = document.getElementById(mesid);

    loading(mesDiv);

    const response = await fetch("http://localhost:5000/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "chat": data.get("chat")
        })
    });
    clearInterval(loadingAnimation);
    mesDiv.innerHTML = "";
    if (response.ok) {
        const data = await response.json();
        console.log(data.bot);
        const pdata = data.bot.trim();
        console.log(pdata);
        typetext(mesDiv, pdata);

    } else {
        const err = await response.text();
        mesDiv.innerHTML = "something went wrong!!"
        alert(err);
    }

}
form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
})