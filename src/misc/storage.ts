import uuid4 from "uuid4";

export interface ChatSession {
  uid: string;
  history: Array<{
    role: "user" | "ai";
    content: string;
    timestamp: number;
  }>;
  setting: {
    model: string;
    maxToken: number;
  };
  summary: {
    title: string;
    content: string;
  };
}

export interface UserSettings {
  openai_api_key: string;
  model: string;
  nightshift: boolean;
  max_token_count: number;
}

export const modelOptions = [
  {
    label: "gpt-3",
    value: "gpt3",
    disabled: false,
  },
  {
    label: "gpt-3.5-turbo",
    value: "gpt-3.5-turbo",
    disabled: false,
  },
  {
    label: "gpt-4",
    value: "gpt-4",
    disabled: false,
  },
  {
    label: "gpt-4-0314",
    value: "gpt-4-0314",
    disabled: false,
  },
  {
    label: "gpt-4-32k",
    value: "gpt-4-32k",
    disabled: false,
  },
];

export const defaultData: ChatSession = {
  uid: uuid4(),
  history: [],
  setting: { model: "", maxToken: 4096 },
  summary: {
    title: "Start Journey",
    content: "Answer is 42",
  },
};

export const defaultSettings: UserSettings = {
  openai_api_key: "",
  model: "gpt-3.5-turbo",
  nightshift: false,
  max_token_count: 2000,
};

export function loadChatSessions(): ChatSession[] {
  const storedData = localStorage.getItem("chatSessions");

  if (storedData) {
    return JSON.parse(storedData) as ChatSession[];
  }

  // If no data is found in localStorage, use the demo data
  return [defaultData];
}

export function saveChatSessions(chatSessions: ChatSession[]): void {
  localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
}

// storage.ts

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem("user_settings", JSON.stringify(settings));
}

export function loadSettings(): UserSettings {
  const settings = localStorage.getItem("user_settings");
  if (settings) {
    return JSON.parse(settings);
  } else {
    // If settings are not found in localStorage, return the defaultSettings
    saveSettings(defaultSettings);
    return defaultSettings;
  }
}
