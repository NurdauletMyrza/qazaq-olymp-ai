'use client';
import { useState } from 'react';
import Link from 'next/link';

// Тапсырмалар базасы (Кейін оны API-дан алатындай жасауға болады)
const tasks = [
    {
        id: 1,
        category: "📚 Әдебиет",
        title: "Бауыржан Момышұлы - «Ұшқан ұя»",
        question: "«Ұшқан ұя» туындысындағы Бауыржанға көп ертегі айтып беретін апасының және әпкелерінің есімін еске түсіріңіз және олардың образына қысқаша сипаттама беріңіз."
    },
    {
        id: 2,
        category: "🗣️ Фонетика",
        title: "Дыбыстық талдау",
        question: "Берілген сөздерге толық фонетикалық талдау жасаңыз (әріп, дыбыс, буын түрлері): \n1. Қиысу\n2. Рия\n3. Тыю\n4. Еру"
    },
    {
        id: 3,
        category: "✍️ Морфология",
        title: "Сөз таптарын талдау",
        question: "Қарамен берілген сөздерге морфологиялық талдау жасаңыз:\n«Тастақ жер, қалмасын білді, батырсымақтанып, жасырақ еді»."
    },
    {
        id: 4,
        category: "🔗 Синтаксис",
        title: "Сөйлем мүшелерін талдау",
        question: "Берілген сөйлемге синтаксистік талдау жасаңыз (Сөздердің байланысу тәсілдері, сөйлем түрлері, сөйлем мүшелері):\n«Сонау Адам ата заманынан бері қарай бір елдің өнегесіне бір ел ортақ боп келген»."
    },
    {
        id: 5,
        category: "📜 Мәтінмен жұмыс",
        title: "Стильді анықтау",
        question: "Төмендегі үзіндінің стилін анықтап, дәлелдеңіз:\n«Қазір дүние жүзі жаңа тарихи дәуірге қадам басты. Жасанды интеллектінің қарқынды дамуы қазірдің өзінде халықтың мінез-құлқына әсер етіп жатыр.»"
    }
];

export default function OlympiadPage() {
    const [selectedTask, setSelectedTask] = useState(tasks[0]);
    const [answer, setAnswer] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        if (answer.trim().length < 5) {
            alert("Жауабыңыз тым қысқа!");
            return;
        }

        setLoading(true);
        setResult('');

        try {
            const res = await fetch('/api/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: selectedTask.question, // Таңдалған сұрақ
                    answer: answer,
                    type: 'olympiad' // API-ге бұл 2-тур екенін айтамыз
                }),
            });

            const data = await res.json();
            setResult(data.text || "Қате орын алды");
        } catch (error) {
            setResult("Сервермен байланыс үзілді. Қайта көріңіз.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Навигация */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition">
                        ← Басты бетке
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 font-heading">2-тур: Теориялық дайындық</h1>
                </div>

                <div className="grid md:grid-cols-12 gap-6">

                    {/* СОЛ ЖАҚ: Тапсырмалар тізімі */}
                    <div className="md:col-span-4 space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Тапсырма түрлері</h3>
                        {tasks.map((task) => (
                            <button
                                key={task.id}
                                onClick={() => {
                                    setSelectedTask(task);
                                    setAnswer('');
                                    setResult('');
                                }}
                                className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${
                                    selectedTask.id === task.id
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                                }`}
                            >
                                <div className="text-xs font-bold opacity-80 mb-1">{task.category}</div>
                                <div className="font-bold">{task.title}</div>
                            </button>
                        ))}
                    </div>

                    {/* ОҢ ЖАҚ: Жұмыс аймағы */}
                    <div className="md:col-span-8">
                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8">

                            {/* Сұрақ блогы */}
                            <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold mb-3">
                  {selectedTask.category}
                </span>
                                <h2 className="text-xl font-bold text-slate-900 mb-4 font-heading">{selectedTask.question}</h2>
                                <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                            </div>

                            {/* Жауап жазу алаңы */}
                            <textarea
                                className="w-full h-64 p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none text-lg leading-relaxed mb-4"
                                placeholder="Жауабыңызды осында жазыңыз... (Талдауды толық жазуға тырысыңыз)"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />

                            {/* Батырма */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleCheck}
                                    disabled={loading}
                                    className={`px-8 py-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
                                        loading
                                            ? 'bg-slate-400 cursor-not-allowed'
                                            : 'bg-slate-900 hover:bg-blue-600 shadow-lg'
                                    }`}
                                >
                                    {loading ? 'Сарапталуда...' : 'Жауапты тексеру'}
                                </button>
                            </div>

                            {/* Нәтиже блогы */}
                            {result && (
                                <div className="mt-8 pt-8 border-t-2 border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                        🤖 ИИ Сараптамасы:
                                    </h3>
                                    <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-slate-700 prose prose-sm max-w-none whitespace-pre-wrap">
                                        {result}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}