import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import { getPdf } from '../api/pdfs';
import { getToken } from '../utils/auth';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Viewer() {
  const { uuid } = useParams();
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.25);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPdf() {
      setLoading(true);
      try {
        const data = await getPdf(uuid); // ArrayBuffer
        setPdfData(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Please click on the above open New Tab button');  //'Failed to load PDF');
      } finally {
        setLoading(false);
      }
    }
    loadPdf();
  }, [uuid]);

  const openPdfInNewTab = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:4000/api/pdfs/${uuid}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Failed to open PDF:', err);
      alert('Failed to open PDF. Check console for details.');
    }
  };

  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 50 }}>{error}</div>;
  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading PDF...</div>;

  return (
    <div style={{ maxWidth: 900, margin: '30px auto', padding: 20, borderRadius: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <button style={buttonStyle} onClick={() => setScale(s => Math.min(3, s + 0.25))}>Zoom +</button>
        <button style={buttonStyle} onClick={() => setScale(s => Math.max(0.5, s - 0.25))}>Zoom -</button>
        <button style={buttonStyle} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <button style={buttonStyle} onClick={() => setPage(p => Math.min(numPages, p + 1))}>Next</button>
        <span style={{ fontWeight: '500', marginLeft: 8 }}>Page {page}/{numPages}</span>
        <button style={{ ...buttonStyle, backgroundColor: '#4CAF50', color: '#fff' }} onClick={openPdfInNewTab}>
          Open in New Tab
        </button>
      </div>

      {/* PDF Viewer */}
      <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: 8, padding: 10, textAlign: 'center' }}>
        <Document
          file={{ data: pdfData }}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={page} scale={scale} />
        </Document>
      </div>
    </div>
  );
}

// Button styling
const buttonStyle = {
  padding: '8px 16px',
  borderRadius: 6,
  border: '1px solid #ccc',
  backgroundColor: '#f5f5f5',
  cursor: 'pointer',
  fontWeight: 500,
  transition: 'all 0.2s',
};

buttonStyle[':hover'] = {
  backgroundColor: '#e0e0e0',
};
