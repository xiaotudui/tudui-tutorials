import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, BookOpen, ExternalLink, ArrowDown } from 'lucide-react';

// 1. 数据结构：保持坐标系 (x=0 为中心)
const roadmapData = {
  nodes: [
    { id: 'start', title: '开始旅程', x: 0, y: 0, type: 'start', status: 'done' },
    
    // --- 第一阶段 ---
    { id: 'basics', title: '深度学习基础', x: 0, y: 120, type: 'main', label: 'Phase 1' },
    { id: 'math', title: '数学核心', x: -200, y: 120, type: 'branch', desc: '微积分与线性代数' },
    { id: 'python', title: 'Python 编程', x: 200, y: 120, type: 'branch', desc: 'Numpy/Pandas' },
    
    // --- 第二阶段 ---
    { id: 'framework', title: '核心框架', x: 0, y: 260, type: 'main', label: 'Phase 2' },
    { id: 'pytorch', title: 'PyTorch', x: -160, y: 360, type: 'sub-main', label: '推荐' },
    { id: 'tensorflow', title: 'TensorFlow', x: 160, y: 360, type: 'optional' },
    
    // --- 第三阶段 (复杂分叉) ---
    { id: 'applications', title: '实战应用方向', x: 0, y: 500, type: 'main', label: 'Phase 3' },
    
    { id: 'cv', title: '计算机视觉 (CV)', x: -240, y: 620, type: 'branch' },
    { id: 'cv-cnn', title: 'CNN 原理', x: -240, y: 720, type: 'leaf' },
    { id: 'cv-yolo', title: 'YOLO 目标检测', x: -240, y: 820, type: 'leaf' },

    { id: 'nlp', title: '自然语言处理', x: 0, y: 620, type: 'branch' },
    { id: 'nlp-rnn', title: 'RNN / LSTM', x: 0, y: 720, type: 'leaf' },
    { id: 'nlp-bert', title: 'Transformer', x: 0, y: 820, type: 'leaf' },

    { id: 'rl', title: '强化学习', x: 240, y: 620, type: 'branch' },
    
    // --- 结尾 ---
    { id: 'deploy', title: '模型部署与落地', x: 0, y: 960, type: 'main', label: 'Final' },
  ],
  connections: [
    { from: 'start', to: 'basics' },
    // 左右分支
    { from: 'basics', to: 'math', style: 'elbow' },
    { from: 'basics', to: 'python', style: 'elbow' },
    { from: 'basics', to: 'framework' },
    // 框架选择
    { from: 'framework', to: 'pytorch', style: 'elbow' },
    { from: 'framework', to: 'tensorflow', style: 'elbow', dashed: true },
    { from: 'pytorch', to: 'applications', style: 'merge' }, // 合并回来
    { from: 'tensorflow', to: 'applications', style: 'merge' },
    // 应用分叉
    { from: 'applications', to: 'cv', style: 'elbow' },
    { from: 'applications', to: 'nlp', style: 'straight' },
    { from: 'applications', to: 'rl', style: 'elbow' },
    // CV 深入
    { from: 'cv', to: 'cv-cnn' },
    { from: 'cv-cnn', to: 'cv-yolo' },
    // NLP 深入
    { from: 'nlp', to: 'nlp-rnn' },
    { from: 'nlp-rnn', to: 'nlp-bert' },
    // 最终
    { from: 'cv-yolo', to: 'deploy', style: 'merge' },
    { from: 'nlp-bert', to: 'deploy', style: 'merge' },
    { from: 'rl', to: 'deploy', style: 'merge' },
  ]
};

// 2. 核心：直角圆角连线生成器 (The "Roadmap.sh" Style Line)
const ElbowConnector = ({ start, end, dashed }) => {
  const x1 = 450 + start.x;
  const y1 = 50 + start.y;
  const x2 = 450 + end.x;
  const y2 = 50 + end.y;
  
  const radius = 20; // 圆角半径
  const halfY = y1 + (y2 - y1) / 2;

  let d = '';

  // Case 1: 纯垂直 (x1 == x2)
  if (Math.abs(x1 - x2) < 2) {
    d = `M ${x1} ${y1} L ${x2} ${y2}`;
  } 
  // Case 2: 直角走线 (向下 -> 拐弯 -> 横向 -> 拐弯 -> 向下)
  else {
    // 确保圆角不会超过距离的一半
    const r = Math.min(radius, Math.abs(y2 - y1) / 2, Math.abs(x2 - x1) / 2);
    // 拐弯方向 (1 为右, -1 为左)
    const dirX = x2 > x1 ? 1 : -1;
    const dirY = y2 > y1 ? 1 : -1; // 通常都是向下(1)

    d = `
      M ${x1} ${y1} 
      L ${x1} ${halfY - r * dirY} 
      Q ${x1} ${halfY} ${x1 + r * dirX} ${halfY}
      L ${x2 - r * dirX} ${halfY}
      Q ${x2} ${halfY} ${x2} ${halfY + r * dirY}
      L ${x2} ${y2}
    `;
  }

  return (
    <path 
      d={d} 
      stroke={dashed ? "#cbd5e1" : "#94a3b8"} 
      strokeWidth="2" 
      fill="none" 
      strokeDasharray={dashed ? "6 6" : "0"}
      className="transition-all duration-500"
    />
  );
};

