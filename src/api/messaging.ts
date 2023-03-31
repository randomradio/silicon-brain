import { ChatOpenAI } from "langchain/chat_models";
import {
  CallbackManager,
  LangChainTracer,
  ConsoleCallbackHandler,
} from "langchain/callbacks";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { ConversationChain } from "langchain/chains";

export const NewChain = async (
  openAIApiKey: string,
  modelName: string,
  cb: (token: string, done: boolean, err?: Error) => void
) => {
  /* Initialize the LLM to use to answer the question */

  const model = new ChatOpenAI({
    openAIApiKey,
    modelName,
    temperature: 1,
    streaming: true,
    callbackManager: CallbackManager.fromHandlers({
      async handleLLMNewToken(token: string) {
        cb(token, false);
      },
      async handleLLMError(err: Error, verbose?: boolean) {
        cb("", true, err);
      },
      async handleLLMEnd(output, verbose) {
        // default to one generations
        cb(output.generations[0][0].text, true);
      },
    }),
  });
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "history",
  }); // todo: this should be adjusted based on user token limit settinquesiton: string, uuid: stringg
  const chain = new ConversationChain({
    llm: model,
    prompt: chatPrompt,
    memory: memory,
  });

  return chain;
};
