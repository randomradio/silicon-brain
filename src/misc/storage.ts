export interface ChatSession {
  uid: string;
  history: Array<{ user: string; ai: string }>;
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

const demoData: ChatSession[] = [
  {
    uid: "dffffsaf",
    history: [
      {
        user: "dafff",
        ai: "dfa",
      },
    ],
    summary: {
      title: "dddaf",
      content: "fdaf",
    },
  },
];

export function loadChatSessions(): ChatSession[] {
  const storedData = localStorage.getItem("chatSessions");

  if (storedData) {
    return JSON.parse(storedData) as ChatSession[];
  }

  // If no data is found in localStorage, use the demo data
  return demoData;
}

export function saveChatSessions(chatSessions: ChatSession[]): void {
  localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
}

// storage.ts

export function saveSettings(settings: any): void {
  localStorage.setItem("user_settings", JSON.stringify(settings));
}

export function loadSettings(): UserSettings {
  const defaultSettings: UserSettings = {
    openai_api_key: "",
    model: "",
    nightshift: false,
    max_token_count: 0,
  };

  const settings = localStorage.getItem("user_settings");
  if (settings) {
    return JSON.parse(settings);
  } else {
    // If settings are not found in localStorage, return the defaultSettings
    return defaultSettings;
  }
}
