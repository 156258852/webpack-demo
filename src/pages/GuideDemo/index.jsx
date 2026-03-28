import React, { useRef } from 'react';
import MaskBtn from 'src/Component/Guide';
import './style.scss';

const GuideDemo = () => {
  const targetRef1 = useRef();
  const targetRef2 = useRef();
  const targetRef3 = useRef();

  return (
    <div className="guide-demo">
      <h2>引导遮罩组件演示</h2>
      
      <p className="description">
        点击下方按钮，会显示遮罩并高亮对应元素。元素不在可视区域时会自动滚动到该位置。
      </p>
      
      <div className="demo-buttons">
        <MaskBtn container={targetRef1} />
        <MaskBtn container={targetRef2} />
        <MaskBtn container={targetRef3} />
      </div>
      
      <div className="target-elements">
        <div className="target-section">
          <h3>目标元素 1</h3>
          <div ref={targetRef1} className="target-box target-1">
            搜索按钮
          </div>
        </div>
        
        <div className="target-section">
          <h3>目标元素 2</h3>
          <div ref={targetRef2} className="target-box target-2">
            设置按钮
          </div>
        </div>
        
        <div className="target-section">
          <h3>目标元素 3</h3>
          <div ref={targetRef3} className="target-box target-3">
            帮助按钮
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDemo;