<template>
  <div class="messages-display" :class="{ 'hidden': !started }">
    <div class="message message-ai" v-if="streamingResponse">
      <span v-html="formattedStreamingResponse"></span>
    </div>
    <div class="message" :class="{ 'message-user': message.role === 'user', 'message-ai': message.role === 'ai' }"
      v-for="(message, index) in reversedMessages" :key="index">
      <!-- <strong>{{ message.role === 'user' ? 'User' : 'AI' }}:</strong>  -->
      <p v-if="message.role == 'user'">{{ message.content }}</p>
      <p v-if="message.role == 'ai'"><span v-html="message.content"></span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
  selectedSession: {
    type: Object,
    required: true,
  },
  streamingResponse: {
    type: String,
    default: "",
  },
  started: {
    type: Boolean,
    default: false,
  },
  responseDone: {
    type: Boolean,
    default: true,
  }
});

const formattedStreamingResponse = computed(() => {
  return props.streamingResponse.replace(/\n/g, '<br>');
});

const selectedSessionRef = ref(props.selectedSession);

watch(
  () => props.selectedSession,
  (newSelectedSession) => {
    selectedSessionRef.value = newSelectedSession;
  },
  { deep: true }
);

watch(
  () => props.streamingResponse,
  (newSteamingResponse) => {
    ref(props.streamingResponse).value = newSteamingResponse;
  },
  { deep: true }
);

const reversedMessages = computed(() => {
  return [...selectedSessionRef.value.history].reverse();
});
</script>

<script lang="ts">
export default {
  name: "MessagesDisplay",
};
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
  scrollbar-width: none; // For Firefox
  -ms-overflow-style: none; // For Internet Explorer and Edge

  &::-webkit-scrollbar {
    display: none; // For Chrome, Safari, and Opera
  }
}

.message {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  width: fit-content;

  &:first-child {
    margin-bottom: 1rem;
  }
}

.message-user {
  align-self: flex-end;
  background-color: #e5e9f0;
}

.message-ai {
  align-self: flex-start;
  background-color: #f0e5e5;
}
</style>