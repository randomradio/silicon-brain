<template>
    <div class="chat-panel" :class="{ 'show-right': showRightColumn, 'show-left': showLeftColumn }">
        <!-- Left column -->
        <div class="left-column" :class="{ shrinked: !showLeftColumn }">
            <div class="chat-sessions">
                <!-- List of chat sessions go here -->
                <aside class="menu">
                    <p class="menu-label">Chat Sessions</p>
                    <button class="add-session button is-primary is-light" @click="addNewSession">
                        <font-awesome-icon icon="fa-solid fa-user-plus" />
                    </button>
                    <n-list hoverable clickable>
                        <n-list-item v-for="session in chatSessions" :key="session.uid" @click="selectSession(session.uid)">
                            <a :class="{ 'is-active': selectedSession.uid == session.uid }">{{ session.summary.title }}
                            </a>
                            <i @click.stop="removeSession(session.uid)"><font-awesome-icon
                                    icon="fa-solid fa-delete-left" /></i>
                        </n-list-item>
                    </n-list>
                    <ul class="chat-session menu-list">
                        <li>
                            <div class="session-item"></div>
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
            <n-page-header :subtitle="'Current Model: ' + selectedSession.setting.model">
            </n-page-header>
            <!-- Chat messages and input box go here -->
            <div class="chat-section">
                <n-select :class="{ 'hidden': selectedSession.setting.model != '' }"
                    v-model:value="selectedSession.setting.model" :options="modelOptions" />
                <MessagesDisplay :selectedSession="selectedSession" :streamingResponse="streamingResponse"
                    :started="selectedSession.setting.model == '' ? false : true" />
            </div>
            <div class="input-section">
                <input type="text" class="message-input" placeholder="Type your message..." v-model="currentMessage"
                    @keydown="onKeyDown" />
                <button class="button is-primary" id="send-button" @click="sendMessage">
                    <font-awesome-icon icon="fa-solid fa-paper-plane" />
                </button>
                <button class="button is-light" @click="toggleRightColumn">🧠</button>
            </div>
        </div>

        <!-- Right column -->
        <div class="right-column" v-show="showRightColumn">
            <!-- Chat session summary goes here -->
            <button class="button is-primary is-light" @click="runSummarize">
                🤖💭Summarize
            </button>
            <n-divider></n-divider>
            <n-card>{{ selectedSession.summary.content }}</n-card>
        </div>
        <Modal :isOpen="showSettings">
            <Settings v-bind:settings="settings" @update-settings="updateSettings" @close="closeSettings" />
        </Modal>
    </div>
</template>

<script setup lang="ts">
import MessagesDisplay from "./MessagesDisplay.vue";
import Modal from "./Modal.vue";
import Settings from "./Settings.vue";
import {
    defaultData,
    saveChatSessions,
    loadChatSessions,
    loadSettings,
    saveSettings,
    ChatSession,
    UserSettings,
    defaultSettings,
    modelOptions,
} from "../misc/storage";
import { NewChain } from "../api/messaging";
import { ConversationChain } from "langchain/chains";

import { Summarize } from "../api/summary";

import {
    useMessage,
    NList,
    NListItem,
    NThing,
    NCard,
    NDivider,
    NSelect,
    NPageHeader,
    NBreadcrumb,
    NBreadcrumbItem,
} from "naive-ui";
import { useLoadingBar } from "naive-ui";
import uuid4 from "uuid4";

const message = useMessage();
window.$message = useMessage();
window.$loadingBar = useLoadingBar();
</script>

