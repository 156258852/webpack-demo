import React, { useState } from 'react';
import MaskCom from './MaskCom';

// 判断元素是否在可视区域
const isElementInView = (el) => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollBottom = scrollTop + window.innerHeight;
  const elementTop = el.offsetTop;
  const elementBottom = elementTop + el.offsetHeight;
  
  // 判断元素是否在可视区域内
  return elementTop < scrollBottom && elementBottom > scrollTop;
};


function MaskBtn({ container }) {
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState({});

  const handleScrollEnd = (dom) => {
    if(!dom) return;
    const domInfo = dom.getBoundingClientRect();
    setRect(domInfo);
    setVisible(true);
    dom.classList.add('shake-animation');
    dom.addEventListener('animationend', () => {
      dom.classList.remove('shake-animation');
    }, { once: true });
  };

  const getDom = React.useCallback(() => typeof container === 'function' ? container() : (container?.current || container), [container]);

  const onClose = React.useCallback(() => {
    setVisible(false);
    getDom()?.removeEventListener('click', onClose);
  }, [getDom]);

  const onClick = () => {
    const dom = getDom();
    if (dom) {
      const isInView = isElementInView(dom);
      if (isInView) {
        handleScrollEnd(dom);
      } else {
        dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.addEventListener('scrollend', () => handleScrollEnd(dom), { once: true });
      }
      dom.addEventListener('click', onClose, { once: true });
    }
  };

  React.useEffect(() => () => {
    const dom = getDom();
    if (dom && typeof dom.removeEventListener === 'function') {
      dom.removeEventListener('click', onClose);
    }
  }, [getDom, onClose]);

  return (
    <span>
      <button onClick={onClick}>遮罩按钮</button>
      {visible && <MaskCom rect={rect} onClose={onClose} setRect={setRect} />}
    </span>
  );
}

export default MaskBtn;
