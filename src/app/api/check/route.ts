import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
    try {
        const { question, answer, type } = await req.json();

        const google = createGoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        });

        const { text } = await generateText({
            // Модельдің нақты нұсқасын қолданамыз
            model: google('models/gemini-1.5-flash'),
            system: `Сен қазақ тілі мен әдебиетінен олимпиада сарапшысысың. 
      Оқушының жұмысын (эссе немесе талдау) қазақ тілінде тексер. 
      Ұпай қой және қателерді көрсет.`,
            prompt: `Тапсырма: ${question}\nОқушы жауабы: ${answer}`,
        });

        return new Response(JSON.stringify({ text }));
    } catch (error: any) {
        console.error("AI SDK ERROR:", error);

        // Егер тағы да 404 берсе, балама модельді көрейік
        return new Response(JSON.stringify({
            error: 'Сервер жауап бермеді',
            details: error.message
        }), { status: 500 });
    }
}