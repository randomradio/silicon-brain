<template>
    <div class="chat-panel" :class="{ 'show-right': showRightColumn, 'show-left': showLeftColumn }">
        <!-- Left column -->
        <div class="left-column" :class="{ shrinked: !showLeftColumn }">
            <div class="chat-sessions">
                <!-- List of chat sessions go here -->
                <aside class="menu">
                    <p class="menu-label">
                        Chat Sessions
                    </p>
                    <ul class="chat-session menu-list" v-for="session in chatSessions" :key="session.uid">
                        <li @click="selectSession(session.uid)">
                            <a :class="{ 'is-active': selectedSession.uid == session.uid }">{{ session.summary.title }}
                            </a>
                        </li>
                    </ul>
                </aside>
            </div>
            <div class="settings">
                <!-- Toggle Left button -->
                <button class="button" @click="openSettings">
                    <font-awesome-icon icon="fa-solid fa-gear" />
                </button>
            </div>
        </div>

        <!-- Middle column -->
        <div class="middle-column">
            <!-- Chat messages and input box go here -->
            <MessagesDisplay :selectedSession="selectedSession" @show-summary="toggleRightColumn" />
        </div>

        <!-- Right column -->
        <div class="right-column" v-show="showRightColumn">
            <!-- Chat session summary goes here -->
            <button class="button">Update Summary</button>
        </div>
        <Modal :isOpen="showSettings">
            <Settings :settings="settings" @update-settings="updateSettings" @close="closeSettings" />
        </Modal>
    </div>
</template>
  
<script setup lang="ts">
import uuid4 from "uuid4";
import MessagesDisplay from './MessagesDisplay.vue';
import { saveChatSessions, loadChatSessions, loadSettings, saveSettings, ChatSession, UserSettings } from '../misc/storage';

import Modal from "./Modal.vue";
import Settings from "./Settings.vue";
</script>
  
<script lang="ts">
export default {
    name: 'ChatPanel',
    components: {
        MessagesDisplay,
    },
    data() {
        const chatSessions = loadChatSessions();
        if (chatSessions.length === 0) {
            // Create a new chat session if the list is empty
            const newSession: ChatSession = {
                uid: uuid4(), // Replace with a function that generates a unique ID
                history: [],
                summary: {
                    title: "Untitled",
                    content: "",
                },
            };
            chatSessions.push(newSession);
        }
        saveChatSessions(chatSessions);
        return {
            showRightColumn: false,
            showLeftColumn: true,
            chatSessions: chatSessions,
            selectedSession: chatSessions[0],
            showSettings: false,
            settings: loadSettings() || {
                openai_api_key: "",
                model: "",
                nightshift: false,
                max_token_count: 0,
            },
        };
    },
    methods: {
        toggleRightColumn() {
            this.showRightColumn = !this.showRightColumn;
        },
        toggleLeftColumn() {
            this.showLeftColumn = !this.showLeftColumn;
        },
        selectSession(uid: string) {
            this.selectedSession = this.chatSessions.find(
                (session: ChatSession) => session.uid === uid
            ) || {
                uid: '',
                history: [],
                summary: {
                    title: '',
                    content: '',
                },
            };
        },
        saveSettings() {

        },
        updateSettings(settings: UserSettings, key: string, value: string | boolean | number) {
            (settings as any)[key] = value;
            this.settings = settings;
            saveSettings(this.settings);
        },
        closeSettings() {
            this.showSettings = false;
        },
        openSettings() {
            this.showSettings = true;
        }
    },
};
</script>
  
<style lang="scss" scoped>
.chat-panel {
    display: flex;
    height: 100%;

    .left-column,
    .right-column,
    .middle-column {
        height: 100vh;
    }
}

.left-column {
    flex: 0 0 calc(1/5 * 100% - 1rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    overflow-y: auto;
    transition: all 0.3s;
}

.chat-sessions {
    overflow-y: auto;
}

.chat-session {
    padding: 0.5rem 0;
    cursor: pointer;

    &:hover {
        background-color: #f5f5f5;
    }
}

.middle-column {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.right-column {
    flex: 0 0 calc(1/5 * 100% - 1rem);
    display: none;
    padding: 1rem;
    overflow-y: auto;
    transition: all 0.3s;
}

.show-right .middle-column {
    flex: 3;
}

.show-right .right-column {
    display: flex;
    flex-direction: column;
}

.show-left .left-column.shrinked {
    flex: 0 0 50px;
}

.toggle-left-button {
    padding: 0.5rem 1rem;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 1rem;
}

/* Add responsive styles and other styling as needed */
</style>
  