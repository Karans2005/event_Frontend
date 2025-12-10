import React from "react";

 function FieldBox({ field, wrapperRef, startDrag, startResize }) {
  return (
    <div
      onMouseDown={(e) => startDrag(e, field.id)}
      style={{
        position: "absolute",
        left: field.x * wrapperRef.current?.clientWidth + "px",
        top: field.y * wrapperRef.current?.clientHeight + "px",
        width: field.w * wrapperRef.current?.clientWidth + "px",
        height: field.h * wrapperRef.current?.clientHeight + "px",
        border: "2px dashed #2196f3",
        background: "rgba(33,150,243,0.15)",
        boxSizing: "border-box",
        cursor: "move"
      }}
    >
      {field.type}
      <div
        onMouseDown={(e) => startResize(e, field.id)}
        style={{
          width: "12px",
          height: "12px",
          background: "#2196f3",
          position: "absolute",
          right: "-6px",
          bottom: "-6px",
          cursor: "se-resize"
        }}
      ></div>
    </div>
  );
}

export default FieldBox