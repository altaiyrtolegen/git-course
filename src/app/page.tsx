"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAudit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ status: "error", analysis: ["Произошла ошибка при анализе."], sources: [], db_matches: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === "error") return "text-destructive border-destructive/20 bg-destructive/5";
    if (status === "warning") return "text-orange-500 border-orange-500/20 bg-orange-500/5";
    return "text-green-600 border-green-600/20 bg-green-600/5";
  };

  const statusIcon = (status: string) => {
    if (status === "error") return <ShieldAlert className="w-6 h-6 text-destructive" />;
    if (status === "warning") return <AlertTriangle className="w-6 h-6 text-orange-500" />;
    return <CheckCircle2 className="w-6 h-6 text-green-600" />;
  };

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
      
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/5 px-5 py-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
            Beta Engine
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading leading-[1.1] tracking-tight">
          AI Юрист: <br className="hidden md:block"/>
          <span className="gradient-text">Анализ законодательства РК</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Проверьте ваш текст, ситуацию или документы на соответствие актуальному Уголовному кодексу. Наш AI найдет противоречия, дублирования и логические нестыковки.
        </p>
      </motion.div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        
        {/* Left Column - Input */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-heading">Входные данные</h2>
            <Card className="p-2 border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
              <Textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Вставьте сюда текст ситуации или норму закона..."
                className="min-h-[300px] border-none shadow-none focus-visible:ring-0 text-base leading-relaxed resize-none bg-transparent"
              />
            </Card>
          </div>
          <Button 
            onClick={handleAudit} 
            disabled={isLoading || !text.trim()} 
            className="w-full sm:w-auto h-14 px-8 text-base rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] hover:shadow-[0_8px_24px_rgba(0,82,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 group text-white border-0"
          >
            {isLoading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Search className="mr-3 h-5 w-5" />}
            Запустить аудит
            <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Right Column - Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-muted/40 rounded-3xl p-6 lg:p-10 min-h-[500px] border border-border/50 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] relative overflow-hidden"
        >
          {/* Subtle glowing corner */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

          <AnimatePresence mode="wait">
            {!isLoading && !result && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20 pb-20 opacity-50 relative z-10"
              >
                <div className="w-16 h-16 rounded-2xl bg-border/40 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-heading text-foreground">Аудит не запущен</h3>
                <p className="text-muted-foreground max-w-sm">
                  Введите текст слева и нажмите Запустить аудит, чтобы увидеть результаты анализа.
                </p>
              </motion.div>
            )}

            {isLoading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-8 relative z-10"
              >
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3 bg-border/60" />
                  <Skeleton className="h-4 w-2/3 bg-border/40" />
                </div>
                {[1, 2, 3].map(i => (
                  <Card key={i} className="p-6 border-border/40 bg-card/60 space-y-4">
                    <Skeleton className="h-6 w-1/4 bg-border/60" />
                    <Skeleton className="h-4 w-full bg-border/40" />
                    <Skeleton className="h-4 w-5/6 bg-border/40" />
                  </Card>
                ))}
              </motion.div>
            )}

            {result && !isLoading && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                className="space-y-8 relative z-10"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-heading">Отчет об аудите</h2>
                    <p className="text-sm text-muted-foreground">Найдено источников: {result.db_matches?.length || 0}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${statusColor(result.status)}`}>
                    {statusIcon(result.status)}
                    <span className="font-semibold capitalize">{result.status}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase">Выявленные проблемы</h3>
                  {result.analysis && result.analysis.length > 0 ? (
                    result.analysis.map((item: string, idx: number) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}
                        key={idx}
                      >
                        <Card className={`p-5 lg:p-6 border-l-[3px] ${result.status === 'error' ? 'border-l-destructive' : result.status === 'warning' ? 'border-l-orange-500' : 'border-l-green-500'} bg-card shadow-sm hover:shadow-md transition-shadow`}>
                          <p className="text-base leading-relaxed text-foreground">{item}</p>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <Card className="p-6 border-transparent bg-green-500/5 items-center flex gap-4 text-green-700">
                      <CheckCircle2 className="w-6 h-6" />
                      <p>Проблем не выявлено. Текст соответствует актуальным нормам.</p>
                    </Card>
                  )}
                </div>

                {result.db_matches && result.db_matches.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-border/50">
                    <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                      <Search className="w-4 h-4" /> Использованные источники
                    </h3>
                    <ScrollArea className="h-64 rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                      <div className="space-y-4">
                        {result.db_matches.map((match: any, i: number) => (
                          <div key={i} className="space-y-2 pb-4 border-b border-border/40 last:border-0 last:pb-0 group">
                            <Badge variant="outline" className="font-mono bg-accent/5 text-accent border-accent/20 cursor-pointer hover:bg-accent/10 transition-colors">
                              Статья {match.article}
                            </Badge>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                              {match.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
