import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Zap,
  PlusCircle,
  AlertTriangle,
  Copy,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GitBranch,
  Loader2,
  X,
  Info,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { NetworkGraph } from "../components/NetworkGraph";

// ---------- Mock data ----------
const MOCK_CONTRADICTIONS = [
  {
    id: "c1",
    severity: "high",
    title: "Критерии допуска участников закупки",
    laws: ["ФЗ №44-ФЗ, ст. 31", "ФЗ №223-ФЗ, ст. 3.1"],
    description:
      "ФЗ №44 устанавливает обязательный перечень требований к участникам закупки в ст. 31, тогда как ФЗ №223 допускает произвольное расширение этого перечня заказчиком в ст. 3.1. Нормы прямо противоречат друг другу при участии субъектов, подпадающих под оба закона.",
    explanation:
      "Механизм противоречия: императивная норма ФЗ №44 (закрытый перечень) конфликтует с диспозитивной нормой ФЗ №223 (открытый перечень). Правоприменительная практика неоднородна — есть решения ФАС в обе стороны.",
  },
  {
    id: "c2",
    severity: "medium",
    title: "Порядок обжалования действий заказчика",
    laws: ["ФЗ №44-ФЗ, ст. 105", "КоАП РФ, ст. 7.29"],
    description:
      "Сроки обжалования по ФЗ №44 (10 дней) не согласуются со сроками давности по КоАП (2 месяца), что создаёт коллизию при административном обжаловании.",
    explanation:
      "Специальный закон (ФЗ №44) устанавливает процессуальный срок, который формально не изменяет срок давности КоАП. Однако на практике истечение 10-дневного срока фактически блокирует последующее административное производство.",
  },
];

const MOCK_DUPLICATES = [
  {
    id: "d1",
    title: "Определение государственного заказчика",
    laws: ["ФЗ №44-ФЗ, ст. 3 п.5", "БК РФ, ст. 6 абз. 10"],
    description:
      "Оба акта содержат определение «государственного заказчика», формулировки частично различаются, что порождает неопределённость при применении.",
  },
  {
    id: "d2",
    title: "Нормы о конкурентных способах закупки",
    laws: ["ФЗ №44-ФЗ, гл. 3", "ФЗ №94-ФЗ (утратил силу), гл. 2"],
    description:
      "Действующие подзаконные акты продолжают ссылаться на гл. 2 ФЗ №94, фактически дублируя нормы гл. 3 ФЗ №44.",
  },
];

const MOCK_OUTDATED = [
  {
    id: "o1",
    title: "ФЗ №94-ФЗ «О размещении заказов»",
    date: "Утратил силу: 01.01.2014",
    description:
      "Закон утратил силу, однако 47 действующих подзаконных акта содержат прямые ссылки на его нормы без актуализации.",
    severity: "high",
  },
  {
    id: "o2",
    title: "Редакция ФЗ №135 (2019 г.)",
    date: "Актуальная ред.: 2023 г.",
    description:
      "Документ ссылается на ред. 2019 года ФЗ №135. С тех пор в закон вносились существенные изменения, затрагивающие анализируемые нормы.",
    severity: "medium",
  },
];

type Tab = "contradictions" | "duplicates" | "outdated" | "graph";
type AnalysisMode = "idle" | "loading" | "done";
type ActionType = "audit" | "add";

const SAMPLE_TEXT = `Федеральный закон от 05.04.2013 № 44-ФЗ
«О контрактной системе в сфере закупок товаров, работ, услуг 
для обеспечения государственных и муниципальных нужд»

Статья 31. Требования к участникам закупки

1. При осуществлении закупки заказчик устанавливает следующие единые требования к участникам закупки:
1) соответствие требованиям, установленным в соответствии с законодательством Российской Федерации к лицам, осуществляющим поставку товара, выполнение работы, оказание услуги, являющихся объектом закупки;
2) непроведение ликвидации участника закупки — юридического лица и отсутствие решения арбитражного суда о признании участника закупки — юридического лица или индивидуального предпринимателя несостоятельным (банкротом);
3) неприостановление деятельности участника закупки в порядке, установленном Кодексом Российской Федерации об административных правонарушениях.`;

