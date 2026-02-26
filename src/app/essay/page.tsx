'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Бұл тізімді қалағаныңызша толықтыра аласыз
const topics = [
    "Бұқар жырау толғауларындағы Абылай бейнесі.",
    "Бұқар жырау толғауларындағы Абылай бейнесі.",
    "Бұқар жырау толғауларындағы Абылай бейнесі.",
    "Шақан-Шері мен жолбарыс психологиясын суреттеудегі қаламгер шеберлігі.",
    "Мұхтар Мағауинның \"Шақан-Шері\" романындағы ұлттық мүдде.",
    "Қазіргі қоғамдағы жасанды интеллект: пайдасы мен қатері.",
    "Цифрлы Қазақстан: болашаққа бастар жол.",
    "«Құлагер» поэмасындағы ақын мен халық тағдыры.",
    "Мағжан Жұмабаев поэзиясындағы түрікшілдік сарын.",
];

export default function EssayPage() {
    // Бастапқыда кездейсоқ тақырып тұрғаны дұрыс па, әлде бос па?
    // Қазірше "Тақырып таңдаңыз..." деп қоямыз.
    const [topic, setTopic] = useState("Төмендегі батырмалар арқылы тақырып таңдаңыз 👇");
    const [essay, setEssay] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);

    // 1-ФУНКЦИЯ: Массивтен кездейсоқ таңдау
    const handleRandomTopic = () => {
        const randomIndex = Math.floor(Math.random() * topics.length);
        setTopic(topics[randomIndex]);
        setResult(''); // Алдыңғы нәтижені тазалау
    };

    // 2-ФУНКЦИЯ: ИИ арқылы тақырып жасау
    const generateAiTopic = async () => {
        setIsGeneratingTopic(true);
        try {
            const res = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'generate_topic' }),
            });
            const data = await res.json();
            // ИИ кейде тырнақшамен қайтарады, оны тазалаймыз
            setTopic(data.text.replace(/^"|"$/g, ''));
            setResult('');
        } catch (error) {
            alert("Тақырып ойлап табу мүмкін болмады");
        }
        setIsGeneratingTopic(false);
    };

    const wordCount = essay.trim() === '' ? 0 : essay.trim().split(/\s+/).length;

    const checkEssay = async () => {
        // Тексеру: Егер тақырып таңдалмаған болса
        if (topic.includes("Тақырып таңдаңыз")) {
            alert("Алдымен тақырыпты таңдаңыз!");
            return;
        }

        if (wordCount < 50) {
            alert("Эссе тым қысқа. Кем дегенде 50 сөз жазыңыз.");
            return;
        }

        setLoading(true);
        setResult(''); // Тексеруді бастағанда ескі нәтижені тазалау

        try {
            // 1. ИИ-ге эссені жіберіп, тексерту
            const res = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: topic,
                    answer: essay,
                    type: 'essay'
                }),
            });

            if (!res.ok) throw new Error("API қатесі");

            const data = await res.json();
            setResult(data.text); // ИИ-дің жауабын экранға шығарамыз

            // 2. Деректер базасына сақтау (ТҮЗЕТІЛГЕН БӨЛІМ)
            const savedName = localStorage.getItem('studentName') || 'Аты-жөні белгісіз оқушы';
            await fetch('/api/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'essay',
                    studentName: savedName,
                    topic: topic,      // 👈 ТҮЗЕТІЛДІ: selectedTopic емес, жай ғана topic
                    essayText: essay,  // 👈 ТҮЗЕТІЛДІ: essayText емес, жай ғана essay
                    details: data.text,
                    score: "Тексерілді"
                })
            });

        } catch (error) {
            console.error("Қате:", error);
            setResult("Қате орын алды. Қайта байқап көріңіз.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← Артқа</Link>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                    <h1 className="text-3xl font-black mb-6 text-slate-900">Эссе шеберханасы</h1>

                    {/* Тақырып таңдау блогы */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl text-white mb-8 shadow-lg transition-all">
                        <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-2">Ағымдағы тақырып:</p>

                        <h2 className="text-xl font-medium leading-relaxed min-h-[3rem] flex items-center">
                            {isGeneratingTopic ? (
                                <span className="animate-pulse">✨ ИИ жаңа тақырып іздеп жатыр...</span>
                            ) : (
                                topic
                            )}
                        </h2>

                        {/* Екі батырма: Біреуі массивтен, біреуі ИИ-ден */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            <button
                                onClick={handleRandomTopic}
                                className="flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-sm"
                            >
                                🎲 Тізімнен таңдау
                            </button>

                            <button
                                onClick={generateAiTopic}
                                disabled={isGeneratingTopic}
                                className="flex items-center gap-2 bg-indigo-500/30 hover:bg-indigo-500/50 border border-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold transition-all text-white"
                            >
                                ✨ ИИ тақырып ойлап тапсын
                            </button>
                        </div>
                    </div>

                    {/* Текстік редактор */}
                    <div className="relative group">
                        <textarea
                            className="w-full h-96 p-6 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all resize-none text-lg leading-relaxed shadow-sm group-hover:shadow-md"
                            placeholder="Ойыңызды осында жазыңыз..."
                            value={essay}
                            onChange={(e) => setEssay(e.target.value)}
                        />
                        <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Сөз саны:</span>
                            <span className={`text-sm font-black ${wordCount < 200 ? 'text-orange-500' : 'text-green-600'}`}>
                                {wordCount}
                            </span>
                        </div>
                    </div>

                    {/* ТЕКСЕРУ БАТЫРМАСЫ (ТҮЗЕТІЛДІ) */}
                    <button
                        onClick={checkEssay}
                        disabled={loading}
                        className={`w-full mt-8 py-5 rounded-2xl font-black text-lg text-white transition-all transform active:scale-[0.98] ${
                            loading
                                ? 'bg-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200'
                        }`}
                    >
                        {loading ? '🔍 Сараптама жасалуда...' : 'Нәтижені көру'}
                    </button>
                </div>

                {/* Нәтиже көрсету */}
                {result && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 border border-green-100 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center text-slate-900">
                            <span className="mr-3 text-3xl">📊</span> Сараптама нәтижесі
                        </h2>
                        <div className="prose prose-blue prose-lg max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
                            {result}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}