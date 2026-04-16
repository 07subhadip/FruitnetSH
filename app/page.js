"use client";

import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

// ===== Constants =====
const CLASS_LABELS = [
    "Alternaria",
    "Anthracnose",
    "Bacterial Blight",
    "Cercospora",
    "Healthy",
];

const DISEASE_INFO = {
    Alternaria: { description: "FUNGAL_ANOMALY: DARK_SPOTS_DETECTED", severity: "MODERATE" },
    Anthracnose: { description: "CRITICAL_INFECTION: SUNKEN_LESIONS_ANALYZED", severity: "HIGH" },
    "Bacterial Blight": { description: "BACTERIAL_PENETRATION: CRACKING_SYSTEM_FAILURE", severity: "CRITICAL" },
    Cercospora: { description: "BIOLOGICAL_SCARRING: CIRCULAR_BLEMISHES", severity: "MODERATE" },
    Healthy: { description: "SYSTEMS_OPTIMAL: NO_PATHOGENS_FOUND", severity: "NONE" },
};

const IMAGE_SIZE = 224;
const MODEL_URL = "/model/model.json";

export default function Home() {
    const [model, setModel] = useState(null);
    const [modelStatus, setModelStatus] = useState("loading");
    const [imagePreview, setImagePreview] = useState(null);
    const [predictions, setPredictions] = useState(null);
    const [topPrediction, setTopPrediction] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [animateBars, setAnimateBars] = useState(false);
    const [showInfo, setShowInfo] = useState(false); // Modal state
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const fileInputRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        async function loadModel() {
            try {
                await tf.ready();
                const loadedModel = await tf.loadGraphModel(MODEL_URL);
                setModel(loadedModel);
                setModelStatus("ready");
            } catch (err) {
                setModelStatus("error");
                setError("MODEL_INIT_FAILED");
            }
        }
        loadModel();
    }, []);

    useEffect(() => {
        if (predictions) {
            setAnimateBars(false);
            const timer = setTimeout(() => setAnimateBars(true), 100);
            return () => clearTimeout(timer);
        }
    }, [predictions]);

    const processFile = (file) => {
        if (!file?.type?.startsWith("image/")) {
            setError("ERR: INVALID_DATA_PACKET");
            return;
        }
        setError(null);
        reset();
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const predict = async () => {
        if (!model || !imagePreview) return;
        setIsAnalyzing(true);
        setError(null);
        try {
            // Create a fresh image from raw data to avoid CSS distortion
            const img = new Image();
            img.crossOrigin = "anonymous";
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imagePreview;
            });

            // Draw to a hidden canvas at exact model input size
            const canvas = document.createElement("canvas");
            canvas.width = IMAGE_SIZE;
            canvas.height = IMAGE_SIZE;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

            const tensor = tf.tidy(() => {
                const pixels = tf.browser.fromPixels(canvas);
                // Pass raw [0, 255] - EfficientNetB0 has built-in preprocessing
                return pixels.toFloat().expandDims(0);
            });

            const output = model.predict(tensor);
            const probabilities = await output.data();
            tensor.dispose();
            output.dispose();

            const results = CLASS_LABELS.map((label, i) => ({
                label,
                probability: probabilities[i],
                percentage: (probabilities[i] * 100).toFixed(1),
                info: DISEASE_INFO[label],
            })).sort((a, b) => b.probability - a.probability);

            setPredictions(results);
            setTopPrediction(results[0]);
        } catch (err) {
            setError("ERR: ENGINE_FAILURE");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setImagePreview(null);
        setPredictions(null);
        setTopPrediction(null);
        setError(null);
        setAnimateBars(false);
    };

    return (
        <main className="app-container">
            {/* Top Actions Bar */}
            <div className="top-actions">
                <button className="info-btn" onClick={() => setShowInfo(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                </button>
                <a href="https://github.com/07subhadip" target="_blank" rel="noopener noreferrer" className="github-link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
            </div>

            {/* Info Modal */}
            {showInfo && (
                <div className="modal-overlay" onClick={() => setShowInfo(false)}>
                    <div className="info-modal animate-fade-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-close" onClick={() => setShowInfo(false)}>×</div>
                        <h2 className="stat-label" style={{ fontSize: '1.2rem', color: 'var(--neon-cyan)', marginBottom: '1.5rem' }}>// SYSTEM_INTEL</h2>
                        <div style={{ color: '#fff', fontSize: '0.9rem', lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}>
                            <p style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--neon-magenta)' }}>PROJECT:</strong> FRUITNET_SH</p>
                            <p style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--neon-magenta)' }}>PURPOSE:</strong> Advanced Pomegranate Pathogen Detection using Neural Network classification.</p>
                            <p style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--neon-magenta)' }}>TECH_STACK:</strong> Next.js 15+ // TensorFlow.js // Client-Side Inference.</p>
                            <p style={{ marginBottom: '1rem' }}><strong style={{ color: 'var(--neon-magenta)' }}>CAPABILITIES:</strong> Detects Alternaria, Anthracnose, Bacterial Blight, and Cercospora within milliseconds.</p>
                            <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '1.5rem 0' }} />
                            <p style={{ textAlign: 'center', opacity: 0.7 }}>DEVELOPED_BY: 07SUBHADIP</p>
                        </div>
                    </div>
                </div>
            )}

            <header className="app-header">
                <div className="glitch-text">FRUITNET_SH</div>
                <div className="app-subtitle">// BIOSCANNER_v2.0 // MISSION_CRITICAL</div>
                <div className={`cyber-status status-${modelStatus}`} style={{ marginTop: '1.5rem', marginBottom: '0' }}>
                    {modelStatus === "loading" ? ">>> SYS_BOOTING..." : ">>> SCANNER_ONLINE: READY"}
                </div>
            </header>

            <div className="main-content">
                {!imagePreview ? (
                    <div className="cyber-card">
                        <div className="cyber-upload" onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);processFile(e.dataTransfer.files[0])}} onClick={()=>fileInputRef.current.click()}>
                            <input ref={fileInputRef} type="file" hidden onChange={e=>processFile(e.target.files[0])} />
                            <div className="upload-icon">⚡</div>
                            <p>FEED_DATA_PACKET</p>
                            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '1rem' }}>SUPPORTED: JPG_PNG_WEBP</p>
                        </div>
                    </div>
                ) : !predictions ? (
                    <div className="cyber-card">
                        {isAnalyzing && <div className="loading-overlay" style={{ background: 'rgba(0,0,0,0.85)', position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:10 }}>
                            <div className="cyber-loader"></div>
                            <p style={{ marginTop: '1rem', color: 'var(--neon-cyan)' }}>DECRYPTING...</p>
                        </div>}
                        <div className="cyber-preview-container"><img ref={imageRef} src={imagePreview} alt="Target" /></div>
                        <div style={{ display:'flex', gap:'2rem', marginTop:'2rem' }}>
                            <button className="cyber-btn" onClick={predict}>START_SCAN</button>
                            <button className="cyber-btn cyber-btn-magenta" onClick={reset}>DELETE_CACHE</button>
                        </div>
                    </div>
                ) : (
                    <div className="analysis-layout">
                        <div className="image-panel">
                            <div className="cyber-preview-container"><img src={imagePreview} alt="Scanned" /></div>
                            <button className="cyber-btn cyber-btn-magenta game-pop-in delay-5" style={{ width:'100%', marginTop:'2rem' }} onClick={reset}>↺ RE-SCAN_NEW_TARGET</button>
                        </div>
                        <div className="results-panel">
                            <div className="game-pop-in delay-1" style={{ borderLeft:'4px solid var(--neon-magenta)', paddingLeft:'1.5rem' }}>
                                <div className="stat-label">// ANALYSIS_COMPLETED</div>
                                <div className="result-header" style={{ fontSize:'2.5rem', margin:'0.5rem 0', color:'var(--neon-cyan)' }}>{topPrediction.label.toUpperCase()}</div>
                                <div style={{ color:'#fff', fontSize:'0.8rem' }}>{topPrediction.info.description}</div>
                                <div className="percent-bar-container"><div className="percent-bar-fill" style={{ width: animateBars ? `${topPrediction.percentage}%` : '0%' }}></div></div>
                                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem' }}>
                                    <span>ACCURACY: {topPrediction.percentage}%</span>
                                    <span style={{ color: topPrediction.severity==='CRITICAL' ? 'var(--neon-red)' : 'var(--neon-yellow)' }}>THREAT: {topPrediction.severity}</span>
                                </div>
                            </div>
                            <div className="stats-grid" style={{ marginTop:'1rem' }}>
                                {predictions.slice(1).map((pred, i) => (
                                    <div key={pred.label} className={`stat-item game-pop-in delay-${i+2}`}>
                                        <div className="stat-label">{pred.label}</div>
                                        <div className="stat-value">{pred.percentage}%</div>
                                        <div style={{ height:'4px', background:'#222', marginTop:'5px' }}>
                                            <div style={{ height:'100%', background:'var(--neon-cyan)', width: animateBars ? `${pred.percentage}%` : '0%', transition: 'width 2s cubic-bezier(0.1, 0, 0, 1)', transitionDelay: `${(i+3)*0.1}s`, opacity: 0.5 }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {error && <div style={{ color:'var(--neon-red)', border:'1px solid var(--neon-red)', padding:'0.5rem 1rem' }}>[!] ERROR: {error}</div>}
            </div>

            <footer className="cyber-footer">
                <div>SYS: <span className="footer-node">ONLINE</span> // PKT: <span className="footer-id">ENCRYPTED</span></div>
                <div>Project Dev: <span className="footer-id">07SUBHADIP</span> // NODE: {new Date().getHours()}:{new Date().getMinutes()}</div>
                <div>© FRUITNET_TERMINAL_2026</div>
            </footer>
        </main>
    );
}