<script lang="ts">
export default {
    name: "ChatPanel",
    components: {
        MessagesDisplay,
        NList,
        NListItem,
        NThing,
        NCard,
        NDivider,
        NSelect,
        NPageHeader,
        NBreadcrumb,
        NBreadcrumbItem,
    },
    data() {
        const chatSessions = loadChatSessions();
        saveChatSessions(chatSessions);
        return {
            chain: null as Promise<ConversationChain> | null,
            showRightColumn: false,
            showLeftColumn: true,
            showSettings: false,
            chatSessions: chatSessions,
            selectedSession: chatSessions[0],
            currentMessage: "", // Add this line
            streamingResponse: "",
            settings: loadSettings() || defaultSettings,
            modelOptions,
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
            console.log("new session", uid);

            this.selectedSession =
                this.chatSessions.find((session: ChatSession) => session.uid === uid) ||
                defaultData;
        },
        addNewSession() {
            const newSession = defaultData;
            newSession.uid = uuid4();
            this.chatSessions.push(newSession);
            // select the new session after adding it
            this.selectSession(newSession.uid);
            saveChatSessions(this.chatSessions);
        },
        removeSession(uid: string) {
            this.chatSessions = this.chatSessions.filter(
                (session) => session.uid !== uid
            );
            saveChatSessions(this.chatSessions);
            if (this.selectedSession.uid === uid) {
                this.selectedSession = this.chatSessions[0] || defaultData;
            }
        },
        updateSettings(
            settings: UserSettings,
            key: string,
            value: string | boolean | number
        ) {
            (settings as any)[key] = value;
            this.settings = settings;
            saveSettings(this.settings);
        },
        closeSettings() {
            this.showSettings = false;
        },
        openSettings() {
            this.showSettings = true;
        },
        onKeyDown(event: KeyboardEvent) {
            if (event.key === "Enter" && event.ctrlKey) {
                if (this.currentMessage.trim() != "") {
                    this.sendMessage();
                } else {
                    window.$message.warning("Forgot to say something 🤔");
                    return;
                }
            }
        },
        resetParams() {
            this.chain = null;
            this.currentMessage = "你好";
            this.streamingResponse = "";
        },
        handleMessageCallback(token: string, end: boolean, err?: Error) {
            if (err) {
                window.$message.error(err.message);
                {
                    duration: 5000;
                }
            } else if (!end) {
                this.streamingResponse += token;
            } else {
                // reset streaming response
                // add response to message list
                this.streamingResponse = this.streamingResponse.replace(/\n/g, '<br>');
                this.selectedSession.history.push({
                    timestamp: Date.now(),
                    role: "ai",
                    content: this.streamingResponse,
                });
                // reset chat content
                this.streamingResponse = "";
                saveChatSessions(this.chatSessions);
                window.$loadingBar.finish();
            }
        },
        async runSummarize() {
            window.$loadingBar.start();
            if (this.chain == null) {
                // Start new Chain;
                if (this.settings.openai_api_key != "") {
                    console.log(this.settings);
                    this.chain = NewChain(
                        this.settings.openai_api_key,
                        this.settings.model,
                        this.handleMessageCallback
                    );
                } else {
                    window.$message.error(
                        "Missing OpenAI API Key. If you need one contact Wechat:cyzhao_ian",
                        { duration: 5000 }
                    );
                    return;
                }
            }
            let new_lines = "";
            this.selectedSession.history.forEach((conv) => {
                new_lines += `${conv.role}:${conv.content}\n`;
            });
            if (
                new_lines.trim() == "" &&
                this.selectedSession.summary.content.trim() == ""
            ) {
                window.$message.error("Start conversation to generate summary.", {
                    duration: 2000,
                });
                return;
            }

            const summary = await Summarize(
                this.settings.openai_api_key,
                this.settings.model,
                new_lines,
                this.selectedSession.summary.content
            );
            console.log(summary);

            this.selectedSession.summary.content = summary;
            window.$loadingBar.finish();
        },
        async sendMessage() {
            if (this.chain == null) {
                // Start new Chain;
                if (this.settings.openai_api_key != "") {
                    console.log(this.settings);
                    this.chain = NewChain(
                        this.settings.openai_api_key,
                        this.settings.model,
                        this.handleMessageCallback
                    );
                } else {
                    window.$message.error(
                        "Missing OpenAI API Key. If you need one contact Wechat:cyzhao_ian",
                        { duration: 5000 }
                    );
                    return;
                }
            }

            window.$loadingBar.start();
            const msg = this.currentMessage;
            const messageToSend = {
                timestamp: Date.now(),
                role: "user",
                content: msg,
            };
            this.selectedSession.history.push(
                <
                {
                    role: "user" | "ai";
                    content: string;
                    timestamp: number;
                }
                >messageToSend
            );
            saveChatSessions(this.chatSessions);
            (await this.chain).call({ input: msg });
            this.currentMessage = ''
        },
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
    flex: 0 0 calc(1 / 5 * 100% - 1rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    overflow-y: auto;
    transition: all 0.3s;
}

.chat-sessions {
    position: relative;
    height: inherit;
}

.chat-session {
    padding: 0.5rem 0;
    cursor: pointer;

    &.menu-list {
        overflow-y: auto;
        max-height: 70vh;
        scrollbar-width: none; // For Firefox
        -ms-overflow-style: none; // For Internet Explorer and Edge

        &::-webkit-scrollbar {
            display: none; // For Chrome, Safari, and Opera
        }
    }

    .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;

        a {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        i {
            margin-left: 0.5rem;
            flex-shrink: 0;
        }
    }
}

.chat-section {
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

    &.no-show {
        display: none;
    }
}

.add-session {
    font-size: 10px;
    width: 100%;
    margin-bottom: 1rem;
}

.middle-column {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.right-column {
    flex: 0 0 calc(1 / 5 * 100% - 1rem);
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

#send-button {
    margin-right: 0.5rem;
    /* Adjust this value for desired spacing */
}
</style>
