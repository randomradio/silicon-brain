<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { de } from "date-fns/locale";
import ChatPanel from "./components/ChatPanel.vue";
import { NMessageProvider, NLoadingBarProvider } from "naive-ui";
</script>

<template>
  <n-loading-bar-provider>
    <n-message-provider>
      <main>
        <ChatPanel />
      </main>
    </n-message-provider>
  </n-loading-bar-provider>
</template>

<script lang="ts">
export default {
  components: { ChatPanel, NMessageProvider, NLoadingBarProvider },
}
</script>

<style scoped>
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
</style>
