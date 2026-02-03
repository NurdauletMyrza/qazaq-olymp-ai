'use client';
import { useState } from 'react';
import Link from 'next/link';

const topics = [
    "«Абай жолы» роман-эпопеясындағы ұлттық құндылықтардың көрінісі.",
    "Қазіргі қоғамдағы жасанды интеллект: пайдасы мен қатері.",
    "Ана тілі - ұлттың басты байлығы: менің көзқарасым.",
    "Шәкәрім Құдайбердіұлының «Үш анық» шығармасындағы ар-ұят мәселесі.",
    "Цифрлы Қазақстан: болашаққа бастар жол."
];

export default function EssayPage() {
    const [topic, setTopic] = useState(topics[0]);
    const [essay, setEssay] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const generateTopic = () => {
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        setTopic(randomTopic);
        setResult('');
    };

    const wordCount = essay.trim() === '' ? 0 : essay.trim().split(/\s+/).length;

    const checkEssay = async () => {
        if (wordCount < 50) {
            alert("Эссе тым қысқа. Кем дегенде 50 сөз жазыңыз.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: topic,
                    answer: essay,
                    type: 'essay'
                }),
            });
            const data = await res.json();
            setResult(data.text);
        } catch (error) {
            setResult("Қате орын алды. Қайта байқап көріңіз.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← Басқы бетке оралу</Link>

                <div className="bg-white rounded-2xl shadow-sm p-6 border mb-6">
                    <h1 className="text-2xl font-bold mb-4">Эссе жазу тренажеры</h1>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                        <p className="text-sm text-blue-600 font-semibold mb-1">Таңдалған тақырып:</p>
                        <p className="text-lg font-medium text-slate-800">{topic}</p>
                        <button
                            onClick={generateTopic}
                            className="mt-3 text-sm bg-white border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
                        >
                            🔄 Басқа тақырып
                        </button>
                    </div>

                    <div className="relative">
            <textarea
                className="w-full h-80 p-5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none shadow-inner"
                placeholder="Эссеңізді осында бастаңыз..."
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
            />
                        <div className="absolute bottom-4 right-4 text-sm font-mono text-slate-400">
                            Сөз саны: <span className={wordCount < 200 ? 'text-orange-500' : 'text-green-600'}>{wordCount}</span>
                        </div>
                    </div>

                    <button
                        onClick={checkEssay}
                        disabled={loading}
                        className={`w-full mt-6 py-4 rounded-xl font-bold text-white transition-all ${
                            loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                        }`}
                    >
                        {loading ? 'ИИ тексеріп жатыр...' : 'Тексеруге жіберу'}
                    </button>
                </div>

                {result && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-green-100 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                            <span className="mr-2">📊</span> ИИ Нәтижесі мен Талдау
                        </h2>
                        <div className="prose prose-blue max-w-none whitespace-pre-wrap text-slate-700">
                            {result}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}