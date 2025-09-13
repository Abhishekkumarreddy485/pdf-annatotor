// components/PdfPage.jsx
import React from 'react';

export default function PdfPage({
  pageNumber,
  scale,
  highlights = [],
  pageContainerRef
}) {
  return (
    <div className="page-highlights-layer" data-pageno={pageNumber} style={{ position: 'relative' }}>
      {highlights
        .filter(h => h.pageNumber === pageNumber)
        .map(h => {
          const pos = h.position || {};
          const style = {
            position: 'absolute',
            left: `${(pos.left || 0) * 100}%`,
            top: `${(pos.top || 0) * 100}%`,
            width: `${(pos.width || 0) * 100}%`,
            height: `${(pos.height || 0) * 100}%`,
            background: 'rgba(255, 230, 0, 0.45)',
            borderRadius: '2px',
            pointerEvents: 'auto'
          };
          return <div key={h._id || `${h.pdfUuid}-${h.pageNumber}-${Math.random()}`} style={style} title={h.text || ''} />;
        })}
    </div>
  );
}
