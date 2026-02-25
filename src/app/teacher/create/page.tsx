'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateVariantPage() {
    const [title, setTitle] = useState('');
    // НОВЫЕ СТЕЙТЫ ДЛЯ ФОНЕТИКИ
    const [phoneticWords, setPhoneticWords] = useState<string[]>([]);
    const [currentWord, setCurrentWord] = useState('');
    const [isGeneratingPhonetics, setIsGeneratingPhonetics] = useState(false);

    // Функция добавления слова
    const handleAddWord = () => {
        if (!currentWord.trim()) return;

        const updatedWords = [...phoneticWords, currentWord.trim()];
        setPhoneticWords(updatedWords);
        setCurrentWord('');

        // Автоматически обновляем текст вопроса
        updateLanguage('phonetics', 'question', `Берілген сөздерге фонетикалық талдау жасаңыз, әріп пен дыбыс санын, дыбыстардың, буынның түрлерін анықтаңыз:\n${updatedWords.join(', ')}`);
    };

    // Удаление слова из списка
    const handleRemoveWord = (indexToRemove: number) => {
        const updatedWords = phoneticWords.filter((_, index) => index !== indexToRemove);
        setPhoneticWords(updatedWords);
        updateLanguage('phonetics', 'question', `Берілген сөздерге фонетикалық талдау жасаңыз:\n${updatedWords.join(', ')}`);
    };

    // Генерация правильного ответа через ИИ
    const generatePhoneticsAnswer = async () => {
        if (phoneticWords.length === 0) return alert("Алдымен сөздерді қосыңыз!");

        setIsGeneratingPhonetics(true);
        try {
            const res = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'generate_phonetics', // Нам нужно будет добавить этот тип в наш API
                    question: phoneticWords.join(', '),
                    answer: ''
                }),
            });
            const data = await res.json();
            updateLanguage('phonetics', 'expectedAnswer', data.text);
        } catch (error) {
            alert("Қате шықты. ИИ жауап бере алмады.");
        }
        setIsGeneratingPhonetics(false);
    };

    // Қазақ әдебиеті: 10 сұрақ
    const [literature, setLiterature] = useState(
        Array.from({ length: 10 }, () => ({ question: '', expectedAnswer: '' }))
    );

    // Қазақ тілі: 4 бөлім
    const [language, setLanguage] = useState({
        phonetics: { question: '', expectedAnswer: '' },
        morphology: { question: '', expectedAnswer: '' },
        syntax: { question: '', expectedAnswer: '' },
        lexicology: { question: '', expectedAnswer: '' },
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Әдебиет сұрақтарын жаңарту функциясы
    const updateLiterature = (index: number, field: 'question' | 'expectedAnswer', value: string) => {
        const newLit = [...literature];
        newLit[index][field] = value;
        setLiterature(newLit);
    };

    // Тіл сұрақтарын жаңарту функциясы
    const updateLanguage = (section: keyof typeof language, field: 'question' | 'expectedAnswer', value: string) => {
        setLanguage({
            ...language,
            [section]: { ...language[section], [field]: value }
        });
    };

    // Базаға сақтау функциясы
    const handleSave = async () => {
        if (!title.trim()) {
            alert("Өтініш, нұсқаның атын жазыңыз!");
            return;
        }

        setIsSubmitting(true);
        const payload = { title, literature, language };

        try {
            // Жаңа жасаған API-ге сұраныс жібереміз
            const res = await fetch('/api/variants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("✅ Нұсқа деректер базасына сәтті сақталды!");
                // Қаласаңыз, сақтаған соң бетті тазартуға немесе басты бетке қайтаруға болады
                // window.location.href = "/";
            } else {
                const data = await res.json();
                alert("Қате шықты: " + data.error);
            }
        } catch (error) {
            alert("Сервермен байланыс үзілді. Қайта көріңіз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-slate-900">Жаңа Олимпиада нұсқасын құру</h1>
                    <Link href="/" className="text-blue-600 font-bold hover:underline">← Басты бетке</Link>
                </div>

                {/* Нұсқа атауы */}
                <div className="mb-10">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Нұсқа атауы (Сынып, нөмірі)</label>
                    <input
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none font-medium"
                        placeholder="Мысалы: 9-сынып. Облыстық кезең (1-нұсқа)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* 1-КЕЗЕҢ: ҚАЗАҚ ӘДЕБИЕТІ */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold bg-blue-600 text-white p-4 rounded-xl mb-6">1-кезең: Қазақ әдебиеті (10 сұрақ)</h2>
                    <p className="text-sm text-slate-500 mb-4">Әр сұрақты және ИИ тексеруге негіз болатын "күтілетін жауапты" енгізіңіз.</p>

                    <div className="space-y-6">
                        {literature.map((item, index) => (
                            <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-3">{index + 1}-сұрақ</h3>
                                <input
                                    className="w-full p-3 mb-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                                    placeholder="Сұрақ мәтіні..."
                                    value={item.question}
                                    onChange={(e) => updateLiterature(index, 'question', e.target.value)}
                                />
                                <textarea
                                    className="w-full p-3 h-24 border border-slate-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                                    placeholder="Мұғалімнің күтілетін жауабы (ИИ осыған қарап бағалайды)..."
                                    value={item.expectedAnswer}
                                    onChange={(e) => updateLiterature(index, 'expectedAnswer', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2-КЕЗЕҢ: ҚАЗАҚ ТІЛІ */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 md:col-span-2">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🗣️</span> Фонетикалық талдау
                    </h3>

                    <div className="flex gap-3 mb-4">
                        <input
                            type="text"
                            className="flex-1 p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                            placeholder="Талдауға сөз жазыңыз (мысалы: Қиысу)"
                            value={currentWord}
                            onChange={(e) => setCurrentWord(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddWord()}
                        />
                        <button
                            onClick={handleAddWord}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Сөз қосу
                        </button>
                    </div>

                    {/* Список добавленных слов (Тэги) */}
                    {phoneticWords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded-lg border border-slate-200">
                            {phoneticWords.map((word, idx) => (
                                <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 border border-blue-200">
                      {word}
                                    <button onClick={() => handleRemoveWord(idx)} className="text-blue-400 hover:text-red-500">×</button>
                    </span>
                            ))}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Оқушыға көрінетін сұрақ:</label>
                            <textarea
                                className="w-full p-3 mt-1 h-32 border border-slate-300 rounded-lg outline-none bg-white"
                                placeholder="Сұрақ автоматты түрде құралады..."
                                value={language.phonetics.question}
                                onChange={(e) => updateLanguage('phonetics', 'question', e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">ИИ тексеретін жауап кілті:</label>
                                <button
                                    onClick={generatePhoneticsAnswer}
                                    disabled={isGeneratingPhonetics || phoneticWords.length === 0}
                                    className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 transition disabled:opacity-50"
                                >
                                    {isGeneratingPhonetics ? '⏳ Жасалуда...' : '✨ ИИ арқылы кілтті жасау'}
                                </button>
                            </div>
                            <textarea
                                className="w-full p-3 h-32 border border-slate-300 rounded-lg outline-none bg-white"
                                placeholder="Мұғалімнің күтілетін жауабы..."
                                value={language.phonetics.expectedAnswer}
                                onChange={(e) => updateLanguage('phonetics', 'expectedAnswer', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Сақтау батырмасы */}
                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white font-black text-xl py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-lg"
                >
                    {isSubmitting ? 'Сақталуда...' : 'Нұсқаны базаға сақтау'}
                </button>

            </div>
        </div>
    );
}