export function Analysis() {
  const [docTitle, setDocTitle] = useState("");
  const [docText, setDocText] = useState("");
  const [mode, setMode] = useState<AnalysisMode>("idle");
  const [lastAction, setLastAction] = useState<ActionType | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("contradictions");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const handleAudit = () => {
    if (!docText.trim()) return;
    setMode("loading");
    setLastAction("audit");
    setAddSuccess(false);
    setTimeout(() => {
      setMode("done");
      setActiveTab("contradictions");
    }, 2400);
  };

  const handleAdd = () => {
    if (!docText.trim()) return;
    setMode("loading");
    setLastAction("add");
    setAddSuccess(false);
    setTimeout(() => {
      setMode("done");
      setAddSuccess(true);
      setActiveTab("graph");
    }, 1800);
  };

  const handleReset = () => {
    setMode("idle");
    setDocTitle("");
    setDocText("");
    setLastAction(null);
    setAddSuccess(false);
    setExpandedItem(null);
  };

  const fillSample = () => {
    setDocTitle("ФЗ №44-ФЗ, ст. 31");
    setDocText(SAMPLE_TEXT);
  };

  const tabCounts: Record<Tab, number> = {
    contradictions: MOCK_CONTRADICTIONS.length,
    duplicates: MOCK_DUPLICATES.length,
    outdated: MOCK_OUTDATED.length,
    graph: 0,
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "contradictions", label: "Противоречия", icon: <AlertTriangle size={15} /> },
    { key: "duplicates", label: "Дублирование", icon: <Copy size={15} /> },
    { key: "outdated", label: "Устаревшие", icon: <Clock size={15} /> },
    { key: "graph", label: "Граф связей", icon: <GitBranch size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FFFE] text-[#0D2B25]">
      <Navbar />

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Page header */}
        <div className="pt-10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl text-[#0D2B25] mb-2">Рабочая область</h1>
            <p className="text-[#5A8278]">
              Введите текст нормативного документа для анализа или добавления в базу
            </p>
          </div>
          {mode === "done" && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#C2EDE2] text-[#5A8278] hover:text-[#0D2B25] hover:border-[#3BBFA3] transition-colors text-sm"
            >
              <RotateCcw size={15} />
              Новый документ
            </button>
          )}
        </div>

        {/* Input area */}
        <AnimatePresence mode="wait">
          {mode !== "done" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl border border-[#C2EDE2] shadow-sm overflow-hidden"
            >
              {/* Title row */}
              <div className="border-b border-[#E7F8F3] px-6 py-4 flex items-center gap-4">
                <FileText size={18} className="text-[#3BBFA3] flex-shrink-0" />
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="Название документа (необязательно)"
                  className="flex-1 text-sm bg-transparent outline-none text-[#0D2B25] placeholder-[#A0C4BA]"
                />
                <button
                  onClick={fillSample}
                  className="text-xs text-[#3BBFA3] hover:text-[#2A9178] transition-colors whitespace-nowrap"
                >
                  Загрузить пример
                </button>
              </div>

              {/* Textarea */}
              <textarea
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Вставьте текст нормативного акта или его фрагмент...&#10;&#10;Пример: Статья 31. Требования к участникам закупки&#10;1. При осуществлении закупки заказчик устанавливает..."
                className="w-full px-6 py-5 text-sm text-[#0D2B25] placeholder-[#A0C4BA] bg-transparent outline-none resize-none leading-relaxed"
                rows={12}
              />

              {/* Actions */}
              <div className="border-t border-[#E7F8F3] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#5A8278]">
                  <Info size={13} className="text-[#3BBFA3]" />
                  <span>Символов: {docText.length}</span>
                  {docText.length > 0 && (
                    <>
                      <span className="text-[#C2EDE2]">·</span>
                      <span>~{Math.ceil(docText.split(/\s+/).length / 200)} мин чтения</span>
                    </>
                  )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  {/* Add to DB */}
                  <button
                    onClick={handleAdd}
                    disabled={!docText.trim() || mode === "loading"}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-[#3BBFA3] text-[#2A9178] text-sm hover:bg-[#E7F8F3] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <PlusCircle size={16} />
                    Внести в базу
                  </button>

                  {/* Audit */}
                  <button
                    onClick={handleAudit}
                    disabled={!docText.trim() || mode === "loading"}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#3BBFA3] text-white text-sm hover:bg-[#2A9178] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[#3BBFA3]/25"
                  >
                    {mode === "loading" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Zap size={16} />
                    )}
                    {mode === "loading"
                      ? lastAction === "audit"
                        ? "Анализ..."
                        : "Сохранение..."
                      : "Провести аудит"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        <AnimatePresence>
          {mode === "loading" && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 space-y-4"
            >
              <div className="flex items-center gap-3 text-sm text-[#5A8278]">
                <Loader2 size={16} className="animate-spin text-[#3BBFA3]" />
                {lastAction === "audit"
                  ? "Анализируем документ и сопоставляем с базой НПА..."
                  : "Добавляем документ в базу знаний..."}
              </div>
              {[100, 85, 70].map((w, i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-[#E7F8F3] animate-pulse"
                  style={{ width: `${w}%` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {mode === "done" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Add success banner */}
              {addSuccess && (
                <div className="bg-[#E7F8F3] border border-[#3BBFA3] rounded-xl px-5 py-4 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#3BBFA3] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#0D2B25]">
                      Документ{docTitle ? ` «${docTitle}»` : ""} успешно добавлен в базу
                    </p>
                    <p className="text-xs text-[#5A8278] mt-0.5">
                      Граф связей обновлён. Документ доступен для перекрёстного анализа.
                    </p>
                  </div>
                </div>
              )}

              {/* Summary cards */}
              {lastAction === "audit" && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Противоречий",
                      value: 2,
                      color: "#EF4444",
                      bg: "#FEF2F2",
                      border: "#FECACA",
                    },
                    {
                      label: "Дублирований",
                      value: 2,
                      color: "#3B82F6",
                      bg: "#EFF6FF",
                      border: "#BFDBFE",
                    },
                    {
                      label: "Устаревших норм",
                      value: 2,
                      color: "#F59E0B",
                      bg: "#FFFBEB",
                      border: "#FDE68A",
                    },
                    {
                      label: "Корректных норм",
                      value: 14,
                      color: "#3BBFA3",
                      bg: "#E7F8F3",
                      border: "#C2EDE2",
                    },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.07 }}
                      className="rounded-xl p-5 border"
                      style={{
                        backgroundColor: s.bg,
                        borderColor: s.border,
                      }}
                    >
                      <div
                        className="text-3xl mb-1"
                        style={{ color: s.color }}
                      >
                        {s.value}
                      </div>
                      <div className="text-xs text-[#5A8278]">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-[#C2EDE2] shadow-sm overflow-hidden">
                {/* Tab bar */}
                <div className="flex border-b border-[#E7F8F3] overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-5 py-4 text-sm whitespace-nowrap transition-all border-b-2 ${
                        activeTab === tab.key
                          ? "border-[#3BBFA3] text-[#2A9178] bg-[#F8FFFE]"
                          : "border-transparent text-[#5A8278] hover:text-[#0D2B25]"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                      {tab.key !== "graph" && lastAction === "audit" && (
                        <span
                          className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                            activeTab === tab.key
                              ? "bg-[#3BBFA3] text-white"
                              : "bg-[#E7F8F3] text-[#5A8278]"
                          }`}
                        >
                          {tabCounts[tab.key]}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {/* Contradictions */}
                    {activeTab === "contradictions" && (
                      <motion.div
                        key="contradictions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {MOCK_CONTRADICTIONS.map((item) => (
                          <IssueCard
                            key={item.id}
                            id={item.id}
                            severity={item.severity as "high" | "medium"}
                            title={item.title}
                            laws={item.laws}
                            description={item.description}
                            explanation={item.explanation}
                            expanded={expandedItem === item.id}
                            onToggle={() =>
                              setExpandedItem(
                                expandedItem === item.id ? null : item.id
                              )
                            }
                          />
                        ))}
                      </motion.div>
                    )}

                    {/* Duplicates */}
                    {activeTab === "duplicates" && (
                      <motion.div
                        key="duplicates"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {MOCK_DUPLICATES.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-5"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div>
                                <h4 className="text-[#0D2B25] text-sm mb-2">{item.title}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {item.laws.map((law) => (
                                    <span
                                      key={law}
                                      className="px-2 py-0.5 rounded-md bg-white border border-[#BFDBFE] text-xs text-[#3B82F6]"
                                    >
                                      {law}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <Copy size={16} className="text-[#3B82F6] flex-shrink-0 mt-0.5" />
                            </div>
                            <p className="text-xs text-[#5A8278] leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Outdated */}
                    {activeTab === "outdated" && (
                      <motion.div
                        key="outdated"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {MOCK_OUTDATED.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-5"
                          >
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <h4 className="text-[#0D2B25] text-sm">{item.title}</h4>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                  item.severity === "high"
                                    ? "bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]"
                                    : "bg-[#FFFBEB] text-[#F59E0B] border border-[#FDE68A]"
                                }`}
                              >
                                {item.severity === "high" ? "Высокий" : "Средний"}
                              </span>
                            </div>
                            <p className="text-xs text-[#F59E0B] mb-2">{item.date}</p>
                            <p className="text-xs text-[#5A8278] leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Graph */}
                    {activeTab === "graph" && (
                      <motion.div
                        key="graph"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="text-sm text-[#5A8278] mb-5">
                          Интерактивный граф взаимосвязей нормативных актов из базы.
                          Нажмите на узел, чтобы увидеть объяснение.
                        </p>
                        <NetworkGraph />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Document input collapsed view */}
              {mode === "done" && (
                <div className="bg-white rounded-xl border border-[#C2EDE2] px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={16} className="text-[#3BBFA3] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-[#0D2B25] truncate">
                        {docTitle || "Без названия"}
                      </p>
                      <p className="text-xs text-[#5A8278]">
                        {docText.length} символов
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleAudit}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3BBFA3] text-white text-xs hover:bg-[#2A9178] transition-colors"
                    >
                      <Zap size={13} />
                      Повторить
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-2 rounded-lg hover:bg-[#F8FFFE] text-[#5A8278] transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------- Sub-components ----------
interface IssueCardProps {
  id: string;
  severity: "high" | "medium";
  title: string;
  laws: string[];
  description: string;
  explanation?: string;
  expanded: boolean;
  onToggle: () => void;
}

function IssueCard({
  severity,
  title,
  laws,
  description,
  explanation,
  expanded,
  onToggle,
}: IssueCardProps) {
  return (
    <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] overflow-hidden">
      <button
        className="w-full text-left p-5"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={16}
              className={`flex-shrink-0 mt-0.5 ${
                severity === "high" ? "text-[#EF4444]" : "text-[#F59E0B]"
              }`}
            />
            <div>
              <h4 className="text-[#0D2B25] text-sm mb-2">{title}</h4>
              <div className="flex flex-wrap gap-2">
                {laws.map((law) => (
                  <span
                    key={law}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#FECACA] text-xs text-[#EF4444]"
                  >
                    {law}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                severity === "high"
                  ? "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]"
                  : "bg-[#FFFBEB] text-[#F59E0B] border-[#FDE68A]"
              }`}
            >
              {severity === "high" ? "Высокий" : "Средний"}
            </span>
            {expanded ? (
              <ChevronUp size={15} className="text-[#5A8278]" />
            ) : (
              <ChevronDown size={15} className="text-[#5A8278]" />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-[#FECACA]">
              <p className="text-sm text-[#5A8278] leading-relaxed pt-4">
                {description}
              </p>
              {explanation && (
                <div className="bg-white rounded-lg border border-[#C2EDE2] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={14} className="text-[#3BBFA3]" />
                    <span className="text-xs text-[#3BBFA3] uppercase tracking-wide">
                      Объяснение (Explainability)
                    </span>
                  </div>
                  <p className="text-sm text-[#0D2B25] leading-relaxed">
                    {explanation}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}