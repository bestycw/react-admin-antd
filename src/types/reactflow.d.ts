declare module 'reactflow' {
  import { ComponentType, ReactNode, DragEvent } from 'react';

  export interface Node<T = any> {
    id: string;
    position: { x: number; y: number };
    data: T;
    type?: string;
  }

  export interface Edge<T = any> {
    id: string;
    source: string;
    target: string;
    type?: string;
    animated?: boolean;
    data?: T;
  }

  export type NodeChange = any;
  export type EdgeChange = any;
  export type Connection = any;

  export interface ReactFlowProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange?: (changes: NodeChange[]) => void;
    onEdgesChange?: (changes: EdgeChange[]) => void;
    onConnect?: (connection: Connection) => void;
    onDragOver?: (event: DragEvent) => void;
    onDrop?: (event: DragEvent) => void;
    nodeTypes?: { [key: string]: ComponentType<any> };
    fitView?: boolean;
    className?: string;
    children?: ReactNode;
    proOptions?: {
      hideAttribution?: boolean;
    };
  }

  export interface ReactFlowInstance {
    project: (position: { x: number; y: number }) => { x: number; y: number };
  }

  export function useReactFlow(): ReactFlowInstance;

  export interface ReactFlowProviderProps {
    children: ReactNode;
  }

  export interface HandleProps {
    type: 'source' | 'target';
    position: Position;
    className?: string;
  }

  export enum Position {
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
    Left = 'left'
  }

  export interface NodeProps<T = any> {
    id: string;
    data: T;
    type?: string;
  }

  export function useNodesState(initialNodes: Node[]): [
    Node[],
    (nodes: Node[]) => void,
    (changes: NodeChange[]) => void
  ];

  export function useEdgesState(initialEdges: Edge[]): [
    Edge[],
    (edges: Edge[]) => void,
    (changes: EdgeChange[]) => void
  ];

  export function addEdge(connection: Connection, edges: Edge[]): Edge[];

  export const Handle: ComponentType<HandleProps>;
  export const ReactFlowProvider: ComponentType<ReactFlowProviderProps>;
  export const Panel: ComponentType<{ position?: string; className?: string; children?: ReactNode }>;
  export const Background: ComponentType<any>;
  export const Controls: ComponentType<any>;
  export const MiniMap: ComponentType<any>;

  const ReactFlow: ComponentType<ReactFlowProps>;
  export default ReactFlow;
} 