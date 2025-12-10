import React, { useEffect, useRef } from "react";
import FieldBox from "./FieldBox";

// pdfjs fix for Vite
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.js?url";

function PDFViewer({ pdfFile, fields, updateField, startDrag, startResize }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!pdfFile) return;

    const loadPdf = async () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

      const pdf = await pdfjsLib.getDocument(pdfFile).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 1.3 });
      const canvas = canvasRef.current;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;

      updateField(f => f); // force re-render
    };

    loadPdf();
  }, [pdfFile]);

  return (
    <div ref={wrapperRef} id="pdfWrapper" className="pdf-wrapper">
      <canvas ref={canvasRef} className="pdf-canvas" />

      {fields.map((f) => (
        <FieldBox
          key={f.id}
          field={f}
          wrapperRef={wrapperRef}
          startDrag={startDrag}
          startResize={startResize}
        />
      ))}
    </div>
  );
}

export default PDFViewer;
