import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { question, answer, type } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        // v1 нұсқасы және тұрақты 2.5-flash моделі
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // 2025-2026 ресми олимпиада критерийлері бойынша промпт
        const systemPrompt = `
Сен — қазақ тілі мен әдебиеті пәнінен Республикалық олимпиаданың сарапшысысың. 
Оқушының жұмысын 2025-2026 оқу жылының ресми 50 ұпайлық жүйесімен бағала.

КРИТЕРИЙЛЕР (әрқайсысы 10 ұпай):
1. Мазмұны мен құрылымы: Тақырыпқа сәйкестік, жүйелілік, ой байланысы.
2. Дәлелдемелер: Мәселені нақты дәлелдермен шешу, өзіндік тұжырым.
3. Тезистер мен деректер: Дәйексөздерді қолдану, ғылыми мәліметтер, тезистердің сауаттылығы.
4. Тілдік норма мен стиль: Әдеби тіл, стильдік норма, сөз саптау.
5. Сауаттылық: Лексикалық, грамматикалық, орфографиялық және пунктуациялық нормалар.

ЖАУАП ФОРМАТЫ:
- Жалпы балл: [Ұпай]/50
- Әр критерий бойынша талдау және алған балдары.
- Қатемен жұмыс (нақты қателерді көрсету).
- Оқушыға бағыт-бағдар беретін сарапшы кеңесі.
        `;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nТапсырма түрі: ${type}\nТақырып: ${question}\nОқушы жауабы: ${answer}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.3, // Бағалау дәл болуы үшін төмендетілді
                    maxOutputTokens: 2500,
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return NextResponse.json({
                error: "Google API қатесі",
                details: data.error.message
            }, { status: data.error.code || 500 });
        }

        if (!data.candidates || data.candidates.length === 0) {
            return NextResponse.json({ error: "ИИ жауап дайындай алмады" }, { status: 500 });
        }

        const aiText = data.candidates[0].content.parts[0].text;
        return NextResponse.json({ text: aiText });

    } catch (error: any) {
        return NextResponse.json({
            error: "Серверлік қате",
            details: error.message
        }, { status: 500 });
    }
}