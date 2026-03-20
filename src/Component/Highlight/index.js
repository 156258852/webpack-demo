import React, { useMemo } from "react";

const DEFAULT_HIGHLIGHT_STYLE = { backgroundColor: "#ffeb3b" };

const Highlight = ({
  text = "",
  markText = "",
  highlightStyle = DEFAULT_HIGHLIGHT_STYLE,
  caseSensitive = true,
}) => {
  const parts = useMemo(() => {
    if (!markText) return [{ text, highlight: false }];

    const escapedPattern = markText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flags = caseSensitive ? "g" : "gi";
    const regex = new RegExp(`(${escapedPattern})`, flags);

    return text.split(regex).map((part, i) => ({
      text: part,
      highlight: i % 2 === 1,
    }));
  }, [text, markText, caseSensitive]);

  return (
    <>
      {parts.map(({ text: part, highlight }, i) =>
        highlight ? (
          <mark key={i} style={highlightStyle}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

export default Highlight;