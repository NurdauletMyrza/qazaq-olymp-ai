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
    const [topic, setTopic] = useState("Тақырып таңдаңыз немесе ИИ-ге сеніп тапсырыңыз");
    const [essay, setEssay] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);

    const generateAiTopic = async () => {
        setIsGeneratingTopic(true);
        try {
            const res = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'generate_topic' }),
            });
            const data = await res.json();
            setTopic(data.text);
            setResult('');
        } catch (error) {
            alert("Тақырып ойлап табу мүмкін болмады");
        }
        setIsGeneratingTopic(false);
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

    return (<div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">← Артқа</Link>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                    <h1 className="text-3xl font-black mb-6 text-slate-900">Эссе шеберханасы</h1>

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl text-white mb-8 shadow-lg">
                        <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-2">Ағымдағы тақырып:</p>
                        <h2 className="text-xl font-medium leading-relaxed">
                            {isGeneratingTopic ? "✨ ИИ жаңа тақырып іздеп жатыр..." : topic}
                        </h2>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={generateAiTopic}
                                disabled={isGeneratingTopic}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold transition-all border border-white/10"
                            >
                                ✨ ИИ тақырып ойлап тапсын
                            </button>
                        </div>
                    </div>

                    {/* Текстік редактор бөлімі */}
                    <div className="relative group">
                        <textarea
                            className="w-full h-96 p-6 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none transition-all resize-none text-lg leading-relaxed shadow-sm group-hover:shadow-md"
                            placeholder="Ойыңызды осында жазыңыз..."
                            value={essay}
                            onChange={(e) => setEssay(e.target.value)}
                        />
                        <div className="absolute bottom-6 right-6 flex items-center gap-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Сөз саны:</span>
                            <span className={`text-sm font-black ${essay.split(/\s+/).length < 200 ? 'text-orange-500' : 'text-green-600'}`}>
                                {essay.trim() === '' ? 0 : essay.trim().split(/\s+/).length}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => {/* checkEssay функциясын шақыру */}}
                        className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all transform active:scale-[0.98]"
                    >
                        {loading ? '🔍 Сараптама жасалуда...' : 'Нәтижені көру'}
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