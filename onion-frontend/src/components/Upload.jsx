/**
 * Upload.jsx — Image upload with drag & drop, preview, validation
 */
import React, { useState, useRef, useCallback } from 'react';
import { predictDisease } from '../services/api';
import { useTranslation } from '../context/LanguageContext';
import Loader from './Loader';

const ACCEPTED = ['image/jpeg', 'image/jpg'];
const MAX_MB   = 10;

const Upload = ({ onResult }) => {
  const [file,       setFile]       = useState(null);
  const [preview,    setPreview]    = useState(null);
  const [dragging,   setDragging]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();

  const validate = (f) => {
    if (!ACCEPTED.includes(f.type)) return t('upload.error_format');
    if (f.size > MAX_MB * 1024 * 1024) return t('upload.error_size');
    return null;
  };

  const applyFile = (f) => {
    const err = validate(f);
    if (err) { setError(err); setFile(null); setPreview(null); return; }
    setError(null); setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleChange  = (e) => { if (e.target.files[0]) applyFile(e.target.files[0]); e.target.value = ''; };
  const handleDragOver  = useCallback(e => { e.preventDefault(); setDragging(true); }, []);
  const handleDragLeave = useCallback(e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }, []);
  const handleDrop      = useCallback(e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) applyFile(e.dataTransfer.files[0]); }, []); // eslint-disable-line

  const handleAnalyze = async () => {
    if (!file) { setError(t('upload.error_select')); return; }
    setError(null); setLoading(true);
    try {
      const data = await predictDisease(file);
      onResult(data, preview, file.name);
    } catch (err) {
      if (err.response)     setError(err.response.data?.detail || t('upload.error_server'));
      else if (err.request) setError(t('upload.error_backend'));
      else                  setError(t('errors.try_again'));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setPreview(null); setError(null); };

  return (
    <div className="w-full space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        onClick={() => !preview && !loading && inputRef.current?.click()}
        tabIndex={0} role="button"
        onKeyDown={e => e.key === 'Enter' && !preview && !loading && inputRef.current?.click()}
        aria-label="Upload plant image"
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${dragging ? 'border-forest-500 bg-forest-50 drop-ring scale-[1.01]'
            : preview  ? 'border-forest-300 bg-white cursor-default'
            : 'border-forest-300 bg-white hover:border-forest-500 hover:bg-forest-50'}
          ${error && !file ? 'border-red-300 bg-red-50/40' : ''}
          ${loading ? 'pointer-events-none' : ''}`}
      >
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,image/jpeg" onChange={handleChange} className="hidden" />

        {/* Empty state */}
        {!preview && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center select-none">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragging ? 'bg-forest-500 text-white scale-110' : 'bg-forest-100 text-forest-600'}`}>
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 8l-4-4-4 4M12 4v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-sans font-semibold text-forest-900 text-sm">{dragging ? t('upload.drop_here') : t('upload.drag_drop')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('upload.or_browse')} <span className="text-forest-600 font-semibold underline underline-offset-2">browse files</span></p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 font-mono">{t('upload.format')}</span>
              <span>·</span><span>{t('upload.max_size')}</span>
            </div>
          </div>
        )}

        {/* Preview */}
        {preview && !loading && (
          <div className="relative group">
            <img src={preview} alt="Plant leaf" className="w-full max-h-64 object-cover rounded-2xl" />
            <button onClick={e => { e.stopPropagation(); reset(); }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16M10 3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-white text-xs font-sans font-semibold">{t('upload.reset_btn')}</span>
            </button>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full font-sans backdrop-blur-sm">
              {file?.name} · {(file?.size / 1024).toFixed(0)} KB
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div className={preview ? 'scan-overlay' : ''}>
            {preview && <img src={preview} alt="Analyzing" className="w-full max-h-64 object-cover rounded-2xl opacity-50" />}
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
              <Loader />
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 animate-fade-in">
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 11V7m0 4v2M18 10a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-sm font-sans text-red-700">{error}</p>
        </div>
      )}

      {/* Analyze button */}
      <button onClick={handleAnalyze} disabled={loading || !file} aria-busy={loading}
        className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-sans font-semibold text-sm transition-all duration-300
          ${loading || !file
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-forest-600 to-forest-500 text-white hover:from-forest-700 hover:to-forest-600 hover:shadow-green-glow active:scale-[0.98] shadow-md shadow-forest-200'}`}
      >
        {loading ? (
          <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>{t('loader.analyzing')}</>
        ) : (
          <><svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg"><path d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/></svg>{t('upload.analyze_btn')}</>
        )}
      </button>
    </div>
  );
};

export default Upload;