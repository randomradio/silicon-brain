<template>
  <div class="messages-display">
    <div class="message" v-for="(message, index) in reversedMessages" :key="index">
      <strong>{{ message.role === 'user' ? 'User' : 'AI' }}:</strong> {{ message.content }}
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
  streamingMessage: {
    type: String,
    default: "",
  },
});

const selectedSessionRef = ref(props.selectedSession);

watch(
  () => props.selectedSession,
  (newSelectedSession) => {
    selectedSessionRef.value = newSelectedSession;
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
}

.message {
  margin-bottom: 10px;
}

.message:first-child {
  margin-bottom: 1rem;
}
</style>