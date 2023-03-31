import { ChatOpenAI } from "langchain/chat_models";
import {
  CallbackManager,
  LangChainTracer,
  ConsoleCallbackHandler,
} from "langchain/callbacks";
import { BufferWindowMemory } from "langchain/memory";
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
  const memory = new BufferWindowMemory({ k: 10 }); // todo: this should be adjusted based on user token limit settinquesiton: string, uuid: stringg
  const chain = new ConversationChain({ llm: model, memory: memory });

  return chain;
};
