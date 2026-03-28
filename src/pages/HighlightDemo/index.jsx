import React, { useState } from 'react';
import { Highlight } from 'src/Component';
import './style.scss';

const HighlightDemo = () => {
  const [text, setText] = useState("import React from 'react';\nconst App = () => <div>Hello World</div>;");
  const [markText, setMarkText] = useState('react');
  const [caseSensitive, setCaseSensitive] = useState(false);

  return (
    <div className="highlight-demo">
      <h2>文本高亮组件演示</h2>
      
      <div className="demo-section">
        <div className="input-group">
          <label>原始文本:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="input-group">
          <label>高亮关键词:</label>
          <input
            type="text"
            value={markText}
            onChange={(e) => setMarkText(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            区分大小写
          </label>
        </div>
      </div>
      
      <div className="result-section">
        <h3>高亮结果:</h3>
        <div className="result-box">
          <Highlight
            text={text}
            markText={markText}
            caseSensitive={caseSensitive}
          />
        </div>
      </div>
    </div>
  );
};

export default HighlightDemo;