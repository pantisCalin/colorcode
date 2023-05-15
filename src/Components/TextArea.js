import React from "react";

const TextArea = ({ getTextWritten, bulkText }) => {
  return (
    <div className="writeCode">
      <textarea
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            event.preventDefault();
            var v = event.target.value,
              s = event.target.selectionStart,
              e = event.target.selectionEnd;
            event.target.value = v.substring(0, s) + "    " + v.substring(e);
            event.target.selectionStart = event.target.selectionEnd = s + 1;
            return false;
          }
        }}
        onChange={getTextWritten}
        defaultValue={bulkText}
      />
    </div>
  );
};

export default TextArea;
