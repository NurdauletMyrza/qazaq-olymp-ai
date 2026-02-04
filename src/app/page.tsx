import Link from 'next/link';

export default function Home() {
  return (
      <div className="min-h-screen bg-[#f8fafc]">
        {/* Навигациялық жолақ */}
        <nav className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇰🇿</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">Qazaq Olymp AI</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/essay" className="hover:text-blue-600 transition">Эссе</Link>
            <Link href="/olympiad" className="hover:text-blue-600 transition">2-тур (Талдау)</Link>
          </div>
        </nav>

        {/* Hero Section (Басты блок) */}
        <header className="relative py-20 px-6 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
            {/* Қазақ ұлттық ою-өрнегінің фоны (символикалық) */}
            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')]"></div>
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 rounded-full">
            2025-2026 Олимпиада маусымы
          </span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Қазақ тілі мен әдебиетінен <span className="text-blue-600">Олимпиадаға</span> дайындал
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Эссе жазып, лингвистикалық талдау жасауды үйрен.
              Республикалық олимпиада критерийлері бойынша жылдам баға ал.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/essay" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-1">
                Эссе жазуды бастау
              </Link>
              <Link href="/olympiad" className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all transform hover:-translate-y-1">
                Теориялық кезеңге дайындалу
              </Link>
            </div>
          </div>
        </header>

        {/* Негізгі функциялар (Cards) */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">✍️</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Интеллектуалды Эссе</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                9-11 сынып тақырыптары бойынша эссе жазыңыз. ИИ 50 ұпайлық жүйемен бағалап, қатеңізді түзетеді.
              </p>
              <Link href="/essay" className="text-orange-600 font-bold text-sm hover:underline italic">Сынап көру →</Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">🔍</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Тілдік талдау</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Фонетикалық, морфологиялық және синтаксистік талдау тапсырмаларын орындап, бірден жауабын біліңіз.
              </p>
              <Link href="/olympiad" className="text-blue-600 font-bold text-sm hover:underline italic">Тапсырмаларға өту →</Link>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition">📚</div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Әдебиет білгірі</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                «Абай жолы», «Ұшқан ұя» және басқа да классикалық шығармалар бойынша сұрақтарға жауап беріңіз.
              </p>
              <Link href="/olympiad" className="text-green-600 font-bold text-sm hover:underline italic">Талдау жасау →</Link>
            </div>

          </div>
        </section>

        {/* Статистика немесе Критерийлер блогы */}
        <section className="bg-slate-900 text-white py-16 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 italic">Ресми бағалау критерийлері</h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px]">✓</span>
                  Мазмұны мен құрылымы (10 ұпай)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px]">✓</span>
                  Дәлелдемелер мен тұжырымдар (10 ұпай)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px]">✓</span>
                  Тілдік сауаттылық (10 ұпай)
                </li>
              </ul>
            </div>
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <p className="text-4xl font-black text-blue-400 mb-2">50</p>
              <p className="text-slate-400">Жинауға болатын ең жоғары ұпай</p>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-slate-400 text-sm">
          <p>© 2026 Qazaq Olymp AI. Олимпиадаға қатысушыларға көмекші құрал.</p>
        </footer>
      </div>
  );
}