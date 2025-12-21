import React, { useState } from 'react';
import { X, BookOpen, Video, Link as LinkIcon, ChevronRight } from 'lucide-react';

// 1. 定义数据：这里模拟了深度学习路线图的数据
const roadmapData = [
  {
    id: 'python-basics',
    title: 'Python 基础',
    category: '基础语言',
    status: 'must', // must, optional, project
    description: '深度学习的通用语言，重点掌握 Numpy 和 Pandas。',
    resources: [
      { type: 'video', title: 'Python 1小时快速入门', url: '#' },
      { type: 'article', title: '廖雪峰 Python 教程', url: '#' },
    ]
  },
  {
    id: 'math-basics',
    title: '数学基础',
    category: '理论基础',
    status: 'must',
    description: '掌握线性代数（矩阵运算）、微积分（梯度下降）和概率论。',
    resources: [
      { type: 'article', title: '3Blue1Brown 线性代数本质', url: '#' },
    ]
  },
  {
    id: 'pytorch-intro',
    title: 'PyTorch 入门',
    category: '核心框架',
    status: 'must',
    description: '土堆教程的核心部分，学习 Tensor、Autograd 和神经网络构建。',
    resources: [
      { type: 'video', title: 'PyTorch 深度学习快速入门', url: 'https://www.bilibili.com/video/BV1hE411t7RN' }, // 示例链接
      { type: 'doc', title: 'PyTorch 官方文档', url: 'https://pytorch.org/docs/stable/index.html' },
    ]
  },
  {
    id: 'cv-basics',
    title: '计算机视觉 (CV)',
    category: '应用领域',
    status: 'must',
    description: '了解卷积神经网络 (CNN)，图像分类、目标检测任务。',
    resources: [
      { type: 'video', title: 'CS231n 斯坦福公开课', url: '#' },
    ]
  },
  {
    id: 'yolo-project',
    title: '实战：YOLO 目标检测',
    category: '土堆实验室',
    status: 'project',
    description: '亲手部署一个目标检测模型，识别图片中的物体。',
    resources: [
      { type: 'code', title: 'YOLOv5 源码解析', url: '#' },
      { type: 'article', title: '如何训练自己的数据集', url: '#' },
    ]
  }
];

// 2. 节点组件
const RoadmapNode = ({ data, onClick, isSelected, index, total }) => {
  // 根据状态设置颜色
  const getColors = () => {
    switch (data.status) {
      case 'must': return 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/30 dark:border-orange-500/50 dark:text-orange-100';
      case 'project': return 'bg-purple-100 border-purple-300 text-purple-900 hover:bg-purple-200 dark:bg-purple-900/30 dark:border-purple-500/50 dark:text-purple-100';
      default: return 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200';
    }
  };

  return (
    <div className="relative flex flex-col items-center group">
      {/* 连接线 (除了最后一个节点) */}
      {index < total - 1 && (
        <div className="absolute top-12 left-1/2 h-16 w-0.5 -translate-x-1/2 bg-slate-300 dark:bg-slate-700"></div>
      )}
      
      {/* 节点本体 */}
      <button
        onClick={() => onClick(data)}
        className={`
          relative z-10 w-64 rounded-xl border-2 p-4 text-left shadow-sm transition-all duration-200
          ${getColors()}
          ${isSelected ? 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-[#0f0f0f]' : ''}
        `}
      >
        <div className="text-xs font-medium opacity-70 mb-1 uppercase tracking-wider">{data.category}</div>
        <div className="text-lg font-bold">{data.title}</div>
      </button>
    </div>
  );
};

// 3. 抽屉/侧边栏组件
const ResourceDrawer = ({ node, onClose, isOpen }) => {
  return (
    <>
      {/* 遮罩层 (移动端) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* 侧边栏主体 */}
      <div 
        className={`
          fixed top-0 right-0 z-50 h-full w-full md:w-[480px] bg-white dark:bg-[#161616] 
          shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-white/10
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {node ? (
          <div className="flex h-full flex-col">
            {/* 头部 */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 p-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{node.title}</h2>
              <button 
                onClick={onClose}
                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                  {node.description}
                </p>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-500" /> 
                  精选资源
                </h3>
                
                <div className="space-y-3">
                  {node.resources.map((res, idx) => (
                    <a 
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-orange-500 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-orange-500"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-white/10 shadow-sm text-slate-600 dark:text-slate-300">
                        {res.type === 'video' ? <Video className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">{res.title}</div>
                        <div className="text-xs text-slate-500 capitalize">{res.type} 教程</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* 底部 CTA */}
            <div className="border-t border-slate-200 dark:border-white/10 p-6 bg-slate-50 dark:bg-white/5">
              <a 
                href="#" 
                className="flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
              >
                标记为已完成
              </a>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            请选择一个节点
          </div>
        )}
      </div>
    </>
  );
};

// 4. 主视图组件
export default function RoadmapViewer() {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  const selectedNode = roadmapData.find(n => n.id === selectedNodeId);

  return (
    <div className="relative min-h-[600px] w-full">
      {/* 路线图主区域 */}
      <div className="flex flex-col items-center gap-8 py-12 md:py-20">
        {roadmapData.map((node, index) => (
          <RoadmapNode
            key={node.id}
            index={index}
            total={roadmapData.length}
            data={node}
            isSelected={selectedNodeId === node.id}
            onClick={(n) => setSelectedNodeId(n.id)}
          />
        ))}
        
        {/* 结束节点 */}
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-lg mt-4">
          终点
        </div>
      </div>

      {/* 侧边栏 */}
      <ResourceDrawer 
        node={selectedNode} 
        isOpen={!!selectedNodeId} 
        onClose={() => setSelectedNodeId(null)} 
      />
    </div>
  );
}