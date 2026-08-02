import React from 'react';
import useModal from 'src/hooks/useModal';
import './style.scss';

// 弹窗组件：只管订阅事件
const DemoModal = () => {
  const { visible, content, close } = useModal('demoModal');

  if (!visible) return null;

  return (
    <div className="modal-mask" onClick={close}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>弹窗内容</h3>
        <p className="modal-content">{String(content)}</p>
        <button className="modal-close-btn" onClick={close}>关闭</button>
      </div>
    </div>
  );
};

// 触发按钮：不需要 props，直接调 useModal.show
/** @param {{ text: string, value: unknown }} props */
const OpenButton = ({ text, value }) => (
  <button onClick={() => useModal.show('demoModal', value)}>{text}</button>
);

const ModalDemo = () => (
  <div className="modal-demo">
    <h2>Modal Hook 演示</h2>

    <p className="description">
      useModal 基于 useEvent 实现：useModal.show / useModal.hide 发送事件，
      组件内的 useModal 订阅事件。弹窗和按钮之间不需要传任何 props。
    </p>

    <div className="demo-section">
      <h3>打开弹窗</h3>
      <div className="button-row">
        <OpenButton text="打开（文本内容）" value="这是一条文本消息" />
        <OpenButton text="打开（对象内容）" value={JSON.stringify({ id: 1, name: '张三' })} />
      </div>
    </div>

    <div className="info-section">
      <h3>使用说明</h3>
      <ul>
        <li>组件内：const {'{ visible, content, close }'} = useModal(key)</li>
        <li>任意位置：useModal.show(key, 内容) / useModal.hide(key)</li>
        <li>事件名相同即联动，show/hide 不依赖组件引用</li>
        <li>内容支持泛型：useModal&lt;自定义类型&gt;(key)</li>
      </ul>
    </div>

    <DemoModal />
  </div>
);

export default ModalDemo;
