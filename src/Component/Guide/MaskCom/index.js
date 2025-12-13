import React from 'react';

const MaskCom = ({ onClose, rect = {}, opacity = 0.4 }) => {
  const {
    width: targetWidth = 0,
    height: targetHeight = 0,
    left: positionX = 0,
    top: positionY = 0,
  } = rect;
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });


  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <svg
      style={{
        opacity,
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
        pointerEvents: 'none',
      }}
      onClick={() => { onClose(); }}
    >
      <path
        style={{ pointerEvents: 'all' }}
        d={`M${windowSize.width},${windowSize.height}H0V0H${windowSize.width}V${windowSize.height}ZM${positionX},${positionY}V${positionY + targetHeight}H${positionX + targetWidth}V${positionY}Z`}
      />
    </svg>
  );
};

export default MaskCom;
