import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { question, answer, type } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key missing" }, { status: 500 });
        }

        // Тұрақты v1 нұсқасы және flash-latest моделі
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const systemText = type === 'essay'
            ? "Сен қазақ тілі олимпиадасының сарапшысысың. Эссені 10 балдық жүйемен бағалап, қателерін түзет."
            : "Сен қазақ тілі олимпиадасының сарапшысысың. Тапсырманы тексеріп, дұрыс нұсқасын көрсет.";

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemText}\n\nТапсырма: ${question}\nОқушы жауабы: ${answer}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        // Егер Google қате қайтарса
        if (data.error) {
            console.error("Google API Error:", data.error);
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