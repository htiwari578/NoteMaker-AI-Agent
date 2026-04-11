import OpenAI from "openai";
import { noteTools } from "./tools";




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

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages,
      tools: noteTools.map((tool) => ({
        type: "function",
        function: tool,
      })),
    });

    
 
}