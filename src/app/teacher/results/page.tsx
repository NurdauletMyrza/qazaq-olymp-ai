'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ResultsDashboard() {
    const [activeTab, setActiveTab] = useState<'theory' | 'essay'>('theory');

    const [theoryResults, setTheoryResults] = useState<any[]>([]);
    const [essayResults, setEssayResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState<any>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('/api/results');
                if (res.ok) {
                    const data = await res.json();
                    setTheoryResults(data.theoryResults);
                    setEssayResults(data.essayResults);
                }
            } catch (error) {
                console.error("Қате:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    // Вкладка ауысқанда таңдалған оқушыны тазарту
    const handleTabSwitch = (tab: 'theory' | 'essay') => {
        setActiveTab(tab);
        setSelectedResult(null);
    };

    const currentData = activeTab === 'theory' ? theoryResults : essayResults;

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-sans">
            <div className="max-w-6xl mx-auto">

                <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">📊 Оқушылардың нәтижелері</h1>
                    </div>
                    <Link href="/" className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all">
                        Басты бетке
                    </Link>
                </div>

                {/* Вкладкалар */}
                <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                    <button
                        onClick={() => handleTabSwitch('theory')}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all text-lg ${activeTab === 'theory' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-blue-50'}`}
                    >
                        📚 Теория (Сұрақ-жауап)
                    </button>
                    <button
                        onClick={() => handleTabSwitch('essay')}
                        className={`flex-1 py-4 rounded-xl font-bold transition-all text-lg ${activeTab === 'essay' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50'}`}
                    >
                        ✍️ Эссе жұмыстары
                    </button>
                </div>

                {loading ? (
                    <div className="text-center p-12 text-slate-500 animate-pulse font-bold text-lg">Жүктелуде...</div>
                ) : currentData.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-500">
                        Бұл бөлімде әзірге нәтижелер жоқ.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">

                        {/* Сол жақ: Тізім */}
                        <div className="md:col-span-1 space-y-3 h-[70vh] overflow-y-auto pr-2">
                            {currentData.map((res: any) => (
                                <button
                                    key={res.id}
                                    onClick={() => setSelectedResult(res)}
                                    className={`w-full text-left p-5 rounded-2xl transition-all border-2 ${
                                        selectedResult?.id === res.id
                                            ? activeTab === 'theory' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                                    }`}
                                >
                                    <div className="font-black text-lg mb-1">{res.studentName}</div>
                                    <div className={`text-sm mb-2 line-clamp-2 ${selectedResult?.id === res.id ? 'text-white/80' : 'text-slate-500'}`}>
                                        {activeTab === 'theory' ? res.task?.title : res.topic}
                                    </div>
                                    <div className={`text-xs font-bold inline-block px-2 py-1 rounded-md ${
                                        selectedResult?.id === res.id ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {new Date(res.createdAt).toLocaleDateString('kk-KZ', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Оң жақ: Толық көру */}
                        <div className="md:col-span-2">
                            {selectedResult ? (
                                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sticky top-6 max-h-[85vh] overflow-y-auto">
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedResult.studentName}</h2>
                                    <div className={`font-bold mb-6 pb-6 border-b border-slate-100 ${activeTab === 'theory' ? 'text-blue-600' : 'text-indigo-600'}`}>
                                        {activeTab === 'theory' ? `Тапсырма: ${selectedResult.task?.title}` : `Эссе тақырыбы: ${selectedResult.topic}`}
                                    </div>

                                    {/* Эссе болса, алдымен оқушының жазған мәтінін көрсетеміз */}
                                    {activeTab === 'essay' && (
                                        <div className="mb-8">
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Оқушының жазған эссесі:</h3>
                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 whitespace-pre-wrap italic">
                                                {selectedResult.essayText}
                                            </div>
                                        </div>
                                    )}

                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">🤖 ИИ Сараптамасы:</h3>
                                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100 whitespace-pre-wrap text-slate-800 prose prose-blue max-w-none">
                                        {selectedResult.details}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl border border-slate-200 border-dashed flex items-center justify-center h-full min-h-[400px] text-slate-400 font-medium">
                                    Толық көру үшін сол жақтан оқушыны таңдаңыз
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}