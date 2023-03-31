import { OpenAI } from "langchain/llms";
import { BufferWindowMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

import { ChatSession } from "../misc/storage";

const _DEFAULT_SUMMARIZER_TEMPLATE = `Progressively summarize the lines of conversation provided, adding onto the previous summary returning a new summary. Respond in Chinese.

EXAMPLE
Current summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good.

New lines of conversation:
Human: Why do you think artificial intelligence is a force for good?
AI: Because artificial intelligence will help humans reach their full potential.

New summary:
The human asks what the AI thinks of artificial intelligence. The AI thinks artificial intelligence is a force for good because it will help humans reach their full potential.
END OF EXAMPLE

Current summary:
{summary}

New lines of conversation:
{new_lines}

New summary:`;

const SUMMARY_PROMPT = new PromptTemplate({
  template: _DEFAULT_SUMMARIZER_TEMPLATE,
  inputVariables: ["summary", "new_lines"],
});

// const SUMMARY_PROMPT =
export const Summarize = async (
  openAIApiKey: string,
  modelName: string,
  session: ChatSession
) => {
  /* Initialize the LLM to use to summarize the conversation */
  let new_lines = "";
  session.history.forEach((conv) => {
    new_lines += `${conv.role}:${conv.content}\n`;
  });
  const summary = session.summary;
  const model = new OpenAI({ openAIApiKey, temperature: 0, modelName });
  const chain = new LLMChain({ llm: model, prompt: SUMMARY_PROMPT });

  const res = await chain.call({ summary, new_lines });

  return res["text"];
};
