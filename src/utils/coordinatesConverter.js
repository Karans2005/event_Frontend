// Convert browser % coordinates to PDF points (bottom-left origin)
export function toPdfCoords(box, pdfWidth, pdfHeight) {
  return {
    x: box.x * pdfWidth,
    y: pdfHeight - (box.y * pdfHeight) - (box.h * pdfHeight),
    w: box.w * pdfWidth,
    h: box.h * pdfHeight
  };
}