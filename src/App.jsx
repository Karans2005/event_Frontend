import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import PDFViewer from "./components/PDFViewer";
import "./App.css";

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [fields, setFields] = useState([]);

  const addField = (type) => {
    setFields([
      ...fields,
      {
        id: Date.now(),
        type,
        x: 0.2,
        y: 0.2,
        w: 0.3,
        h: 0.1,
        data: ""
      }
    ]);
  };

  const setFieldData = (id, base64Data) => {
    setFields(fields.map(f => (f.id === id ? { ...f, data: base64Data } : f)));
  };

  const startDrag = (e, id) => {
    e.preventDefault();
    const field = fields.find(f => f.id === id);
    if (!field) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = field.x;
    const startTop = field.y;

    const move = (ev) => {
      const wrapper = document.getElementById("pdfWrapper");
      if (!wrapper) return;

      const dx = (ev.clientX - startX) / wrapper.clientWidth;
      const dy = (ev.clientY - startY) / wrapper.clientHeight;

      setFields(prev =>
        prev.map(f =>
          f.id === id
            ? {
                ...f,
                x: Math.min(1 - f.w, Math.max(0, startLeft + dx)),
                y: Math.min(1 - f.h, Math.max(0, startTop + dy))
              }
            : f
        )
      );
    };

    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };

  const startResize = (e, id) => {
    e.stopPropagation();
    const field = fields.find(f => f.id === id);
    if (!field) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = field.w;
    const startH = field.h;

    const move = (ev) => {
      const wrapper = document.getElementById("pdfWrapper");
      if (!wrapper) return;

      const dw = (ev.clientX - startX) / wrapper.clientWidth;
      const dh = (ev.clientY - startY) / wrapper.clientHeight;

      setFields(prev =>
        prev.map(f =>
          f.id === id
            ? {
                ...f,
                w: Math.min(1 - f.x, Math.max(0.05, startW + dw)),
                h: Math.min(1 - f.y, Math.max(0.04, startH + dh))
              }
            : f
        )
      );
    };

    const stop = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfFile(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setPdfBase64(reader.result);
  };

  const sendToBackend = async () => {
    if (!pdfBase64) return alert("Please select a PDF first!");

    try {
      const res = await fetch("https://event-backend-seven-delta.vercel.app/sign-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfId: "test123",
          pdfBase64,
          fields
        })
      });

      const data = await res.json();
      if (res.ok) {
        window.open(data.pdfUrl, "_blank");
      } else {
        alert(data.error);
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h2>Signature Injection Editor</h2>
        <input type="file" accept="application/pdf" onChange={handleFile} />
      <button
  onClick={sendToBackend}
  disabled={!pdfFile}
  className="sign-btn"
>
  Sign PDF
</button>
      </div>

      <div className="editor">
        <div className="toolbar">
          <Toolbar
            addField={addField}
            fields={fields}
            setFieldData={setFieldData}
          />
        </div>

        <div className="pdf-wrapper" id="pdfWrapper">
          <PDFViewer
            pdfFile={pdfFile}
            fields={fields}
            updateField={setFields}
            startDrag={startDrag}
            startResize={startResize}
            setFieldData={setFieldData}
          />
        </div>
      </div>

      <pre className="debug">
        {JSON.stringify(fields, null, 2)}
      </pre>
    </div>
  );
}

export default App;
