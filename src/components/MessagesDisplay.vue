<!-- MessagesDisplay.vue -->
<template>
  <div class="messages-display">
    <div class="message" v-for="(message, index) in messages" :key="index">
      <strong>{{ message.sender }}:</strong> {{ message.content }}
    </div>
  </div>
  <div class="input-section">
    <input type="text" class="message-input" placeholder="Type your message..." />
    <button class="button is-light" @click="$emit('show-summary')">🧠Summary</button>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';

const messages = ref([
  { sender: 'User', content: 'What is the capital of France?' },
  { sender: 'AI', content: 'The capital of France is Paris.' },
  { sender: 'User', content: 'What is the population of Paris?' },
  { sender: 'AI', content: 'As of my knowledge cutoff in September 2021, the population of Paris was approximately 2.1 million people. However, population numbers change over time, so I recommend checking a current and reliable source for the most accurate and up-to-date information.' },
]);

</script>
  
<style lang="scss" scoped>
.messages-display {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  height: calc(100vh - 50px - 1rem * 2 - 1rem);
  /* 50px is the height of the summary button, 1rem * 2 is for the padding, and 1rem is for the margin-bottom */
  overflow-y: auto;
  padding: 1rem;
  margin-bottom: 1rem;
}

.message {
  margin-bottom: 1rem;
}

.input-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.message-input {
  flex-grow: 1;
  margin-right: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.summary-button {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}
</style>
 
<script lang="ts">
export default {
  name: 'MessagesDisplay',

}
</script>