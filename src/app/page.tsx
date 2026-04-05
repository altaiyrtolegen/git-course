"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Scale,
  FileSearch,
  GitBranch,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Layers,
  BarChart3,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

const features = [
  {
    icon: FileSearch,
    title: "Анализ содержания",
    description:
      "Извлекает ключевые нормы, устанавливает связи между документами и отслеживает изменения между редакциями.",
  },
  {
    icon: AlertTriangle,
    title: "Выявление проблем",
    description:
      "Автоматически обнаруживает противоречия, дублирование норм и устаревшие положения в правовом массиве.",
  },
  {
    icon: GitBranch,
    title: "Граф связей",
    description:
      "Визуализирует взаимосвязи между законами в виде интерактивного графа с цветовой кодировкой статусов.",
  },
  {
    icon: Lightbulb,
    title: "Explainability",
    description:
      "Объясняет причину каждой помеченной нормы: конкретная статья, механизм противоречия, правовой контекст.",
  },
];

const steps = [
  {
    num: "01",
    title: "Загрузите документ",
    desc: "Вставьте текст нормативного акта или его фрагмент в текстовое поле.",
  },
  {
    num: "02",
    title: "Запустите аудит",
    desc: "ИИ анализирует документ и сопоставляет его с базой нормативных актов.",
  },
  {
    num: "03",
    title: "Изучите результаты",
    desc: "Получите структурированный отчёт с объяснениями и графом связей.",
  },
];

