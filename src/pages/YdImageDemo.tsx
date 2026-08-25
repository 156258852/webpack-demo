import React, { useState } from 'react';
import ydImage from 'src/yd-image';

// 保持与原 yd-externals 一致的全局入口：window.__ydImage
(window as any).__ydImage = ydImage;

const YdImageDemo: React.FC = () => {
  const [result, setResult] = useState<string>('');

  // 截图：把当前页面栅格化后可拖拽选区，松手进入编辑器（画笔/文字/马赛克/撤销），完成后返回 base64
  const handleScreenshot = async () => {
    try {
      const base64 = await ydImage.screenshot({ format: 'png' });
      setResult(base64);
    } catch (e) {
      console.error('screenshot error', e);
    }
  };

  // 直接打开编辑器：不经过截图，传入一张示例图，编辑完成后返回 base64
  const handleOpenEditor = async () => {
    try {
      const sample = makeSampleImage();
      const base64 = await ydImage.initEdit(sample);
      setResult(base64);
    } catch (e) {
      console.error('initEdit error', e);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>yd-image 截图 / 标注能力</h2>
      <p style={{ color: '#666', lineHeight: 1.6 }}>
        点“截图”会把当前页面变成可选区（拖拽选择后进入编辑器：画笔 / 文字 / 马赛克 / 撤销）；
        点“打开编辑器”可直接编辑一张示例图。编辑后点工具栏右侧“✓”完成，下方显示返回的 base64 预览。
      </p>
      <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
        <button onClick={handleScreenshot}>截图（截取本页）</button>
        <button onClick={handleOpenEditor}>打开编辑器（示例图）</button>
      </div>
      {result && (
        <div>
          <div style={{ marginBottom: 8 }}>结果预览（base64）：</div>
          <img
            src={result}
            alt="result"
            style={{ maxWidth: '100%', border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
      )}
    </div>
  );
};

// 生成一张示例图，避免依赖外部图片（CORS 问题）
function makeSampleImage(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 600, 400);
  grad.addColorStop(0, '#1890ff');
  grad.addColorStop(1, '#52c41a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 400);
  ctx.fillStyle = '#fff';
  ctx.font = '32px sans-serif';
  ctx.fillText('yd-image demo', 40, 80);
  ctx.font = '20px sans-serif';
  ctx.fillText('用工具栏画笔 / 文字 / 马赛克标注我', 40, 130);
  return canvas.toDataURL('image/png');
}

export default YdImageDemo;
