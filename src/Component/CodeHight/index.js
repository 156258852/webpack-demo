import React from "react";

const HighLight = ({
  text = '',
  markText = '',
}) => {
  console.log('text', text);
  const textArr = text.split(markText);
  // const keywordRender = markText;

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