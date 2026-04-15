import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

const QRScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);
  const regionRef = useRef(null);

  useEffect(() => {
    let html5QrCode;
    
    // Délai pour s'assurer que le container DOM est bien rendu et a ses dimensions
    const timer = setTimeout(() => {
        try {
            html5QrCode = new Html5Qrcode("reader");
            scannerRef.current = html5QrCode;

            const config = { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0, // Important pour Safari
                disableFlip: false
            };

            html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    onScanSuccess(decodedText);
                },
                (errorMessage) => {
                    // Ignorer les erreurs de scan continu
                }
            ).catch((err) => {
                console.error("Erreur de caméra:", err);
                // Alerte utile pour le debug sur mobile
                if (err.toString().includes("NotAllowedError")) {
                    alert("Accès caméra refusé par le navigateur.");
                } else {
                    alert("Erreur Caméra: " + err);
                }
            });
        } catch (e) {
            console.error("Erreur Init Scanner:", e);
        }
    }, 500);

    return () => {
        clearTimeout(timer);
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
                scannerRef.current.clear();
            }).catch(err => console.error("Nettoyage scanner:", err));
        }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden">
      <div className="w-full max-w-lg aspect-square relative bg-slate-900 rounded-3xl border-2 border-ynov/50 overflow-hidden shadow-2xl shadow-ynov/20">
        <div id="reader" className="w-full h-full"></div>
        
        {/* Overlay scanning effect */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="w-64 h-64 border-2 border-ynov rounded-lg relative overflow-hidden">
                <div className="w-full h-0.5 bg-ynov shadow-[0_0_15px_rgba(140,45,45,0.8)] absolute top-0 left-0 animate-[scan_3s_infinite_ease-in-out]"></div>
            </div>
            <p className="mt-8 text-ynov font-black italic tracking-widest text-lg animate-pulse uppercase">Scanning Badge...</p>
        </div>
      </div>

      <button 
        onClick={onClose}
        className="mt-12 flex items-center gap-2 px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800 transition-all text-slate-400 hover:text-white"
      >
        <X className="w-5 h-5" /> Annuler
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
        }
        #reader video {
            object-fit: cover !important;
            width: 100% !important;
            height: 100% !important;
        }
      `}} />
    </div>
  );
};

export default QRScanner;
