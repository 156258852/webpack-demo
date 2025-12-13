import React from "react";

const HighLight = ({
  text = '',
  markText = '',
}) => {
  const textArr = text.split(markText);

  return (<>
    {
      textArr.map((item, i) => (<React.Fragment key={i}>
        {i !== 0 && <span style={{ color: 'red' }}>{markText}</span>}
        {
          item
        }
      </React.Fragment>))
    }
  </>);
};

export default HighLight;