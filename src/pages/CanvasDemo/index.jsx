import React, { useState, useRef } from 'react';
import Canvas from 'src/Component/Canvas';
import './style.scss';

// 使用网络图片作为示例
const SAMPLE_IMAGE = 'https://picsum.photos/800/600';

const CanvasDemo = () => {
  const [markable, setMarkable] = useState(false);
  const [marks, setMarks] = useState([]);
  const canvasRef = useRef(null);

  const handleMarkChange = (newMarks) => {
    setMarks(newMarks);
    console.log('标注列表:', newMarks);
  };

  const handleClearMarks = () => {
    canvasRef.current?.clearMarks();
    setMarks([]);
  };

  return (
    <div className="canvas-demo">
      <h2 className="demo-title">Canvas 图片标注组件</h2>

      <div className="demo-controls">
        <button
          className={`demo-btn ${markable ? 'active' : ''}`}
          onClick={() => setMarkable(!markable)}
        >
          {markable ? '退出标注模式' : '进入标注模式'}
        </button>
        {markable && (
          <button
            className="demo-btn"
            onClick={handleClearMarks}
          >
            清除标注
          </button>
        )}
      </div>

      <div className="demo-content">
        <Canvas
          ref={canvasRef}
          src={SAMPLE_IMAGE}
          markable={markable}
          onMarkChange={handleMarkChange}
        />
      </div>

      {marks.length > 0 && (
        <div className="marks-list">
          <h4>标注列表 ({marks.length})</h4>
          <ul>
            {marks.map((m) => (
              <li key={m.id}>
                位置: ({Math.round(m.x)}, {Math.round(m.y)}) |
                尺寸: {Math.round(m.width)} × {Math.round(m.height)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="demo-info">
        <p>功能说明：</p>
        <ul>
          <li>滚轮缩放：向上放大，向下缩小（范围 10% ~ 500%）</li>
          <li>拖拽移动：鼠标按住拖动（标注模式下禁用）</li>
          <li>矩形标注：标注模式下拖拽绘制矩形（最小 10×10 像素）</li>
        </ul>
      </div>
    </div>
  );
};

export default CanvasDemo;