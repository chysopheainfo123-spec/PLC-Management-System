import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, CheckCircle, XCircle } from 'lucide-react';

export default function ScannerTab({ token, showToast, uiLang }: { token: string, showToast: any, uiLang?: string }) {
  const [localLang, setLocalLang] = useState(uiLang || localStorage.getItem("plc_lang") || "kh");

  useEffect(() => {
    if (uiLang) {
      setLocalLang(uiLang);
    }
  }, [uiLang]);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      setLocalLang(e.detail);
    };
    window.addEventListener("plcLanguageChange", handleLangChange);
    return () => window.removeEventListener("plcLanguageChange", handleLangChange);
  }, []);

  const localIdt = (kh: string, en?: string) => {
    if (localLang === "en") return en || kh;
    return kh;
  };

  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    }, false);

    scanner.render(
      async (decodedText) => {
        scanner.pause();
        setScanResult(decodedText);
        try {
          const res = await fetch("/api/attendance/scan", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ idNumber: decodedText })
          });
          
          if (res.ok) {
            const data = await res.json();
            setStatus('success');
            const studentName = data.nameKh || data.nameEn || data.name;
            setMessage(localIdt(`បានកត់ត្រាវត្តមានសម្រាប់ ${studentName}`, `Attendance recorded for ${studentName}`));
            showToast(localIdt("បានកត់ត្រាវត្តមានជោគជ័យ!", "Attendance recorded successfully!"), "success");
          } else {
            setStatus('error');
            setMessage(localIdt("លេខសម្គាល់មិនត្រឹមត្រូវ ឬមានកំហុសកើតឡើង", "Invalid ID or error occurred"));
          }
        } catch (err) {
          setStatus('error');
          setMessage(localIdt("កំហុសបណ្តាញការតភ្ជាប់", "Network error"));
        }
        
        setTimeout(() => {
          setScanResult(null);
          setStatus('idle');
          setMessage('');
          scanner.resume();
        }, 3000);
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => {
      scanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [token, localLang]);

  return (
    <div className="p-6">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
        <QrCode className="w-5 h-5 text-primary-600" />
        {localIdt("ប្រព័ន្ធស្កេនកាតវៃឆ្លាត (Smart QR Scanner)", "Smart QR Scanner")}
      </h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div id="reader" className="max-w-md mx-auto"></div>
        
        {scanResult && (
          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
            <div>
              <p className="font-bold">{localIdt("បានស្កេន៖", "Scanned:")} {scanResult}</p>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
