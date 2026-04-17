import OpenAI from "openai";
import { noteTools } from "./tools";
import { toolRegistery } from "./toolExecutor";





const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const MAX_STEPS = 10;

export async function runAgent(userId: string, message: string) {
    let messages: any[] = [
    {
        role: "system",
        content: `You are a note management AI.
        
        Rules:
        -Never create a note unless explicity asked.
        -When searching notes , extract ONLY the core note text.
        -Remove pronouns and tense change
        
        Examples:
        User: "I woke up at 7am"
        Search query: "wake up at 7am"
        
        User: "I finished reading"
        Search query: "reading"
        
        Always normalize before searching.,`
    },
    {
        role: "user",
        content: message,
    }
 ];

 //Sends the full conversation + available tools to GPT-4.1. The model then decides: respond with text, or call a tool?
   for(let step = 0; step < MAX_STEPS; step++) {
    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages,
      tools: noteTools.map((tool) => ({
        type: "function",
        function: tool,
      })),
    });

    // If the model returns plain text → task is done, return it
    // If the model returns tool calls → execute them and loop again

    const msg = completion.choices[0].message;
    messages.push(msg);  //always add AI response to message history

    const toolCalls = msg.tool_calls;
    if(!toolCalls || toolCalls.length === 0) {
        return msg.content; //no tools called = final answer, exit loop
    }

    //executing tools calls
    for(const toolCall of toolCalls) {
       if(toolCall.type !== "function") {
        continue; //currently only support function calls, skip other tool types
    }

    const toolName= toolCall.function.name;
    const args = JSON.parse(toolCall.function.arguments);
    const executor = toolRegistery[toolName];
    if(!executor) {
        throw new Error(`No executor found for tool: ${toolName}`);
    }
    const result = await executor(userId, args);

    //add tool result to message history for next GPT iteration
    messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
    });
    }
}
    throw new Error("Max steps reached without completion");

 
}