const stats = [
  { value: "12 400+", label: "НПА в базе" },
  { value: "98.3%", label: "Точность" },
  { value: "< 8 сек", label: "Время анализа" },
  { value: "340+", label: "Пользователей" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-[#0D2B25] relative overflow-x-hidden">
      <Navbar />

      {/* Background Logo */}
      <div className="absolute top-0 right-0 w-full h-full max-h-[1000px] pointer-events-none select-none z-0 flex justify-end overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, rotate: -5, scale: 0.95 }}
          animate={{ opacity: 0.03, rotate: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-20 -right-40 md:-right-20 lg:right-[-10%]"
        >
          <Scale size={800} className="text-[#3BBFA3] w-[600px] h-[600px] md:w-[800px] md:h-[800px] lg:w-[1000px] lg:h-[1000px]" strokeWidth={1} />
        </motion.div>
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E7F8F3] text-[#2A9178] text-sm mb-8 border border-[#C2EDE2]">
              <span className="w-2 h-2 rounded-full bg-[#3BBFA3] animate-pulse" />
              Платформа для правового анализа на базе ИИ
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl text-[#0D2B25] font-calistoga mb-6 tracking-tight leading-[1.1]"
          >
            Умный аудит
            <br />
            <span className="text-[#3BBFA3]">нормативных актов</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#5A8278] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Анализируйте правовые документы, выявляйте противоречия и
            визуализируйте связи между законами — за секунды, а не недели.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push("/analysis")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium bg-[#3BBFA3] text-white hover:bg-[#2A9178] transition-all shadow-lg shadow-[#3BBFA3]/25 hover:shadow-[#3BBFA3]/40 hover:-translate-y-0.5"
            >
              Начать анализ
              <ArrowRight size={18} />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-medium bg-[#E7F8F3] text-[#2A9178] hover:bg-[#C2EDE2] transition-all border border-[#C2EDE2]">
              Смотреть демо
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-[#F8FFFE] border border-[#C2EDE2] rounded-2xl shadow-xl shadow-[#3BBFA3]/8 overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-white border-b border-[#E7F8F3] px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FECACA]" />
                <div className="w-3 h-3 rounded-full bg-[#FDE68A]" />
                <div className="w-3 h-3 rounded-full bg-[#C2EDE2]" />
              </div>
              <div className="flex-1 bg-[#F8FFFE] rounded-md h-6 mx-4 border border-[#E7F8F3] flex items-center px-3">
                <span className="text-xs text-[#5A8278] font-mono">zandrive.kz/analysis</span>
              </div>
            </div>

            {/* Mock analysis UI */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Left: input */}
                <div className="space-y-3">
                  <div className="h-4 w-32 rounded bg-[#E7F8F3]" />
                  <div className="rounded-lg bg-white border border-[#C2EDE2] p-3 space-y-2">
                    <div className="h-3 rounded bg-[#E7F8F3] w-full" />
                    <div className="h-3 rounded bg-[#E7F8F3] w-5/6" />
                    <div className="h-3 rounded bg-[#E7F8F3] w-4/6" />
                    <div className="h-3 rounded bg-[#E7F8F3] w-full" />
                    <div className="h-3 rounded bg-[#E7F8F3] w-3/4" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-10 rounded-lg bg-[#3BBFA3] opacity-90" />
                    <div className="flex-1 h-10 rounded-lg bg-[#E7F8F3] border border-[#C2EDE2]" />
                  </div>
                </div>

                {/* Right: results */}
                <div className="space-y-2">
                  {[
                    { color: "#EF4444", bg: "#FEF2F2", label: "Противоречие: ст.31 vs ст.3.1", w: "w-4/5" },
                    { color: "#3B82F6", bg: "#EFF6FF", label: "Дублирование: ФЗ №44 и ФЗ №94", w: "w-full" },
                    { color: "#F59E0B", bg: "#FFFBEB", label: "Устаревшая норма: ред. 2019 г.", w: "w-3/4" },
                    { color: "#3BBFA3", bg: "#E7F8F3", label: "Корректная норма: ст.72", w: "w-5/6" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg p-2.5 border"
                      style={{ backgroundColor: item.bg, borderColor: item.color + "40" }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="h-2.5 rounded flex-1" style={{ backgroundColor: item.color + "30" }}>
                        <div className={`h-full rounded ${item.w}`} style={{ backgroundColor: item.color + "60" }} />
                        <span className="sr-only">{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#E7F8F3] border-y border-[#C2EDE2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl font-calistoga text-[#0D2B25] mb-1">{s.value}</div>
                <div className="text-sm font-medium text-[#5A8278]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#3BBFA3] font-semibold text-sm uppercase tracking-widest">Возможности</span>
          <h2 className="text-3xl md:text-4xl font-calistoga text-[#0D2B25] mt-3 mb-4">
            Всё необходимое для правового анализа
          </h2>
          <p className="text-[#5A8278] max-w-xl mx-auto">
            Платформа объединяет современные методы NLP и граф баз знаний для
            комплексного анализа нормативных документов.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border border-[#C2EDE2] rounded-2xl p-6 hover:border-[#3BBFA3] hover:shadow-lg hover:shadow-[#3BBFA3]/10 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E7F8F3] flex items-center justify-center mb-5 group-hover:bg-[#3BBFA3] transition-colors">
                <f.icon size={22} className="text-[#3BBFA3] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-[#0D2B25] font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[#5A8278] leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-[#F8FFFE] border-y border-[#C2EDE2]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#3BBFA3] font-semibold text-sm uppercase tracking-widest">Процесс</span>
            <h2 className="text-3xl md:text-4xl font-calistoga text-[#0D2B25] mt-3">Как это работает</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-[#C2EDE2]" />
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-[#3BBFA3] flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <span className="text-[#3BBFA3] font-calistoga text-2xl">{s.num}</span>
                </div>
                <h3 className="text-[#0D2B25] font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-[#5A8278] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities list */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#3BBFA3] font-semibold text-sm uppercase tracking-widest">Детали</span>
            <h2 className="text-3xl md:text-4xl font-calistoga text-[#0D2B25] mt-3 mb-6">
              Полный спектр правового анализа
            </h2>
            <div className="space-y-4">
              {[
                "Анализ противоречий между нормами одного или разных актов",
                "Обнаружение дублирующих положений в правовом поле",
                "Отслеживание версий документов и выявление устаревших редакций",
                "Интерактивный граф взаимосвязей с цветовой маркировкой",
                "Пояснения на естественном языке для каждой проблемы",
                "Пополнение базы новыми нормативными актами",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#3BBFA3] mt-0.5 flex-shrink-0" />
                  <span className="text-[#5A8278] text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/analysis")}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-[#3BBFA3] text-white hover:bg-[#2A9178] transition-colors shadow-md shadow-[#3BBFA3]/20"
            >
              Попробовать сейчас
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { icon: Layers, title: "Многослойный анализ", desc: "Работает на уровне статьи, пункта и подпункта" },
              { icon: BarChart3, title: "Статистика базы", desc: "12 400+ актов, ежедневное обновление" },
              { icon: Scale, title: "Правовая точность", desc: "Специализированная модель на правовых корпусах" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-5 rounded-xl bg-[#F8FFFE] border border-[#C2EDE2] hover:border-[#3BBFA3] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-[#E7F8F3] flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-[#3BBFA3]" />
                </div>
                <div>
                  <h4 className="text-[#0D2B25] font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-[#5A8278]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-[#3BBFA3] to-[#2A9178] rounded-3xl p-12 shadow-xl shadow-[#3BBFA3]/30"
        >
          <h2 className="text-3xl md:text-4xl font-calistoga text-white mb-4">
            Начните анализ прямо сейчас
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Загрузите любой нормативный документ и получите полный аудит за секунды.
          </p>
          <button
            onClick={() => router.push("/analysis")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium bg-white text-[#2A9178] hover:bg-[#E7F8F3] transition-colors shadow-lg"
          >
            Открыть рабочую область
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C2EDE2] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#3BBFA3] flex items-center justify-center">
              <Scale size={12} className="text-white" />
            </div>
            <span className="text-sm font-medium text-[#5A8278]">ZanDrive © 2026</span>
          </div>
          <p className="text-xs text-[#5A8278]">
            Платформа для интеллектуального анализа нормативно-правовых актов
          </p>
        </div>
      </footer>
    </div>
  );
}