export default function RoadmapViewer() {
  const [activeNode, setActiveNode] = useState(null);

  // 样式工厂：不仅是颜色，更是"构造" (Structure)
  const getNodeStyle = (node) => {
    // 基础构造：绝对定位 + 硬边框 + 硬阴影 + 粗字体
    const base = "relative z-10 flex flex-col items-center justify-center px-5 py-3 border-2 border-slate-900 rounded-lg transition-all duration-200 cursor-pointer select-none";
    
    // 1. 主干节点 (Main): 强调色 (橙色) + 最深的硬阴影
    if (node.type === 'main') 
      return `${base} bg-orange-500 text-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_rgba(15,23,42,1)]`;
    
    // 2. 次级主干 (Sub-Main): 白色 + 深色边框 + 硬阴影
    if (node.type === 'sub-main') 
      return `${base} bg-white text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]`;
    
    // 3. 分支节点 (Branch): 浅灰背景 + 灰色阴影
    if (node.type === 'branch' || node.type === 'leaf') 
      return `${base} bg-slate-50 text-slate-700 border-slate-300 shadow-[3px_3px_0px_0px_#cbd5e1] hover:border-slate-900 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,0.5)]`;
    
    // 4. 起点/终点: 胶囊形状
    if (node.type === 'start' || node.type === 'end') 
      return `${base} rounded-full bg-slate-900 text-white shadow-lg border-transparent px-8`;

    // 5. 可选/虚线
    if (node.type === 'optional')
      return `${base} bg-transparent border-dashed border-slate-400 text-slate-500 shadow-none hover:bg-slate-50`;

    return base;
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f8fafc] dark:bg-[#0b0c15] overflow-hidden font-['Noto_Sans_SC']">
      
      {/* 装饰性网格背景 (Blueprint Look) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative mx-auto w-[900px] py-20 min-h-[1200px]">
        
        {/* 底层 SVG 连线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {roadmapData.connections.map((conn, idx) => {
            const startNode = roadmapData.nodes.find(n => n.id === conn.from);
            const endNode = roadmapData.nodes.find(n => n.id === conn.to);
            if (!startNode || !endNode) return null;
            return <ElbowConnector key={idx} start={startNode} end={endNode} dashed={conn.dashed} />;
          })}
        </svg>

        {/* 顶层节点 */}
        {roadmapData.nodes.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${450 + node.x}px`, top: `${50 + node.y}px` }}
          >
            {/* 标签 (Label) */}
            {node.label && (
              <div className={`
                absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 shadow-sm whitespace-nowrap z-20
                ${node.type === 'main' ? 'text-orange-600' : 'text-slate-400'}
              `}>
                {node.label}
              </div>
            )}

            <div 
              className={getNodeStyle(node)}
              onClick={() => setActiveNode(node)}
            >
              <span className="font-bold text-sm">{node.title}</span>
              {/* 悬停显示的箭头提示 */}
              {node.type !== 'start' && node.type !== 'end' && (
                <div className="absolute opacity-0 group-hover:opacity-100 -right-6 text-slate-400 transition-opacity">
                   <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 侧边栏 (抽屉) - 样式保持一致 */}
      {activeNode && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setActiveNode(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#111] h-full shadow-2xl border-l border-slate-200 dark:border-white/5 animate-in slide-in-from-right duration-200 flex flex-col">
            
            <div className="p-8 border-b border-slate-100 dark:border-white/5">
              <span className="inline-block px-3 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-200">
                {activeNode.type || 'Topic'}
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{activeNode.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">点击外部或右上角关闭</p>
              <button onClick={() => setActiveNode(null)} className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="prose prose-slate dark:prose-invert">
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  {activeNode.desc || '深度学习中的关键概念。掌握这一部分对于构建复杂的神经网络模型至关重要。建议配合代码实战进行理解。'}
                </p>
              </div>

              {/* 资源列表模仿 roadmap.sh 的条目样式 */}
              <div className="space-y-3">
                 <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <BookOpen className="w-5 h-5 text-orange-500" /> 推荐阅读
                 </h4>
                 {['官方文档: 核心概念解析', '博客: 图解算法原理', '论文: 经典架构回顾'].map((title, i) => (
                   <a key={i} href="#" className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all group/item bg-white dark:bg-white/5 dark:border-white/10">
                      <span className="font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-orange-600">{title}</span>
                      <ExternalLink className="w-4 h-4 text-slate-300 group-hover/item:text-orange-500" />
                   </a>
                 ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
              <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg">
                <CheckCircle2 className="w-5 h-5" /> 标记为已完成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}