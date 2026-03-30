import { useState } from "react";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "normal" | "conflict" | "outdated" | "duplicate";
}

interface Edge {
  from: string;
  to: string;
  type: "reference" | "conflict" | "amendment";
}

const NODES: Node[] = [
  { id: "n1", label: "ФЗ №44", x: 300, y: 120, type: "normal" },
  { id: "n2", label: "ФЗ №223", x: 500, y: 200, type: "conflict" },
  { id: "n3", label: "ГК РФ ст.432", x: 150, y: 250, type: "normal" },
  { id: "n4", label: "ФЗ №135", x: 420, y: 340, type: "outdated" },
  { id: "n5", label: "ФЗ №94", x: 220, y: 380, type: "duplicate" },
  { id: "n6", label: "БК РФ ст.72", x: 580, y: 100, type: "normal" },
  { id: "n7", label: "ФЗ №275", x: 650, y: 300, type: "conflict" },
  { id: "n8", label: "КоАП ст.7.29", x: 80, y: 140, type: "normal" },
];

const EDGES: Edge[] = [
  { from: "n1", to: "n2", type: "conflict" },
  { from: "n1", to: "n3", type: "reference" },
  { from: "n1", to: "n6", type: "reference" },
  { from: "n2", to: "n4", type: "amendment" },
  { from: "n2", to: "n7", type: "conflict" },
  { from: "n3", to: "n5", type: "reference" },
  { from: "n4", to: "n5", type: "reference" },
  { from: "n6", to: "n7", type: "reference" },
  { from: "n8", to: "n1", type: "reference" },
  { from: "n8", to: "n3", type: "reference" },
];

const nodeColors = {
  normal: { fill: "#E7F8F3", stroke: "#3BBFA3", text: "#0D2B25" },
  conflict: { fill: "#FEF2F2", stroke: "#EF4444", text: "#7F1D1D" },
  outdated: { fill: "#FFFBEB", stroke: "#F59E0B", text: "#78350F" },
  duplicate: { fill: "#EFF6FF", stroke: "#3B82F6", text: "#1E3A5F" },
};

const edgeColors = {
  reference: "#C2EDE2",
  conflict: "#FECACA",
  amendment: "#FDE68A",
};

export function NetworkGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodeById = (id: string) => NODES.find((n) => n.id === id);

  const nodeExplanations: Record<string, string> = {
    n2: "ФЗ №223 противоречит ФЗ №44 в части определения критериев допуска участников закупки (ст. 31 vs ст. 3.1).",
    n4: "ФЗ №135 содержит нормы, фактически замещённые поправками 2022 года в ФЗ №223.",
    n5: "ФЗ №94 утратил силу, однако на него продолжают ссылаться действующие подзаконные акты.",
    n7: "ФЗ №275 конфликтует с ФЗ №223 в части регулирования гособоронзаказа.",
  };

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-5">
        {[
          { type: "normal", label: "Без замечаний" },
          { type: "conflict", label: "Противоречие" },
          { type: "outdated", label: "Устаревшая" },
          { type: "duplicate", label: "Дублирование" },
        ].map(({ type, label }) => {
          const c = nodeColors[type as keyof typeof nodeColors];
          return (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full border-2"
                style={{ backgroundColor: c.fill, borderColor: c.stroke }}
              />
              <span className="text-xs text-[#5A8278]">{label}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-0.5 bg-[#C2EDE2]" />
          <span className="text-xs text-[#5A8278]">Ссылка</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#FECACA]" />
          <span className="text-xs text-[#5A8278]">Конфликт</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-[#FDE68A]" />
          <span className="text-xs text-[#5A8278]">Поправка</span>
        </div>
      </div>

      <div className="relative bg-[#F8FFFE] rounded-xl border border-[#C2EDE2] overflow-hidden">
        <svg
          viewBox="0 0 740 480"
          className="w-full"
          style={{ minHeight: 320 }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E7F8F3" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="740" height="480" fill="url(#grid)" />

          {/* Edges */}
          {EDGES.map((edge, i) => {
            const from = getNodeById(edge.from);
            const to = getNodeById(edge.to);
            if (!from || !to) return null;
            const isHighlighted =
              selectedNode === edge.from || selectedNode === edge.to;
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={edgeColors[edge.type]}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                strokeDasharray={edge.type === "amendment" ? "6,3" : undefined}
                opacity={selectedNode && !isHighlighted ? 0.2 : 0.85}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((node) => {
            const c = nodeColors[node.type];
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            const isConnected =
              selectedNode &&
              EDGES.some(
                (e) =>
                  (e.from === selectedNode && e.to === node.id) ||
                  (e.to === selectedNode && e.from === node.id)
              );
            const dimmed =
              selectedNode &&
              !isSelected &&
              !isConnected &&
              node.id !== selectedNode;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() =>
                  setSelectedNode(selectedNode === node.id ? null : node.id)
                }
                opacity={dimmed ? 0.25 : 1}
              >
                <circle
                  r={isSelected || isHovered ? 36 : 32}
                  fill={c.fill}
                  stroke={c.stroke}
                  strokeWidth={isSelected ? 3 : 2}
                  style={{ transition: "all 0.15s ease" }}
                  filter={
                    isSelected ? "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" : undefined
                  }
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontWeight={isSelected ? "600" : "500"}
                  fill={c.text}
                  style={{ userSelect: "none" }}
                >
                  {node.label}
                </text>
                {node.type !== "normal" && (
                  <circle cx={22} cy={-22} r={6} fill={c.stroke} />
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip / explanation */}
        {selectedNode && nodeExplanations[selectedNode] && (
          <div className="absolute bottom-4 left-4 right-4 bg-white border border-[#C2EDE2] rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-full min-h-[40px] rounded-full bg-[#3BBFA3] flex-shrink-0" />
              <div>
                <p className="text-xs text-[#5A8278] mb-1">Объяснение проблемы (explainability)</p>
                <p className="text-sm text-[#0D2B25]">{nodeExplanations[selectedNode]}</p>
              </div>
            </div>
          </div>
        )}

        {!selectedNode && (
          <div className="absolute bottom-4 right-4 text-xs text-[#5A8278] bg-white/80 px-3 py-1.5 rounded-full border border-[#C2EDE2]">
            Нажмите на узел для объяснения
          </div>
        )}
      </div>
    </div>
  );
}
