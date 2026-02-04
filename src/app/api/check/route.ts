import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { question, answer, type } = await req.json();

        // .filter(Boolean) бос (undefined) кілттерді алып тастайды
        const apiKeys = [
            process.env.GEMINI_API_KEY1,
            process.env.GEMINI_API_KEY2,
            process.env.GEMINI_API_KEY3,
            process.env.GEMINI_API_KEY4,
            process.env.GEMINI_API_KEY5,
            process.env.GEMINI_API_KEY6,
        ].filter(Boolean);

        if (apiKeys.length === 0) {
            return NextResponse.json({ error: "API Keys missing" }, { status: 500 });
        }

        let lastError = null;

        // 2. Кілттер бойынша цикл (Loop) жасаймыз
        for (const apiKey of apiKeys) {
            try {
                console.log(`Checking key: ...${apiKey?.slice(-4)}`); // Лог үшін (қауіпсіздік)

                // Тұрақты 1.5-flash моделін қолданған дұрыс (2.5 тегін тарифте жиі бұғатталады)
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

                let prompt = "";
                if (type === 'generate_topic') {
                    prompt = `Сен қазақ тілі мен әдебиеті пәнінен олимпиада тапсырмаларын құрастырушысың. 
                    9-11 сынып оқушыларына арналған эссе тақырыбын ойлап тап. 
                    Тақырып әдеби шығармаларға (Абай жолы, Құлагер, т.б.) немесе заманауи еркін тақырыптарға қатысты болуы керек. 
                    ТЕК тақырыптың атын ғана қайтар.`;
                } else {
                    prompt = `
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
- Оқушыға бағыт-бағдар беретін сарапшы кеңесі.\n\nТапсырма түрі: ${type}\nТақырып: ${question}\nОқушы жауабы: ${answer}\n\nМАҢЫЗДЫ: Әр критерийге толық тоқталып, аргументтер келтір. Жауапты соңына дейін аяқта.
                    `;
                }

                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 8192,
                        }
                    })
                });

                const data = await response.json();

                // 3. Егер қате шықса, тексереміз
                if (data.error) {
                    // Егер лимит бітсе (429 немесе Quota exceeded)
                    if (data.error.code === 429 || data.error.message.toLowerCase().includes('quota')) {
                        console.warn(`Key ...${apiKey?.slice(-4)} limit reached. Switching to next key...`);
                        lastError = "Лимит таусылды";
                        continue; // Келесі кілтке өтеміз (Loop жалғасады)
                    } else {
                        // Басқа қате болса (мысалы, промпт қатесі), тоқтатамыз
                        throw new Error(data.error.message);
                    }
                }

                // 4. Егер сәтті өтсе, бірден жауапты қайтарамыз
                const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (aiText) {
                    return NextResponse.json({ text: aiText });
                }

            } catch (error: any) {
                console.error("Key error:", error.message);
                lastError = error.message;
                // Келесі кілтке өту үшін continue қолдануға болады, немесе loop-тан шығуға болады.
                // Біз желілік қателерде де келесі кілтті байқап көру үшін жалғастырамыз.
                continue;
            }
        }

        // 5. Егер барлық кілттерді тексеріп, ешқайсысы жұмыс істемесе:
        return NextResponse.json({
            error: "Барлық API кілттерінің лимиті таусылды немесе қате шықты.",
            details: lastError
        }, { status: 429 });
    } catch (error: any) {
        return NextResponse.json({
            error: "Серверлік қате",
            details: error.message
        }, { status: 500 });
    }
}