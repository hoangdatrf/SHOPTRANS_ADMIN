<template>
  <div class="floating-chat-container">
    <!-- Chat Box -->
    <div class="chat-box" :class="{ 'is-open': isOpen }">
      <div class="chat-header">
        <h3 class="text-white font-medium">Portal Assistant</h3>
        <button @click="toggleChat" class="close-button">
          <Icon name="material-symbols:close" size="19" />
        </button>
      </div>
      <div class="chat-body">
        <div class="messages" ref="messagesContainer">
          <div v-for="(msg, index) in messages" :key="index" class="message"
            :class="{ 'user': msg.isUser, 'bot': !msg.isUser }">
            <p v-html="msg.text"></p>
          </div>
          <div v-if="isLoading" class="message bot">
            <div class="typing-indicator">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" v-model="message" autocomplete="off" placeholder="Nhập tin nhắn..."
            @keyup.enter="sendMessage" />
          <button @click="sendMessage" class="send-button">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Button -->
    <div class="floating-chat-button" :class="{ 'is-open': isOpen }" @click="toggleChat">
      <div class="button-content">
        <div class="icon-wrapper">
          <i class="fa-solid fa-robot"></i>
        </div>
        <span class="pulse"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const message = ref('')
import { marked } from 'marked';

const toggleChat = () => {
  isOpen.value = !isOpen.value
  // Emit event để parent component có thể xử lý việc mở chat
  emit('toggle-chat', isOpen.value)
}

const messages = ref<Array<{ text: string, isUser: boolean }>>([]);
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const isLoading = ref(false);

