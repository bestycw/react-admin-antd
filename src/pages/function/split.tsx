import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import Split from 'react-split';
import { BorderHorizontalOutlined, BorderVerticleOutlined, AppstoreOutlined } from '@ant-design/icons';
import './split.scss';

const { TabPane } = Tabs;

interface PanelProps {
  title: string;
  color: string;
  children?: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ title, color, children }) => (
  <div className="panel" style={{ backgroundColor: color }}>
    <div className="panel-title">{title}</div>
    {children}
  </div>
);

const SplitDemo: React.FC = () => {
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [panelCount, setPanelCount] = useState(2);

  const renderPanels = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Panel 
        key={index} 
        title={`Panel ${index + 1}`}
        color={`hsl(${(index * 360) / count}, 70%, 95%)`}
      />
    ));
  };

  return (
    <div >
      <Card title="Split 面板示例" className="shadow-md">

        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={<span><BorderHorizontalOutlined /> 基础分割</span>}
            key="1"
          >
            <Split
              className={`split-container ${direction}`}
              direction={direction}
              sizes={Array(panelCount).fill(100 / panelCount)}
              minSize={100}
              gutterSize={10}
              snapOffset={30}
            >
              {renderPanels(panelCount)}
            </Split>
          </TabPane>

          <TabPane 
            tab={<span><BorderVerticleOutlined /> 嵌套分割</span>}
            key="2"
          >
            <Split
              className="split-container horizontal"
              sizes={[30, 70]}
              minSize={100}
              gutterSize={10}
            >
              <Panel title="左侧面板" color="#f0f5ff">
                <Split
                  className="split-container-inner vertical"
                  direction="vertical"
                  sizes={[60, 40]}
                  minSize={60}
                  gutterSize={10}
                >
                  <Panel title="上部面板" color="#e6f4ff" />
                  <Panel title="下部面板" color="#bae0ff" />
                </Split>
              </Panel>
              <Panel title="右侧面板" color="#f6ffed">
                <Split
                  className="split-container-inner horizontal"
                  sizes={[50, 50]}
                  minSize={100}
                  gutterSize={10}
                >
                  <Panel title="右侧面板 1" color="#d9f7be" />
                  <Panel title="右侧面板 2" color="#b7eb8f" />
                </Split>
              </Panel>
            </Split>
          </TabPane>

          <TabPane 
            tab={<span><AppstoreOutlined /> 网格分割</span>}
            key="3"
          >
            <Split
              className="split-container vertical"
              direction="vertical"
              sizes={[50, 50]}
              minSize={100}
              gutterSize={10}
            >
              <Split
                className="split-container-inner horizontal"
                sizes={[50, 50]}
                minSize={100}
                gutterSize={10}
              >
                <Panel title="左上面板" color="#fff1f0" />
                <Panel title="右上面板" color="#fff2e8" />
              </Split>
              <Split
                className="split-container-inner horizontal"
                sizes={[50, 50]}
                minSize={100}
                gutterSize={10}
              >
                <Panel title="左下面板" color="#f4ffb8" />
                <Panel title="右下面板" color="#fcffe6" />
              </Split>
            </Split>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SplitDemo;

export const routeConfig = {
  title: 'Split 面板',
  // icon: <BorderHorizontalOutlined />,
  layout: true,
  
}; 