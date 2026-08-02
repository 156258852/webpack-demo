import React, { useState, useMemo } from 'react';
import { Tab } from 'src/Component';
import HighlightDemo from 'src/pages/HighlightDemo';
import GuideDemo from 'src/pages/GuideDemo';
import WorkerDemo from 'src/pages/WorkerDemo';
import PollDemo from 'src/pages/PollDemo';
import CanvasDemo from 'src/pages/CanvasDemo';
import FetchTest from 'src/pages/FetchTest';
import ModalDemo from 'src/pages/ModalDemo';
import './style.scss';

const App = () => {
  const [activeKey, setActiveKey] = useState('highlight');

  const tabs = useMemo(() => [
    {
      key: 'highlight',
      label: '文本高亮',
      content: <HighlightDemo />,
    },
    {
      key: 'guide',
      label: '引导遮罩',
      content: <GuideDemo />,
    },
    {
      key: 'worker',
      label: 'Web Worker',
      content: <WorkerDemo />,
    },
    {
      key: 'poll',
      label: '轮询 Hook',
      content: <PollDemo />,
    },
    {
      key: 'canvas',
      label: 'Canvas 标注',
      content: <CanvasDemo />,
    },
    {
      key: 'fetch',
      label: 'Fetch 测试',
      content: <FetchTest />,
    },
    {
      key: 'modal',
      label: 'Modal Hook',
      content: <ModalDemo />,
    },
  ], []);

  return (
    <div className="app-container">
      <h1 className="app-title">React Hooks & Components Demo</h1>
      <Tab tabs={tabs} activeKey={activeKey} onChange={setActiveKey} />
    </div>
  );
};

export default App;