const sendMessage = async () => {
  if (!message.value.trim()) return;
  messages.value.push({
    text: message.value,
    isUser: true
  });

  scrollToBottom();



  try {
    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("cache-control", "no-cache");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("origin", "https://n8n-64.nzt.vn");
    myHeaders.append("pragma", "no-cache");
    myHeaders.append("priority", "u=1, i");
    myHeaders.append("referer", "https://n8n-64.nzt.vn/webhook/f148a29d-c2ec-4e5b-98f3-c93d0ac06b47/chat");
    myHeaders.append("sec-ch-ua", "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Microsoft Edge\";v=\"138\"");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0");
    myHeaders.append("x-instance-id", "170d3c4c8b49a87a34f9566afef18c1441284eb9f25f1dfa2fec24bbdf31160d");
    myHeaders.append("Cookie", "rl_page_init_referrer=RudderEncrypt%3AU2FsdGVkX1%2FEmKVlvKFgjB9ADycg8I726BX8TXGiglU%3D; rl_page_init_referring_domain=RudderEncrypt%3AU2FsdGVkX19cpVXtXk9%2BPX93v5ePlml7h37gqLoFqNo%3D; n8n-auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQyNGZkMmI3LWViYTUtNGJiOS05NzdjLTFmNGQ4NTMzYTVjYyIsImhhc2giOiJYK1NzZ2RKYTNvIiwiYnJvd3NlcklkIjoiQXhaN2p6WUhxWnM1c3ZON0VLY3hBQzk1NWhyTk1zRzFyUFZOWExJRlBtdz0iLCJpYXQiOjE3NTM2NzcxMDIsImV4cCI6MTc1NDI4MTkwMn0.l_jM72PcBWYN69xD2KNF_0_J2t3Vz47OYeh4BGMeVoA; rl_anonymous_id=RudderEncrypt%3AU2FsdGVkX1%2FL%2B0unyS4NCA4l5aFwVjGJC3HTTWsOW%2BQ3TANwKEpOaBm8wThYIAIrtWuJcGRkcjhw46KA4T5tcA%3D%3D; rl_user_id=RudderEncrypt%3AU2FsdGVkX19WtlwJS%2BJKg9jPwXOsTA300LNMgKU%2FIFWIvSYm6Nwfj6ZgibLKAKdNKNfUZFTsT%2B8IlsuPMcZSBKk%2BfhzVR204duo5sTtFRbOZ%2BTJABj4lrxY7rLqbfqFO9BayoJ3QHC7a2NpYrtkGWhxVsEJzhmdogkctvy6TgUI%3D; rl_trait=RudderEncrypt%3AU2FsdGVkX1%2BrwPieKvEvPZFRZk95Q1Chvgve4Y6EiOu1GZT9vTfEzJO6hXMc1H3GJB8Jkng75tqzFof6I4lSnAj4c5bhk57x869e6Uf2M5Nmz461ktWt%2FQXgHMW4vILWzGV%2FAxcCpMcFAyT54THlOQ%3D%3D; ph_phc_4URIAm1uYfJO7j8kWSe0J8lc8IqnstRLS7Jx8NcakHo_posthog=%7B%22distinct_id%22%3A%22170d3c4c8b49a87a34f9566afef18c1441284eb9f25f1dfa2fec24bbdf31160d%23424fd2b7-eba5-4bb9-977c-1f4d8533a5cc%22%2C%22%24sesid%22%3A%5B1753677061177%2C%2201984f4c-5c1a-7107-9b49-f82be92a27bf%22%2C1753677061146%5D%2C%22%24epp%22%3Atrue%2C%22%24initial_person_info%22%3A%7B%22r%22%3A%22%24direct%22%2C%22u%22%3A%22https%3A%2F%2Fn8n-64.nzt.vn%2Fsignin%3Fredirect%3D%25252F%22%7D%7D; rl_session=RudderEncrypt%3AU2FsdGVkX19MIal3rFaIlnEw%2FiDCmfH4l8c%2B2w6lsjnplvERe4YeahBVE%2B3XNQZZyaks6DyLaOSjHwecSfzUeqe6ogqdySXfKwRRFVCpM65oLyr2ImX0%2F87FNS%2FGahr6oXYdFyTCgH%2FM4jCrfHHfcQ%3D%3D");

    const raw = JSON.stringify({
      "action": "sendMessage",
      "sessionId": "72e5cfe5-57e3-409d-9a92-452b07ff8684",
      "chatInput": message.value
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    message.value = '';
    isLoading.value = true;
    const response = await fetch("https://n8n-64.nzt.vn/webhook/f148a29d-c2ec-4e5b-98f3-c93d0ac06b47/chat", requestOptions);
    const result = await response.json();
    const renderedText = await marked(result.output);
    messages.value.push({
      text: renderedText,
      isUser: false
    });

    scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    isLoading.value = false;
  }

  message.value = '';
}

const emit = defineEmits(['toggle-chat'])
</script>

<style scoped lang="scss">
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.floating-chat-container {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
}

.chat-box {
  position: absolute;
  bottom: calc(100% + 1rem);
  right: 0;
  width: 550px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  pointer-events: none;
  transition: all 0.3s ease;

  &.is-open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  .chat-header {
    background: #2563eb;
    padding: 1rem;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .close-button {
      color: white;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .chat-body {
    height: 400px;
    display: flex;
    flex-direction: column;
  }

  .messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;

    .message {
      margin-bottom: 1rem;
      max-width: 80%;

      p {
        padding: 0.75rem 1rem;
        border-radius: 12px;
        font-size: 0.875rem;
      }

      &.bot p {
        background: #f3f4f6;
      }

      &.user {
        display: flex;
        flex-direction: row-reverse;
        margin-left: auto;
        p {
          background: #2563eb;
          color: white;
        }
      }
    }
  }

  .chat-input {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      outline: none;
      font-size: 0.875rem;

      &:focus {
        border-color: #2563eb;
      }
    }

    .send-button {
      color: #2563eb;
      padding: 0.5rem;
      border-radius: 50%;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f3f4f6;
      }
    }
  }
}

.floating-chat-button {
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;

  .button-content {
    position: relative;
    background: #2563eb;
    padding: 1.1rem;
    border-radius: 50%;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    transition: all 0.3s ease;
    font-size: 1.5rem;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .chat-icon {
    transition: transform 0.3s ease;
  }

  &.is-open .chat-icon {
    transform: rotate(360deg);
  }

  .pulse {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background-color: #22c55e;
    border-radius: 50%;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: inherit;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
  }

  &:hover {
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }

  70% {
    transform: scale(2);
    opacity: 0;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.message.loading {
  p {
    background: #f3f4f6;
    padding: 0.75rem 1rem;
    border-radius: 12px;
  }
}

.typing-indicator {
  display: flex;
  padding: 0.75rem 1rem;

  span {
    height: 8px;
    width: 8px;
    background: #6b7280;
    border-radius: 50%;
    display: inline-block;
    margin: 0 2px;
    animation: bounce 1.5s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}
</style>