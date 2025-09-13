// pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { listPdfs, uploadPdf, deletePdf, renamePdf } from '../api/pdfs';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [renameUuid, setRenameUuid] = useState('');
  const [renameValue, setRenameValue] = useState('');

async function load() {
  try {
    const data = await listPdfs();
    console.log("listPdfs response:", data); // debug
    setPdfs(Array.isArray(data) ? data : (data?.pdfs || []));
  } catch (err) {
    setError(err.response?.data?.message || err.message);
  }
}


  useEffect(() => {
    load();
  }, []);

  const handleUpload = async () => {
    const file = fileRef.current.files[0];
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      await uploadPdf(file, (evt) => {
        const pct = Math.round((evt.loaded / evt.total) * 100);
        setProgress(pct);
      });
      setUploading(false);
      fileRef.current.value = null;
      await load();
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm('Delete this PDF and its highlights?')) return;
    try {
      await deletePdf(uuid);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const openRename = (uuid, current) => {
    setRenameUuid(uuid);
    setRenameValue(current);
  };

  const submitRename = async () => {
    try {
      await renamePdf(renameUuid, renameValue);
      setRenameUuid('');
      setRenameValue('');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      <h2>My Library</h2>
      {error && <div className="error">{error}</div>}
      
      <div className="card">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input ref={fileRef} type="file" accept="application/pdf" />
          <button className="btn" onClick={handleUpload} disabled={uploading}>
            Upload
          </button>
          {uploading && <div className="muted">Uploading {progress}%</div>}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {pdfs?.length === 0 && (
          <div className="muted">No PDFs yet. Upload one to get started.</div>
        )}

        {pdfs?.map((p) => (
          <div key={p.uuid} className="card pdf-row">
            <div style={{ flex: 1 }}>
              <div className="pdf-name">{p.filename}</div>
              <div className="muted">
                Uploaded: {new Date(p.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="pdf-actions">
              <Link to={`/viewer/${p.uuid}`} className="btn">Open</Link>
              <button
                className="btn small"
                onClick={() => openRename(p.uuid, p.filename)}
              >
                Rename
              </button>
              <button
                className="btn danger small"
                onClick={() => handleDelete(p.uuid)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {renameUuid && (
        <div className="modal">
          <div className="modal-card">
            <h3>Rename PDF</h3>
            <input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn" onClick={submitRename}>
                Save
              </button>
              <button className="btn muted" onClick={() => setRenameUuid('')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
