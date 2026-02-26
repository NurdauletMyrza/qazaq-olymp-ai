'use client';
import { useState, useEffect } from 'react';

export default function NamePrompt() {
    const [name, setName] = useState('');
    const [showPrompt, setShowPrompt] = useState(false);

    // Бет ашылғанда localStorage-тан есімді іздейміз
    useEffect(() => {
        const savedName = localStorage.getItem('studentName');
        if (!savedName) {
            setShowPrompt(true); // Егер жоқ болса, терезені көрсетеміз
        }
    }, []);

    const handleSave = () => {
        if (name.trim().length > 2) {
            localStorage.setItem('studentName', name.trim());
            setShowPrompt(false); // Сақтаған соң терезені жабамыз
        } else {
            alert("Толық аты-жөніңізді жазыңыз!");
        }
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="text-4xl mb-4">👋</div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Қош келдіңіз!</h2>
                <p className="text-slate-500 mb-6 leading-relaxed">
                    Тапсырмалар мен эссе нәтижелері мұғалімге дұрыс жіберілуі үшін, өз аты-жөніңізді жазыңыз.
                </p>

                <input
                    type="text"
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none mb-4 font-bold text-slate-900 placeholder:text-slate-400"
                    placeholder="Мысалы: Асан Үсенов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                >
                    Сақтау және Бастау
                </button>
            </div>
        </div>
    );
}