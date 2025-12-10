import React from "react";
import { FIELD_TYPES } from "./FieldTypes";

function Toolbar({ addField }) {
  return (
    <div className="toolbar">
      {FIELD_TYPES.map(type => (
        <button
          key={type}
          onClick={() => addField(type)}
          className="toolbar-btn"
        >
          Add {type}
        </button>
      ))}
    </div>
  );
}

export default Toolbar;
