'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OlympiadPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);

    // НЕГІЗГІ Вкладкалар стейті
    const [mainTab, setMainTab] = useState<'literature' | 'language'>('literature');

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [result, setResult] = useState('');
    const [checking, setChecking] = useState(false);

    // 1. Бет ашылғанда базадан тапсырмаларды жүктеп алу
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/tasks');
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data);
                }
            } catch (error) {
                console.error("Қате:", error);
            } finally {
                setLoadingTasks(false);
            }
        };
        fetchTasks();
    }, []);

    // 2. Таңдалған вкладкаға байланысты тапсырмаларды сүзгілеу (фильтр)
    const filteredTasks = tasks.filter(task =>
        mainTab === 'literature'
            ? task.category === 'LITERATURE'
            : task.category !== 'LITERATURE' // Яғни: Phonetics, Morphology, Syntax, Lexicology
    );

    // Вкладка ауысқан сайын, сол бөлімдегі бірінші тапсырманы автоматты ашу
    useEffect(() => {
        if (filteredTasks.length > 0) {
            handleSelectTask(filteredTasks[0]);
        } else {
            setSelectedTask(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mainTab, tasks]);

    // Тапсырманы таңдау функциясы
    const handleSelectTask = (task: any) => {
        setSelectedTask(task);
        setAnswers(Array(task.content.length).fill(''));
        setResult('');
    };

    const handleAnswerChange = (text: string, index: number) => {
        const newAnswers = [...answers];
        newAnswers[index] = text;
        setAnswers(newAnswers);
    };

    const handleCheck = async () => {
        setChecking(true);
        setResult('');

        // 1. Сұрақтарды 5-тен бөлуге арналған логика (Chunking)
        const CHUNK_SIZE = 5;
        const chunks = [];

        for (let i = 0; i < selectedTask.content.length; i += CHUNK_SIZE) {
            chunks.push({
                content: selectedTask.content.slice(i, i + CHUNK_SIZE),
                answers: answers.slice(i, i + CHUNK_SIZE),
                startIndex: i // Сұрақ нөмірлері дұрыс (6, 7, 8...) болып жалғасуы үшін
            });
        }

        try {
            // 2. Әр бөлікке жеке сұраныс дайындау (Параллельді жіберу үшін)
            const checkPromises = chunks.map(async (chunk) => {
                let combinedPrompt = `Сен олимпиада сарапшысысың. Төмендегі сұрақтарды мұғалімнің жауап кілтімен салыстырып, оқушыны бағала.\n\n`;

                chunk.content.forEach((item: any, idx: number) => {
                    const realQuestionNumber = chunk.startIndex + idx + 1;
                    combinedPrompt += `Сұрақ ${realQuestionNumber}: ${item.question}\n`;
                    combinedPrompt += `Мұғалімнің күтілетін жауабы (Дұрыс кілт): ${item.expectedAnswer}\n`;
                    combinedPrompt += `Оқушының жауабы: ${chunk.answers[idx] || 'Жауап берілмеді'}\n\n`;
                });

                const res = await fetch('/api/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'theory_check', question: combinedPrompt, answer: '' }),
                });

                if (!res.ok) throw new Error("API қатесі");
                const data = await res.json();
                return data.text;
            });

            // 3. БАРЛЫҚ сұраныстардың жауабын бір уақытта күту (Өте жылдам болады)
            const results = await Promise.all(checkPromises);

            // 4. Келген 2 немесе одан да көп жауаптарды біріктіріп, экранға шығару
            const finalResult = results.join('\n\n➖➖➖➖➖➖➖➖➖➖➖➖\n\n');
            setResult(finalResult);

            const savedName = localStorage.getItem('studentName') || 'Аты-жөні белгісіз оқушы';
            await fetch('/api/results', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'theory',
                    studentName: savedName,
                    details: finalResult,
                    taskId: selectedTask.id
                })
            });
        } catch (error) {
            setResult("Сервермен байланыс үзілді немесе қате орын алды.");
        }
        setChecking(false);
    };

    // Категорияны әдемілеп шығаруға арналған көмекші функция
    const getCategoryName = (cat: string) => {
        const categories: Record<string, string> = {
            LITERATURE: '📚 Қазақ әдебиеті',
            PHONETICS: '🗣️ Фонетика',
            MORPHOLOGY: '✍️ Морфология',
            SYNTAX: '🔗 Синтаксис',
            LEXICOLOGY: '📖 Лексика'
        };
        return categories[cat] || cat;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Навигация */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition">
                        ← Басты бетке
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900">2-тур: Теориялық дайындық</h1>
                </div>

                {/* НЕГІЗГІ Вкладкалар (Оқушы таңдайды) */}
                <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                    <button
                        onClick={() => setMainTab('literature')}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all text-lg ${mainTab === 'literature' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-blue-50'}`}
                    >
                        📚 Қазақ әдебиеті
                    </button>
                    <button
                        onClick={() => setMainTab('language')}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all text-lg ${mainTab === 'language' ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:bg-green-50'}`}
                    >
                        🗣️ Қазақ тілі
                    </button>
                </div>

                <div className="grid md:grid-cols-12 gap-6">

                    {/* СОЛ ЖАҚ: Тапсырмалар тізімі */}
                    <div className="md:col-span-4 space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                            {mainTab === 'literature' ? 'Әдебиет тапсырмалары' : 'Тіл тапсырмалары'}
                        </h3>

                        {loadingTasks ? (
                            <div className="p-4 text-center text-slate-500 animate-pulse">Жүктелуде...</div>
                        ) : filteredTasks.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
                                Бұл бөлімде әзірге тапсырмалар жоқ. Мұғалім қосқан кезде осында пайда болады.
                            </div>
                        ) : (
                            filteredTasks.map((task) => (
                                <button
                                    key={task.id}
                                    onClick={() => handleSelectTask(task)}
                                    className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
                                        selectedTask?.id === task.id
                                            ? mainTab === 'literature'
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="text-xs font-bold opacity-80 mb-1">{getCategoryName(task.category)}</div>
                                    <div className="font-bold text-lg">{task.title}</div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* ОҢ ЖАҚ: Таңдалған тапсырманы орындау аймағы */}
                    <div className="md:col-span-8">
                        {selectedTask && (
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">

                                <div className="mb-6 pb-6 border-b border-slate-100">
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mb-3 ${
                      mainTab === 'literature' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {getCategoryName(selectedTask.category)}
                  </span>
                                    <h2 className="text-2xl font-black text-slate-900">{selectedTask.title}</h2>
                                </div>

                                {/* Сұрақтарды шығару */}
                                <div className="space-y-8">
                                    {selectedTask.content.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-start gap-3 whitespace-pre-wrap">
                        <span className={`text-white w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                            mainTab === 'literature' ? 'bg-blue-600' : 'bg-green-600'
                        }`}>
                          {idx + 1}
                        </span>
                                                {item.question}
                                            </h3>
                                            <textarea
                                                className="w-full h-40 p-5 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                                                placeholder="Оқушы, жауабыңызды осында жазыңыз..."
                                                value={answers[idx] || ''}
                                                onChange={(e) => handleAnswerChange(e.target.value, idx)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleCheck}
                                        disabled={checking}
                                        className={`px-8 py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg ${
                                            checking
                                                ? 'bg-slate-400 cursor-not-allowed'
                                                : mainTab === 'literature' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    >
                                        {checking ? '⏳ ИИ тексеріп жатыр...' : '✨ Жауаптарды тексеру'}
                                    </button>
                                </div>

                                {/* Нәтиже көрсету */}
                                {result && (
                                    <div className="mt-8 pt-8 border-t-2 border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                            🤖 ИИ Сараптамасы (Мұғалімнің кілті негізінде):
                                        </h3>
                                        <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200 text-slate-800 prose prose-blue max-w-none whitespace-pre-wrap">
                                            {result}
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}