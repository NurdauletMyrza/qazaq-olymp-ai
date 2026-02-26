'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateTaskPage() {
    // Вкладкалар стейті
    const [mainTab, setMainTab] = useState<'literature' | 'language'>('literature');
    const [langTab, setLangTab] = useState<'PHONETICS' | 'LEXICOLOGY' | 'MORPHOLOGY' | 'SYNTAX'>('PHONETICS');

    // Тапсырманың жалпы аты
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Әдебиет: 10 сұрақ
    const [literatureTasks, setLiteratureTasks] = useState(
        Array.from({ length: 10 }, () => ({ question: '', expectedAnswer: '' }))
    );

    // Тіл (Фонетика, Морфология т.б. үшін ортақ)
    const [languageContent, setLanguageContent] = useState({ question: '', expectedAnswer: '' });

    // Фонетикадағы ИИ генерациясына арналған сөздер тізімі (алдыңғы жасағанымыз)
    const [phoneticWords, setPhoneticWords] = useState<string[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Фонетика логикасы
    const handleAddWord = () => {
        if (!currentWord.trim()) return;
        const newWords = [...phoneticWords, currentWord.trim()];
        setPhoneticWords(newWords);
        setCurrentWord('');
        setLanguageContent({
            ...languageContent,
            question: `Берілген сөздерге фонетикалық талдау жасаңыз:\n${newWords.join(', ')}`
        });
    };

    const generatePhoneticsAnswer = async () => {
        if (phoneticWords.length === 0) return alert("Алдымен сөздерді қосыңыз!");
        setIsGenerating(true);
        try {
            const res = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'generate_phonetics', question: phoneticWords.join(', '), answer: '' }),
            });
            const data = await res.json();
            setLanguageContent({ ...languageContent, expectedAnswer: data.text });
        } catch (error) {
            alert("ИИ жауап бере алмады.");
        }
        setIsGenerating(false);
    };

    // Базаға сақтау
    const handleSave = async () => {
        if (!title.trim()) return alert("Тапсырманың атын жазыңыз!");

        setIsSubmitting(true);

        // Қай бөлім таңдалды, соған қарай деректерді жинаймыз
        const payload = {
            title,
            category: mainTab === 'literature' ? 'LITERATURE' : langTab,
            content: mainTab === 'literature' ? literatureTasks : [languageContent]
        };

        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("✅ Тапсырма сәтті сақталды!");
                setTitle(''); // Сақтап болған соң тазарту
            } else {
                const data = await res.json();
                alert("Қате: " + data.error);
            }
        } catch (error) {
            alert("Сервермен байланыс үзілді.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900">Жаңа тапсырма қосу</h1>
                    <Link href="/" className="text-blue-600 font-bold hover:underline">← Басты бетке</Link>
                </div>

                {/* НЕГІЗГІ Вкладкалар */}
                <div className="flex gap-4 mb-8 bg-slate-100 p-2 rounded-2xl">
                    <button
                        onClick={() => setMainTab('literature')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${mainTab === 'literature' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        📚 Қазақ әдебиеті
                    </button>
                    <button
                        onClick={() => setMainTab('language')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all ${mainTab === 'language' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        🗣️ Қазақ тілі
                    </button>
                </div>

                {/* Тапсырма атауы */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Тапсырманың атауы</label>
                    <input
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none font-medium"
                        placeholder={mainTab === 'literature' ? "Мысалы: Абай жолы, 1-тарау (10 сұрақ)" : "Мысалы: 9-сынып. Фонетикалық талдау"}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* ҚАЗАҚ ӘДЕБИЕТІ БӨЛІМІ */}
                {mainTab === 'literature' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800">Ашық сұрақтар (10 сұрақ)</h2>
                        {literatureTasks.map((item, index) => (
                            <div key={index} className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="font-bold text-blue-800 mb-3">{index + 1}-сұрақ</h3>
                                <input
                                    className="w-full p-3 mb-3 border border-slate-300 rounded-lg outline-none bg-white"
                                    placeholder="Сұрақ мәтіні..."
                                    value={item.question}
                                    onChange={(e) => {
                                        const newLit = [...literatureTasks];
                                        newLit[index].question = e.target.value;
                                        setLiteratureTasks(newLit);
                                    }}
                                />
                                <textarea
                                    className="w-full p-3 h-24 border border-slate-300 rounded-lg outline-none bg-white resize-none"
                                    placeholder="Мұғалімнің күтілетін жауабы (ИИ осыған қарап бағалайды)..."
                                    value={item.expectedAnswer}
                                    onChange={(e) => {
                                        const newLit = [...literatureTasks];
                                        newLit[index].expectedAnswer = e.target.value;
                                        setLiteratureTasks(newLit);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* ҚАЗАҚ ТІЛІ БӨЛІМІ */}
                {mainTab === 'language' && (
                    <div>
                        {/* Тілдің ішкі вкладкалары */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {['PHONETICS', 'LEXICOLOGY', 'MORPHOLOGY', 'SYNTAX'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setLangTab(tab as any); setLanguageContent({question: '', expectedAnswer: ''}) }}
                                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all border-2 ${langTab === tab ? 'border-green-600 bg-green-50 text-green-700' : 'border-slate-200 text-slate-500 hover:border-green-300'}`}
                                >
                                    {tab === 'PHONETICS' ? 'Фонетика' : tab === 'LEXICOLOGY' ? 'Лексика' : tab === 'MORPHOLOGY' ? 'Морфология' : 'Синтаксис'}
                                </button>
                            ))}
                        </div>

                        {/* Тіл тапсырмасын енгізу */}
                        <div className="bg-green-50/30 p-6 rounded-2xl border border-green-100">

                            {/* Егер Фонетика болса, ИИ генерациясын көрсетеміз */}
                            {langTab === 'PHONETICS' && (
                                <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
                                    <p className="text-sm font-bold text-slate-500 mb-3">ИИ көмекшісімен сөздерді қосу:</p>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            className="flex-1 p-2 border border-slate-300 rounded-lg"
                                            placeholder="Сөз жазыңыз..." value={currentWord} onChange={(e) => setCurrentWord(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                                        />
                                        <button onClick={handleAddWord} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Қосу</button>
                                        <button onClick={generatePhoneticsAnswer} className="bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-lg hover:bg-indigo-200">
                                            ✨ ИИ жауап кілтін жасау
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {phoneticWords.map((w, i) => <span key={i} className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold">{w}</span>)}
                                    </div>
                                </div>
                            )}

                            {/* Сұрақ пен Жауап (Барлық бөлімге ортақ) */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-slate-700">Тапсырма шарты / Сұрақ:</label>
                                    <textarea
                                        className="w-full p-4 h-48 mt-2 border border-slate-300 rounded-xl outline-none bg-white resize-none"
                                        placeholder="Мысалы: Төмендегі сөйлемге синтаксистік талдау жасаңыз..."
                                        value={languageContent.question}
                                        onChange={(e) => setLanguageContent({ ...languageContent, question: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-700">ИИ тексеретін жауап кілті:</label>
                                    <textarea
                                        className="w-full p-4 h-48 mt-2 border border-slate-300 rounded-xl outline-none bg-white resize-none"
                                        placeholder="Дұрыс жауапты осында жазыңыз..."
                                        value={languageContent.expectedAnswer}
                                        onChange={(e) => setLanguageContent({ ...languageContent, expectedAnswer: e.target.value })}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="w-full mt-8 bg-slate-900 text-white font-black text-xl py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-lg"
                >
                    {isSubmitting ? 'Сақталуда...' : 'Тапсырманы базаға сақтау'}
                </button>

            </div>
        </div>
    );
}