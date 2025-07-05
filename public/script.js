const socket = io();
const messages = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

let username = null;
let typing = false;
let typingTimeout;

socket.on("assign-name", (name) => {
  username = name;
});

socket.on("chat-message", ({ name, message }) => {
  addMessage(`${name}: ${message}`, name === username ? "self" : "");
  if (name !== username) {
    document.getElementById("ping").play();
  }
});

socket.on("system-message", (msg) => {
  addMessage(msg, "system");
});

socket.on("typing", (name) => {
  showTyping(`${name} is typing...`);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  if (msg === "") return;
  socket.emit("chat-message", msg);
  messageInput.value = "";
  stopTyping();
});

messageInput.addEventListener("input", () => {
  if (!typing) {
    typing = true;
    socket.emit("typing");
    typingTimeout = setTimeout(stopTyping, 1000);
  } else {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(stopTyping, 1000);
  }
});

function stopTyping() {
  typing = false;
}

function addMessage(msg, type = "") {
  const el = document.createElement("div");
  el.classList.add("message");
  if (type) el.classList.add(type);
  el.innerText = msg;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}


function showTyping(msg) {
  let typingEl = document.querySelector(".typing-indicator");
  if (!typingEl) {
    typingEl = document.createElement("div");
    typingEl.className = "message typing-indicator";
    messages.appendChild(typingEl);
  }
  typingEl.innerText = msg;
  setTimeout(() => typingEl.remove(), 1500);
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

const picker = new EmojiButton();
const emojiBtn = document.getElementById("emoji-button");

picker.on("emoji", emoji => {
  messageInput.value += emoji;
});

emojiBtn.addEventListener("click", () => {
  picker.togglePicker(emojiBtn);
});

socket.on("user-count", (count) => {
  const span = document.getElementById("user-count");
  if (span) span.innerText = `— ${count} online`;
});
console.log("✅ Script.js loaded");

socket.on("chat-message", ({ name, message }) => {
  console.log("Received message:", name, message); // ✅ Debug log
  addMessage(`${name}: ${message}`, name === username ? "self" : "");
});

import 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.2/dist/index.js';

window.addEventListener("DOMContentLoaded", () => {
  console.log("📦 DOM loaded");

  const emojiBtn = document.getElementById("emoji-button");
  const input = document.getElementById("message-input");

  if (!emojiBtn) return console.error("❌ Emoji button not found!");
  if (!window.EmojiButton) return console.error("❌ EmojiButton not loaded!");

  const picker = new EmojiButton();

  console.log("🎉 Emoji picker initialized:", picker);

  // Hook to input box
  picker.on("emoji", emoji => {
    messageInput.value += emoji;
  });

  // Toggle on emoji button click
  emojiBtn.addEventListener("click", () => {
    picker.togglePicker(emojiBtn);
  });

  console.log("😊 Emoji picker initialized");
});
