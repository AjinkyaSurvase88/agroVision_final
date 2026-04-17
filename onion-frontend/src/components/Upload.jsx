/**
 * Upload.jsx — Image upload with drag & drop + camera capture
 *
 * Strategy:
 *  - Mobile  → uses <input capture="environment"> which opens the native camera app
 *              directly (works on iOS Safari, Android Chrome, all mobile browsers)
 *  - Desktop → uses getUserMedia for live webcam feed with shutter button
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { predictDisease } from '../services/api';
import { useTranslation } from '../context/LanguageContext';
import Loader from './Loader';

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_MB   = 10;

/** Detect touch / mobile device */
const isMobile = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/** Convert a canvas/blob URL to a File object */
const blobUrlToFile = async (blobUrl, filename) => {
  const res  = await fetch(blobUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: 'image/jpeg' });
};

// ── Small tab button ───────────────────────────────────────────────
const TabBtn = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-sans font-semibold rounded-xl transition-all duration-200
      ${active
        ? 'bg-forest-600 text-white shadow-sm'
        : 'text-gray-500 hover:text-forest-700 hover:bg-forest-50'}`}
  >
    {icon}
    {label}
  </button>
);

// ── Main component ─────────────────────────────────────────────────
const Upload = ({ onResult }) => {
  const [mode,     setMode]     = useState('upload'); // 'upload' | 'camera'
  const [file,     setFile]     = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  // Desktop webcam states
  const [camReady,    setCamReady]    = useState(false);  // stream is live
  const [camError,    setCamError]    = useState(null);
  const [captured,    setCaptured]    = useState(false);
  const [facingMode,  setFacingMode]  = useState('environment');

  const inputRef   = useRef(null);   // file upload input
  const cameraRef  = useRef(null);   // mobile native camera input
  const videoRef   = useRef(null);   // desktop live video
  const canvasRef  = useRef(null);   // desktop capture canvas
  const streamRef  = useRef(null);   // MediaStream reference

  const { t } = useTranslation();

  // ── Stop webcam stream ─────────────────────────────────────────
  const stopCam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(tr => tr.stop());
      streamRef.current = null;
    }
    setCamReady(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => stopCam(), [stopCam]);

  // ── Start desktop webcam ───────────────────────────────────────
  const startCam = useCallback(async (facing = 'environment') => {
    setCamError(null);
    setCaptured(false);
    setPreview(null);
    setFile(null);
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamError('Camera API not supported in this browser. Please use a modern browser or upload a file instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      // Attach stream after state update so ref is mounted
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
      setCamReady(true);
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setCamError('Camera permission denied. Please allow camera access in your browser/system settings and try again.');
      } else if (err.name === 'NotFoundError') {
        setCamError('No camera found on this device. Please upload an image file instead.');
      } else {
        setCamError(`Could not open camera: ${err.message}`);
      }
    }
  }, []);

  // ── Flip front/rear (desktop) ──────────────────────────────────
  const flipCam = useCallback(() => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    stopCam();
    setTimeout(() => startCam(next), 150);
  }, [facingMode, stopCam, startCam]);

  // ── Capture frame from webcam (desktop) ───────────────────────
  const captureFrame = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 720;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPreview(dataUrl);
    setCaptured(true);
    stopCam();

    // Convert dataURL → File for API submission
    fetch(dataUrl)
      .then(r => r.blob())
      .then(blob => {
        const f = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFile(f);
      });
  }, [stopCam]);

  // ── Retake (desktop) ──────────────────────────────────────────
  const retake = useCallback(() => {
    setCaptured(false);
    setFile(null);
    setPreview(null);
    setError(null);
    startCam(facingMode);
  }, [startCam, facingMode]);

  // ── Reset everything ──────────────────────────────────────────
  const reset = () => {
    setFile(null); setPreview(null); setError(null); setCaptured(false);
  };

  // ── Switch tabs ───────────────────────────────────────────────
  const switchMode = (next) => {
    if (next === mode) return;
    stopCam();
    reset();
    setMode(next);
    setCamError(null);
  };

  // ── File validation ───────────────────────────────────────────
  const validate = (f) => {
    if (!ACCEPTED.includes(f.type))            return 'Only JPG or PNG images are allowed.';
    if (f.size > MAX_MB * 1024 * 1024)        return `File too large. Maximum size is ${MAX_MB} MB.`;
    return null;
  };

  const applyFile = (f) => {
    const err = validate(f);
    if (err) { setError(err); setFile(null); setPreview(null); return; }
    setError(null); setFile(f);
    const reader = new FileReader();
    reader.onload  = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  // ── Event handlers ────────────────────────────────────────────
  const handleFileChange   = (e) => { if (e.target.files[0]) applyFile(e.target.files[0]); e.target.value = ''; };
  const handleCameraChange = (e) => { if (e.target.files[0]) applyFile(e.target.files[0]); e.target.value = ''; };

  const handleDragOver  = useCallback(e => { e.preventDefault(); setDragging(true); }, []);
  const handleDragLeave = useCallback(e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false); }, []);
  const handleDrop      = useCallback(e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) applyFile(e.dataTransfer.files[0]); }, []); // eslint-disable-line

  // ── Analyze ───────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) { setError('Please select or capture an image first.'); return; }
    setError(null); setLoading(true);
    try {
      const data = await predictDisease(file);
      onResult(data, preview, file.name);
    } catch (err) {
      if (err.response)     setError(err.response.data?.detail || 'Server error while analyzing.');
      else if (err.request) setError('Cannot reach backend. Make sure the server is running.');
      else                  setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Shared preview block ──────────────────────────────────────
  const PreviewBlock = ({ onRemove, removeLabel = 'Remove & re-upload' }) => (
    <div className="relative rounded-2xl overflow-hidden group">
      <img src={preview} alt="Captured leaf" className="w-full max-h-72 object-cover" />
      {/* Hover overlay */}
      <button
        onClick={onRemove}
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16M10 3h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"
            stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-white text-xs font-sans font-semibold">{removeLabel}</span>
      </button>
      {/* File badge */}
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-green-400">
          <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.2"/>
          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        {file?.name ?? 'photo.jpg'} · {file ? `${(file.size / 1024).toFixed(0)} KB` : ''}
      </div>
    </div>
  );

  // ── Loading overlay ───────────────────────────────────────────
  const LoadingOverlay = () => (
    <div className="relative rounded-2xl overflow-hidden">
      {preview && <img src={preview} alt="Analyzing" className="w-full max-h-72 object-cover opacity-40"/>}
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Loader />
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-4">

      {/* ── Mode tab bar ── */}
      <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl">
        <TabBtn
          active={mode === 'upload'}
          onClick={() => switchMode('upload')}
          label="Upload File"
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z"/>
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z"/>
            </svg>
          }
        />
        <TabBtn
          active={mode === 'camera'}
          onClick={() => switchMode('camera')}
          label="Take Photo"
          icon={
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          }
        />
      </div>

      {/* ════════════ UPLOAD MODE ════════════ */}
      {mode === 'upload' && (
        <>
          {loading ? <LoadingOverlay /> : preview ? (
            <PreviewBlock onRemove={reset} />
          ) : (
            <div
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              tabIndex={0} role="button"
              onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
              aria-label="Upload plant image"
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                ${dragging ? 'border-forest-500 bg-forest-50 scale-[1.01]' : 'border-forest-300 bg-white hover:border-forest-500 hover:bg-forest-50'}
                ${error && !file ? 'border-red-300 bg-red-50/40' : ''}`}
            >
              <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
              <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center select-none">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${dragging ? 'bg-forest-500 text-white scale-110' : 'bg-forest-100 text-forest-600'}`}>
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M16 8l-4-4-4 4M12 4v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-sans font-semibold text-forest-900 text-sm">{dragging ? 'Drop image here' : 'Drag & drop your image'}</p>
                  <p className="text-xs text-gray-400 mt-1">or <span className="text-forest-600 font-semibold underline underline-offset-2">browse files</span></p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 font-mono">JPG · PNG</span>
                  <span>·</span>
                  <span>Max {MAX_MB} MB</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ════════════ CAMERA MODE ════════════ */}
      {mode === 'camera' && (
        <>
          {/* ── MOBILE: use native camera input ── */}
          {isMobile() ? (
            <div className="rounded-2xl border-2 border-dashed border-forest-300 overflow-hidden bg-white">
              {loading ? <LoadingOverlay /> : preview ? (
                <PreviewBlock onRemove={reset} removeLabel="Retake Photo" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-forest-900 text-sm">Open your camera</p>
                    <p className="text-xs text-gray-400 mt-1">Point at the onion leaf and take a photo</p>
                  </div>
                  <button
                    onClick={() => cameraRef.current?.click()}
                    className="flex items-center gap-2 bg-forest-600 text-white px-6 py-3 rounded-xl font-sans font-semibold text-sm hover:bg-forest-700 active:scale-95 transition-all shadow-md shadow-forest-200"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                    </svg>
                    Open Camera
                  </button>
                  <p className="text-[11px] text-gray-400">Uses your device's native camera app</p>
                  {/* Hidden native camera input — capture="environment" = rear camera */}
                  <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          ) : (
            /* ── DESKTOP: getUserMedia webcam ── */
            <div className="rounded-2xl overflow-hidden border-2 border-dashed border-forest-300 bg-black">

              {/* Error state */}
              {camError && (
                <div className="flex flex-col items-center justify-center gap-3 py-12 px-6 text-center bg-white">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                      <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-sm text-red-700 font-sans max-w-xs">{camError}</p>
                  <button onClick={() => startCam(facingMode)}
                    className="text-xs bg-forest-600 text-white px-4 py-2 rounded-xl font-sans font-semibold hover:bg-forest-700 transition-colors">
                    Try Again
                  </button>
                </div>
              )}

              {/* Idle — show start button */}
              {!camReady && !captured && !camError && (
                <div className="flex flex-col items-center justify-center gap-4 py-14 px-6 text-center bg-white">
                  <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-forest-900 text-sm">Live webcam capture</p>
                    <p className="text-xs text-gray-400 mt-1">Your browser will ask for camera permission</p>
                  </div>
                  <button onClick={() => startCam(facingMode)}
                    className="flex items-center gap-2 bg-forest-600 text-white px-6 py-3 rounded-xl font-sans font-semibold text-sm hover:bg-forest-700 active:scale-95 transition-all shadow-md shadow-forest-200">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                    </svg>
                    Open Webcam
                  </button>
                </div>
              )}

              {/* Live video feed */}
              {camReady && !captured && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay playsInline muted
                    className="w-full max-h-72 object-cover block"
                  />
                  {/* Corner scan-frame */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-44 h-44 relative">
                      {['top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
                        'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
                        'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
                        'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl',
                      ].map((cls, i) => (
                        <span key={i} className={`absolute w-5 h-5 border-white ${cls}`} />
                      ))}
                    </div>
                  </div>
                  {/* Control bar */}
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-5">
                    {/* Flip */}
                    <button onClick={flipCam} title="Flip camera"
                      className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70">
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {/* Shutter */}
                    <button onClick={captureFrame}
                      className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:border-forest-400 active:scale-90 transition-all shadow-lg flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-forest-600 hover:bg-forest-700 transition-colors" />
                    </button>
                    {/* Close */}
                    <button onClick={stopCam} title="Close"
                      className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70">
                      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Captured photo: show preview + retake */}
              {captured && !loading && preview && (
                <PreviewBlock
                  onRemove={retake}
                  removeLabel="Retake Photo"
                />
              )}
              {captured && loading && <LoadingOverlay />}

              {/* Hidden canvas for frame grab */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </>
      )}

      {/* ── Error alert ── */}
      {error && (
        <div role="alert" className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 animate-fade-in">
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5">
            <path d="M10 11V7m0 4v2M18 10a8 8 0 11-16 0 8 8 0 0116 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="text-sm font-sans text-red-700">{error}</p>
        </div>
      )}

      {/* ── Analyze button ── */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !file}
        aria-busy={loading}
        className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-sans font-semibold text-sm transition-all duration-300
          ${loading || !file
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-forest-600 to-forest-500 text-white hover:from-forest-700 hover:to-forest-600 active:scale-[0.98] shadow-md shadow-forest-200'}`}
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
              <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Analyzing…
          </>
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
              <path d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
            </svg>
            {file ? 'Analyze Image' : 'Select or Capture an Image'}
          </>
        )}
      </button>
    </div>
  );
};

export default Upload;