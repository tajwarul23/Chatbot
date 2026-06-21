import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import readLine from "node:readline/promises";
import { read } from "node:fs";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });


//   ];

const SYSTEM_PROMPT = {
  role: "system",
  content: `You are BongChong, a smart personal assistant who answers the asked questions.
  current date and time: ${new Date().toUTCString()}
  You've access to following tools:
  1. webSearch ({query} : {query: string}) // Search the latest information and realtime data on the internet.
  `,
};

const TOOLS = [
  {
    type: "function",
    function: {
      name: "webSearch",
      description: "Search the latest information and realtime data on the internet",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to perform search on",
          },
        },
        required: ["query"],
      },
    },
  },
];

export async function generate(userMessage, history=[]) {
  
 try {
       const messages = history.length && history[0]?.role === "system"?history : [SYSTEM_PROMPT, ...history] 


  
 
    messages.push({
      role: "user",
      content: userMessage,
    });

    //LLM Loop
    while (true) {
      // first LLM API call which gives in return of tool calling information
      const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: messages,
        //define the tool schema
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the latest information and realtime data on the internet", //what's the tool does
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query to perform search on", //the description of the parameters
                  },
                },
                required: ["query"],
              },
            },
          },
        ],

        tool_choice: "auto",
      });
      messages.push(chatCompletion.choices[0].message);

      //calling tool on base of first LLM API
      const toolCalls = chatCompletion?.choices[0].message?.tool_calls;

      if (!toolCalls) {
        // const result = {
        //     role: "assistant",
        //     message: chatCompletion?.choices?.[0].message.content
        // }
        // return result;
        const reply = chatCompletion?.choices?.[0].message;
        return {reply, history:messages}
      }
      for (const tool of toolCalls) {
        // console.log("tool:", tool);
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;

        if (functionName === "webSearch") {
          const toolRes = await webSearch(JSON.parse(functionParams));
          // console.log(toolRes);
          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolRes,
          });
          // console.log("tool info:::",tool.id, toolRes);
        }
      }
    }
 } catch (error) {
    console.log(error);
    
 }
  
}


async function webSearch({ query }) {
  console.log("Calling web search....");

  const response = await tvly.search(query, { maxResults: 3 });
  const finalResult = response.results.map((r) => r.content).join("\n\n");

  return finalResult;
}
