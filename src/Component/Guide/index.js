import React, { useState } from 'react';
import { isElementInView } from 'src/utils';
import MaskCom from './MaskCom';

function ApplyCertBtn() {
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState({});
  const applyBtnDom = document.querySelector('[data-tracker="4_1m9mnpi"]');
  const handleScrollEnd = () => {
    const domInfo = applyBtnDom.getBoundingClientRect();
    setRect(domInfo);
    setVisible(true);
    applyBtnDom.classList.add('shake-animation');
    applyBtnDom.addEventListener('animationend', () => {
      applyBtnDom.classList.remove('shake-animation');
    }, { once: true });
  };

  const onClose = React.useCallback(() => {
    setVisible(false);
    applyBtnDom.removeEventListener('click', onClose);
  }, []);
  const onApply = () => {
    if (applyBtnDom) {
      const isInView = isElementInView(applyBtnDom);
      if (isInView) {
        handleScrollEnd();
      } else {
        applyBtnDom.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.ROOT_APP_REF_REMARK.addEventListener('scrollend', handleScrollEnd, { once: true });
      }
      applyBtnDom.addEventListener('click', onClose, { once: true });
    }
  };

  React.useEffect(() => () => {
    window.ROOT_APP_REF_REMARK.removeEventListener('scrollend', handleScrollEnd);
    applyBtnDom?.removeEventListener('click', onClose);
  }, []);


  return (
    <span>
      <UI.Button data-tracker="11_56vsfcuu" text type="primary" onClick={onApply}>{intl('cas.view.apply.title')}</UI.Button>
      {visible && <MaskCom rect={rect} onClose={onClose} setRect={setRect} />}
    </span>
  );
}

export default UI.withErrorBoundary(false)(ApplyCertBtn);
