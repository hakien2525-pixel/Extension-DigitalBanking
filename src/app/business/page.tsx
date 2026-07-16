"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText, Building2, CheckCircle, Camera, ScanFace, FileScan } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Webcam from "react-webcam";

type ScanStep = 'idle' | 'face-scan' | 'ocr-scan' | 'result';

export default function BusinessDashboard() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState("");
  const [files, setFiles] = useState<Record<string, string>>({});
  
  const [scanStep, setScanStep] = useState<ScanStep>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanAmount || Object.keys(files).length === 0) {
      toast.error("Vui lòng nhập số tiền và tải lên ít nhất 1 tài liệu.");
      return;
    }
    setScanStep('face-scan');
  };

  const captureFace = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      toast.success("Chụp ảnh khuôn mặt thành công!");
      // Chuyển sang bước quét OCR
      setTimeout(() => {
        setScanStep('ocr-scan');
        simulateOcrScan();
      }, 1500);
    }
  }, [webcamRef]);

  const [ocrProgress, setOcrProgress] = useState(0);

  const simulateOcrScan = () => {
    setOcrProgress(0);
    const interval = setInterval(() => {
      setOcrProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScanStep('result'), 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const handleReupload = () => {
    setScanStep('idle');
    setCapturedImage(null);
    setOcrProgress(0);
  };

  const handleLogout = () => {
    toast.success("Đăng xuất thành công");
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-[#0A192F] text-white py-4 px-8 flex justify-between items-center shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">TechBank <span className="font-light text-slate-300">Enterprise</span></h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold shadow-inner">
              C
            </div>
            <span className="font-medium hidden sm:inline">Công ty CP ABC</span>
          </div>
          <button onClick={handleLogout} className="text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium">
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {scanStep === 'idle' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Khởi tạo Hồ sơ Vay vốn</h2>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                Cung cấp thông tin và tài liệu. Hệ thống eKYC của TechBank sẽ yêu cầu xác thực khuôn mặt và tự động bóc tách dữ liệu (OCR).
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <form onSubmit={handleStartAnalysis} className="p-8 sm:p-10">
                <div className="space-y-10">
                  <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                      <h3 className="text-xl font-bold text-slate-900">Thông tin khoản vay</h3>
                    </div>
                    <div className="pl-11">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Số tiền cần giải ngân (VNĐ)</label>
                      <input 
                        type="text" 
                        required
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="VD: 5,000,000,000"
                        className="w-full max-w-md p-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all text-slate-900 font-medium placeholder-slate-400"
                      />
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                      <h3 className="text-xl font-bold text-slate-900">Tài liệu đính kèm</h3>
                    </div>
                    <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <UploadSection id="phaply" title="Hồ sơ pháp lý" desc="ĐKKD, CCCD người đại diện" selectedFile={files['phaply']} onFileSelect={(n) => setFiles(p => ({...p, phaply: n}))} />
                      <UploadSection id="taichinh" title="Hồ sơ tài chính" desc="BCTC, Khai báo thuế, Sao kê" selectedFile={files['taichinh']} onFileSelect={(n) => setFiles(p => ({...p, taichinh: n}))} />
                      <UploadSection id="mucdich" title="Mục đích sử dụng vốn" desc="Hợp đồng, Hóa đơn" selectedFile={files['mucdich']} onFileSelect={(n) => setFiles(p => ({...p, mucdich: n}))} />
                      <UploadSection id="taisan" title="Tài sản thế chấp" desc="Giấy chứng nhận QSDĐ" selectedFile={files['taisan']} onFileSelect={(n) => setFiles(p => ({...p, taisan: n}))} />
                    </div>
                  </section>
                </div>

                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#0A192F] hover:bg-blue-900 text-white py-3.5 px-8 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-[#0A192F]/20 focus:ring-4 focus:ring-[#0A192F]/20 active:scale-[0.98]"
                  >
                    <ScanFace className="w-5 h-5" />
                    Bắt đầu Định danh & Nộp hồ sơ
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Step 2: Face Scan Modal */}
        {scanStep === 'face-scan' && (
          <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden relative border border-slate-800 text-white">
            <div className="p-8 text-center border-b border-slate-800">
              <ScanFace className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Xác thực sinh trắc học (eKYC)</h2>
              <p className="text-slate-400 mt-2">Vui lòng đưa khuôn mặt vào giữa khung hình để xác thực người đại diện pháp luật.</p>
            </div>
            <div className="relative bg-black flex justify-center items-center min-h-[400px]">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="h-[400px] object-cover" />
              ) : (
                <div className="relative w-full max-w-[500px]">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full rounded-lg"
                  />
                  {/* Face outline overlay */}
                  <div className="absolute inset-0 border-[6px] border-blue-500/50 border-dashed rounded-[100px] m-10 animate-pulse pointer-events-none"></div>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-900 flex justify-center">
              {!capturedImage ? (
                <button 
                  onClick={captureFace}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-full font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Camera className="w-5 h-5" />
                  Chụp ảnh xác thực
                </button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang phân tích khuôn mặt...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: OCR Scanning Animation */}
        {scanStep === 'ocr-scan' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-16 text-center space-y-8">
              <div className="relative w-32 h-40 mx-auto bg-blue-50 rounded-lg border-2 border-blue-200 overflow-hidden shadow-inner">
                <FileScan className="w-12 h-12 text-blue-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                {/* Laser scan line */}
                <div 
                  className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.5)] transition-all duration-300"
                  style={{ top: `${ocrProgress}%` }}
                ></div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-900">AI đang quét và bóc tách dữ liệu (OCR)...</h3>
                <p className="text-slate-500 mt-2 text-sm">Trích xuất thông tin từ Giấy phép ĐKKD, Báo cáo tài chính và CCCD.</p>
              </div>

              <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-2.5 mb-4">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
              </div>
              
              <div className="max-w-md mx-auto space-y-3 text-sm text-slate-700 text-left bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span>Đang đọc Giấy phép kinh doanh... <span className="font-semibold text-emerald-600">Hoàn tất</span></span></div>
                {ocrProgress > 50 && (
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span>Đang trích xuất Báo cáo tài chính... <span className="font-semibold text-emerald-600">Hoàn tất</span></span></div>
                )}
                {ocrProgress > 80 && (
                  <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span>Đối chiếu khuôn mặt với CCCD... <span className="font-semibold text-emerald-600">Hoàn tất</span></span></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final Results */}
        {scanStep === 'result' && (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 overflow-hidden">
            <div className="bg-emerald-50 border-b border-emerald-100 p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900">Nộp hồ sơ thành công</h3>
              <p className="text-emerald-700 mt-2 font-medium">Hồ sơ đã được mã hóa và chuyển tới Thẩm định viên.</p>
            </div>
            
            <div className="p-8">
              <h4 className="font-bold text-slate-800 mb-4 border-b pb-2">Kết quả phân tích tự động (AI)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                    <ScanFace className="w-5 h-5" />
                    Xác thực khuôn mặt
                  </div>
                  <p className="text-sm text-slate-700">Khuôn mặt chụp thực tế khớp <strong className="text-emerald-600 text-lg">98.5%</strong> với ảnh trên Căn cước công dân của Người đại diện pháp luật.</p>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
                    <FileScan className="w-5 h-5" />
                    Trích xuất hồ sơ (OCR)
                  </div>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>Mã số thuế: <strong>0102030405</strong></li>
                    <li>Loại hình: <strong>Công ty Cổ phần</strong></li>
                    <li>Năng lực trả nợ: <strong className="text-emerald-600">Khả thi</strong> (Dựa trên BCTC)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex justify-end gap-4">
                <button 
                  onClick={handleReupload}
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2.5 px-6 rounded-xl font-semibold transition-all"
                >
                  Nộp hồ sơ mới
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-[#0A192F] text-white hover:bg-blue-900 py-2.5 px-8 rounded-xl font-semibold transition-all"
                >
                  Quay về Trang chủ
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function UploadSection({ 
  id, title, desc, selectedFile, onFileSelect 
}: { 
  id: string, title: string, desc: string, selectedFile?: string, onFileSelect: (name: string) => void 
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0].name);
      toast.success(`Đã chọn tệp: ${e.target.files[0].name}`);
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer text-center group ${
        selectedFile 
          ? 'bg-blue-50 border-blue-300 hover:border-blue-400' 
          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
      }`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.png,.jpg,.jpeg,.zip"
      />
      
      {selectedFile ? (
        <div className="flex flex-col items-center justify-center h-full">
          <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
          <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{selectedFile}</h4>
          <span className="text-xs font-medium text-blue-600 mt-2 hover:underline">Thay đổi tệp</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 bg-white text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100 group-hover:text-blue-600 group-hover:scale-110 group-hover:shadow-md transition-all">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed px-2">{desc}</p>
        </div>
      )}
    </div>
  );
}
