import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Position,
  useReactFlow,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, Button, Tooltip, message } from 'antd';
import { PlusOutlined, MinusOutlined, SaveOutlined, UndoOutlined, RedoOutlined } from '@ant-design/icons';
import CustomNode from './components/CustomNode';
import Sidebar from './components/Sidebar';
import { initialNodes, initialEdges, getNodeData } from './components/data';

const nodeTypes = {
  custom: CustomNode,
};

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

// 添加类型定义
type SetNodesFunc = (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
type SetEdgesFunc = (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;

const Flow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [zoom, setZoom] = useState(1);
  const { project } = useReactFlow();

  // 历史记录状态
  const [history, setHistory] = useState<HistoryState[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [currentStep, setCurrentStep] = useState(0);

  // 添加历史记录
  const addToHistory = useCallback((nodes: Node[], edges: Edge[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentStep + 1);
      const newState = {
        nodes: JSON.parse(JSON.stringify(nodes)),
        edges: JSON.parse(JSON.stringify(edges))
      };
      
      // 检查是否与上一个状态相同
      const lastState = newHistory[newHistory.length - 1];
      if (JSON.stringify(lastState) === JSON.stringify(newState)) {
        return prev;
      }
      
      return [...newHistory, newState];
    });
    setCurrentStep(prev => prev + 1);
  }, [currentStep]);

  // 处理节点变化
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    // 节点位置改变或删除时添加历史记录
    const hasPositionChange = changes.some(
      change => change.type === 'position' && change.dragging === false
    );
    const hasNodeRemoval = changes.some(change => change.type === 'remove');
    
    if (hasPositionChange || hasNodeRemoval) {
      (setNodes as SetNodesFunc)((nds: Node[]) => {
        addToHistory(nds, edges);
        return nds;
      });
    }
  }, [edges, onNodesChange, addToHistory]);

  // 处理边变化
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    onEdgesChange(changes);
    // 仅在边被添加或删除时添加历史记录
    const hasEdgeChange = changes.some(
      change => change.type === 'add' || change.type === 'remove'
    );
    
    if (hasEdgeChange) {
      (setEdges as SetEdgesFunc)((eds: Edge[]) => {
        addToHistory(nodes, eds);
        return eds;
      });
    }
  }, [nodes, onEdgesChange, addToHistory]);

  // 处理连接
  const onConnect = useCallback((params: Connection) => {
    (setEdges as SetEdgesFunc)((eds: Edge[]) => {
      const newEdges = addEdge(params, eds);
      addToHistory(nodes, newEdges);
      return newEdges;
    });
  }, [nodes, addToHistory]);

  // 撤销
  const handleUndo = useCallback(() => {
    if (currentStep > 0) {
      const prevState = history[currentStep - 1];
      setNodes([...prevState.nodes]);
      setEdges([...prevState.edges]);
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, history, setNodes, setEdges]);

  // 重做
  const handleRedo = useCallback(() => {
    if (currentStep < history.length - 1) {
      const nextState = history[currentStep + 1];
      setNodes([...nextState.nodes]);
      setEdges([...nextState.edges]);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, history, setNodes, setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}_${nodes.length + 1}`,
        type: 'custom',
        position,
        data: getNodeData(type),
      };

      (setNodes as SetNodesFunc)((nds: Node[]) => {
        const newNodes = nds.concat(newNode);
        addToHistory(newNodes, edges);
        return newNodes;
      });
    },
    [project, nodes, edges, setNodes, addToHistory]
  );

  const handleSave = () => {
    const flow = { nodes, edges };
    console.log(flow);
    message.success('流程图已保存');
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.5), 2));
  };

  return (
    <div
      ref={reactFlowWrapper}
      style={{ width: '100%', height: '70vh' }}
      className="bg-white rounded-lg"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
        <Background />
        <MiniMap />
        <Panel position="top-right" className="bg-white p-2 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <Tooltip title="撤销">
              <Button
                icon={<UndoOutlined />}
                onClick={handleUndo}
                disabled={currentStep === 0}
              />
            </Tooltip>
            <Tooltip title="重做">
              <Button
                icon={<RedoOutlined />}
                onClick={handleRedo}
                disabled={currentStep === history.length - 1}
              />
            </Tooltip>
            <Tooltip title="放大">
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleZoom(0.1)}
                disabled={zoom >= 2}
              />
            </Tooltip>
            <Tooltip title="缩小">
              <Button
                icon={<MinusOutlined />}
                onClick={() => handleZoom(-0.1)}
                disabled={zoom <= 0.5}
              />
            </Tooltip>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const FlowDemo: React.FC = () => {
  const handleSave = () => {
    message.success('流程图已保存');
  };

  return (
    <div className="w-full h-full min-h-screen bg-gray-50">
      <div className="flex gap-4 p-4">
        <Sidebar />
        <div className="flex-1">
          <Card 
            title="流程图示例" 
            extra={
              <div className="flex gap-2">
                <Button icon={<SaveOutlined />} onClick={handleSave}>
                  保存
                </Button>
              </div>
            }
          >
            <ReactFlowProvider>
              <Flow />
            </ReactFlowProvider>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlowDemo;

export const routeConfig = {
  title: 'route.function.flow',
  layout: true,
}; 