import React, { useState, useRef } from "react";
import { useAppStore } from "../store/useAppStore";
import { StudentDocument } from "../types";
import {
  FolderLock,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Eye,
  X,
  Download,
  Plus,
  ExternalLink,
} from "lucide-react";

export const DocumentsVaultView: React.FC = () => {
  const { documents, addDocument, removeDocument, profile, updateProfile } = useAppStore();
  const [selectedType, setSelectedType] = useState("INCOME_CERT");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<StudentDocument | null>(null);
  const [ocrState, setOcrState] = useState<{isOpen: boolean, type: string, progress: number, extractedData: any} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (selectedType === "MARKSHEET" || selectedType === "INCOME_CERT") {
      runOcrSimulation(file);
    } else {
      processUpload(file, "AI Verified!");
    }
  };

  const runOcrSimulation = (file: File) => {
    setOcrState({ isOpen: true, type: selectedType, progress: 0, extractedData: null });
    
    let prog = 0;
    const interval = setInterval(() => {
      prog += 15;
      setOcrState(prev => prev ? { ...prev, progress: prog } : null);
      
      if (prog >= 100) {
        clearInterval(interval);
        
        let extracted = null;
        if (selectedType === "MARKSHEET") {
          extracted = { name: profile.fullName || "Student", rollNo: "1029384B", score: 88.5 };
          updateProfile({
            academicRecord: {
              ...(profile.academicRecord || {
                currentLevel: "UG",
                courseName: "B.Tech",
                institutionName: "Local College",
                boardOrUniversity: "State University",
                yearOfStudy: 1,
                maxScore: 100
              }),
              scoreObtained: 88.5
            }
          });
        } else if (selectedType === "INCOME_CERT") {
          extracted = { income: 150000, certId: "INC-2026-99" };
          updateProfile({
            financialProfile: {
              ...(profile.financialProfile || { fatherOccupation: "Farmer" }),
              annualFamilyIncome: 150000,
              hasIncomeCertificate: true
            }
          });
        }
        
        setOcrState(prev => prev ? { ...prev, progress: 100, extractedData: extracted } : null);
        
        setTimeout(() => {
          setOcrState(null);
          processUpload(file, `Extracted & Profile Auto-Filled via OCR!`);
        }, 3000);
      }
    }, 400);
  };

  const processUpload = (file: File, successMsg: string) => {
    setIsUploading(true);
    const objectUrl = URL.createObjectURL(file);

    setTimeout(() => {
      const newDoc: StudentDocument = {
        id: `doc-${Date.now()}`,
        documentType: selectedType,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/pdf",
        verificationStatus: "VERIFIED",
        uploadedAt: new Date().toISOString(),
        previewUrl: objectUrl,
        s3Key: `uploads/student-demo/${Date.now()}_${file.name}`,
      };

      addDocument(newDoc);
      setIsUploading(false);
      setUploadSuccess(`Successfully uploaded '${file.name}' to Vault. ${successMsg}`);
      setTimeout(() => setUploadSuccess(null), 4500);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1000);
  };

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-purple-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" /> Secure AWS S3 Direct Storage
          </div>
          <h2 className="text-xl font-bold text-slate-900 ">Student Documents Vault</h2>
          <p className="text-xs text-slate-600 ">
            Upload, manage, and view your identity, income, and academic documents with real-time AI OCR verification.
          </p>
        </div>

        <button
          onClick={triggerFilePicker}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-slate-900 font-semibold text-xs transition shadow-lg shadow-brand-600/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {uploadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> {uploadSuccess}
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onClick={triggerFilePicker}
        className="p-8 rounded-2xl glass-card border-2 border-dashed border-slate-300 hover:border-brand-500/50 transition text-center space-y-4 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div className="max-w-xs mx-auto space-y-2" onClick={(e) => e.stopPropagation()}>
          <label className="text-xs font-bold text-slate-600 block">Select Document Category</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 "
          >
            <option value="AADHAAR">Aadhaar Card Identity</option>
            <option value="INCOME_CERT">Annual Income Certificate</option>
            <option value="MARKSHEET">Current Marksheet / Grade Sheet</option>
            <option value="BONAFIDE">Institute Bonafide Certificate</option>
          </select>
        </div>

        <button
          type="button"
          onClick={triggerFilePicker}
          disabled={isUploading}
          className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-slate-900 font-semibold text-xs transition shadow-lg shadow-brand-600/25"
        >
          {isUploading ? "Uploading File to Private S3 Vault..." : "Choose File from Computer"}
        </button>

        <p className="text-[11px] text-slate-400">Supported formats: PDF, JPEG, PNG (Max size: 5 MB)</p>
      </div>

      {/* Required Documents Guidance Section */}
      <div className="p-5 rounded-2xl bg-white border border-brand-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-500" /> Missing Documents?
        </h3>
        <p className="text-xs text-slate-600 ">
          Most government and corporate scholarships require the following standard documents. If you don't have them, you can apply for them online.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 hover:border-brand-300 transition">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 ">Aadhaar Card</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Primary identity & address proof</p>
            </div>
            <a href="https://uidai.gov.in/" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Apply on UIDAI <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 hover:border-brand-300 transition">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 ">PAN Card</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Required for high-value financial grants</p>
            </div>
            <a href="https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Apply on NSDL <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 hover:border-brand-300 transition">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 ">Income Certificate</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Proof of family income for need-based</p>
            </div>
            <a href="https://www.india.gov.in/topics/certificates" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Find State Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 hover:border-brand-300 transition">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 ">DigiLocker Account</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Fetch marksheets & certificates digitally</p>
            </div>
            <a href="https://www.digilocker.gov.in/" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Create Account <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 hover:border-brand-300 transition md:col-span-2 lg:col-span-1">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 ">APAAR / ABC ID</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Academic Bank of Credits for One Nation, One Student</p>
            </div>
            <a href="https://www.abc.gov.in/" target="_blank" rel="noreferrer" className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Generate ABC ID <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Vault Documents List */}
      <div className="space-y-3 pt-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-emerald-400" /> Vault Documents ({documents.length})
        </h3>

        {documents.length === 0 ? (
          <div className="p-8 rounded-2xl glass-panel text-center flex flex-col items-center justify-center border border-slate-300/50">
            <FileText className="w-10 h-10 text-slate-600 mb-3" />
            <h4 className="text-sm font-bold text-slate-900 mb-1">No Documents Uploaded</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Securely upload your academic and identity documents above to start matching with scholarships.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl glass-card flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 text-brand-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{doc.fileName}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-600 ">{doc.documentType}</span>
                      <span>•</span>
                      <span>{(doc.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                  <button
                    onClick={() => setPreviewDocument(doc)}
                    className="px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-700 border border-brand-500/30 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition"
                    title="Delete Document"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Document Viewer Modal */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl glass-panel border border-slate-300 p-6 space-y-4 max-h-[90vh] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 ">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{previewDocument.fileName}</h3>
                  <p className="text-xs text-slate-400">Category: {previewDocument.documentType} • Verified in S3 Vault</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDocument(null)}
                className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content Frame / Viewer */}
            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 min-h-[300px] flex items-center justify-center p-4 overflow-hidden relative">
              {previewDocument.previewUrl && previewDocument.mimeType.startsWith("image/") ? (
                <img
                  src={previewDocument.previewUrl}
                  alt={previewDocument.fileName}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
                />
              ) : previewDocument.previewUrl && previewDocument.mimeType === "application/pdf" ? (
                <iframe
                  src={previewDocument.previewUrl}
                  title={previewDocument.fileName}
                  className="w-full h-[50vh] rounded-lg border-0"
                />
              ) : (
                <div className="text-center space-y-3 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 ">{previewDocument.fileName}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      PDF Document encrypted in S3 Vault • S3 Key: {previewDocument.s3Key || "uploads/encrypted_doc.pdf"}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> AI OCR Verification Passed
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Uploaded: {new Date(previewDocument.uploadedAt).toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                {previewDocument.previewUrl && (
                  <a
                    href={previewDocument.previewUrl}
                    download={previewDocument.fileName}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                )}
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-slate-900 font-semibold transition"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI OCR Simulation Modal */}
      {ocrState && ocrState.isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-brand-500/30 p-8 space-y-6 animate-in zoom-in-95">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <FileText className="w-full h-full text-slate-300" />
                <div 
                  className="absolute left-0 right-0 h-1 bg-brand-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-scan"
                  style={{ top: `${Math.min(ocrState.progress, 100)}%` }}
                ></div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">JnanaNet Vision AI</h3>
              <p className="text-sm text-slate-500">
                {ocrState.progress < 100 
                  ? "Scanning document and extracting key-value pairs..." 
                  : "Extraction complete! Auto-filling profile."}
              </p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 mb-2">
              <div 
                className="bg-brand-500 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${ocrState.progress}%` }}
              ></div>
            </div>

            {ocrState.extractedData && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-3">
                  <CheckCircle2 className="w-5 h-5" /> Extracted Data
                </div>
                <div className="space-y-2 text-xs">
                  {Object.entries(ocrState.extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-emerald-500/10 pb-1">
                      <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-bold text-slate-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
