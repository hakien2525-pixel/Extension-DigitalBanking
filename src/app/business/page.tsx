"use client";

import { useState, useRef, useCallback } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText, Building2, CheckCircle, Camera, ScanFace, FileScan, ChevronRight } from "lucide-react";
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
          finishAndSaveApplication();
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const finishAndSaveApplication = async () => {
    try {
      await fetch('/api/applications', {
        method: 'POST',
        body: JSON.stringify({
          company: "Công ty TNHH Demo Mới",
          amount: loanAmount,
          files: Object.values(files)
        })
      });
      setTimeout(() => setScanStep('result'), 1000);
    } catch (e) {
      toast.error("Không thể lưu hồ sơ");
    }
  };

  const handleReupload = () => {
    setScanStep('idle');
    setCapturedImage(null);
    setOcrProgress(0);
    setFiles({});
    setLoanAmount("");
  };

  const handleLogout = () => {
    toast.success("Đăng xuất thành công");
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      {/* Header */}
      <header className="bg-[#0A192F] text-white py-4 px-8 flex justify-between items-center shadow-lg sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-900/50 rounded-xl">
            <Building2 className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">TechBank <span className="font-light text-slate-300">Enterprise</span></h1>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold shadow-inner">
              C
            </div>
            <span className="font-bold hidden sm:inline tracking-wide">Công ty CP ABC</span>
          </div>
          <button onClick={handleLogout} className="text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-rose-500/80 px-5 py-2.5 rounded-xl font-bold">
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {scanStep === 'idle' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Khởi tạo Hồ sơ Vay vốn</h2>
                <p className="text-slate-500 mt-2 text-base font-medium max-w-xl">
                  Cung cấp thông tin và tài liệu. Hệ thống eKYC của TechBank sẽ yêu cầu xác thực khuôn mặt và tự động bóc tách dữ liệu (OCR).
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
              <form onSubmit={handleStartAnalysis} className="p-8 sm:p-12">
                <div className="space-y-12">
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-lg shadow-sm">1</div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Thông tin khoản vay</h3>
                    </div>
                    <div className="pl-14">
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Số tiền cần giải ngân (VNĐ)</label>
                      <input 
                        type="text" 
                        required
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="VD: 5,000,000,000"
                        className="w-full max-w-md p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900 text-lg placeholder-slate-400"
                      />
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-lg shadow-sm">2</div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Tài liệu đính kèm</h3>
                    </div>
                    <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <UploadSection id="phaply" title="Hồ sơ pháp lý" desc="ĐKKD, CCCD người đại diện" selectedFile={files['phaply']} onFileSelect={(n) => setFiles(p => ({...p, phaply: n}))} />
                      <UploadSection id="taichinh" title="Hồ sơ tài chính" desc="BCTC, Khai báo thuế, Sao kê" selectedFile={files['taichinh']} onFileSelect={(n) => setFiles(p => ({...p, taichinh: n}))} />
                      <UploadSection id="mucdich" title="Mục đích sử dụng vốn" desc="Hợp đồng, Hóa đơn" selectedFile={files['mucdich']} onFileSelect={(n) => setFiles(p => ({...p, mucdich: n}))} />
                      <UploadSection id="taisan" title="Tài sản thế chấp" desc="Giấy chứng nhận QSDĐ" selectedFile={files['taisan']} onFileSelect={(n) => setFiles(p => ({...p, taisan: n}))} />
                    </div>
                  </section>
                </div>

                <div className="mt-14 pt-8 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#0A192F] hover:bg-blue-900 text-white py-4 px-10 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-[#0A192F]/20 hover:-translate-y-0.5 active:translate-y-0 text-lg"
                  >
                    <ScanFace className="w-6 h-6" />
                    Bắt đầu Định danh & Nộp hồ sơ
                    <ChevronRight className="w-5 h-5 ml-2 opacity-70" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 2: Face Scan Modal */}
        {scanStep === 'face-scan' && (
          <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-800 text-white animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center border-b border-slate-800 bg-slate-800/50">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <ScanFace className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Xác thực sinh trắc học (eKYC)</h2>
              <p className="text-slate-400 mt-3 font-medium text-lg">Vui lòng đưa khuôn mặt vào giữa khung hình để xác thực người đại diện pháp luật.</p>
            </div>
            <div className="relative bg-black flex justify-center items-center min-h-[500px]">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full h-[500px] object-cover opacity-80" />
              ) : (
                <div className="relative w-full h-[500px]">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-[6px] border-blue-500/50 border-dashed rounded-[150px] m-16 animate-pulse pointer-events-none"></div>
                </div>
              )}
            </div>
            <div className="p-8 bg-slate-900 flex justify-center items-center">
              {!capturedImage ? (
                <button 
                  onClick={captureFace}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-4 px-12 rounded-full font-bold flex items-center gap-3 transition-all shadow-xl shadow-blue-500/30 text-lg hover:scale-105 active:scale-95"
                >
                  <Camera className="w-6 h-6" />
                  Chụp ảnh xác thực
                </button>
              ) : (
                <div className="flex items-center gap-3 text-emerald-400 font-bold bg-emerald-500/10 px-8 py-4 rounded-2xl text-lg border border-emerald-500/20">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Đang phân tích khuôn mặt...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: OCR Scanning Animation */}
        {scanStep === 'ocr-scan' && (
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-500">
            <div className="p-20 text-center space-y-10">
              <div className="relative w-40 h-48 mx-auto bg-blue-50 rounded-2xl border-4 border-blue-100 overflow-hidden shadow-inner">
                <FileScan className="w-16 h-16 text-blue-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div 
                  className="absolute left-0 right-0 h-1.5 bg-blue-600 shadow-[0_0_20px_5px_rgba(37,99,235,0.6)] transition-all duration-300"
                  style={{ top: `${ocrProgress}%` }}
                ></div>
              </div>
              
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI đang quét và bóc tách dữ liệu (OCR)</h3>
                <p className="text-slate-500 mt-2 text-base font-medium">Trích xuất thông tin từ Giấy phép ĐKKD, Báo cáo tài chính và CCCD.</p>
              </div>

              <div className="w-full max-w-lg mx-auto bg-slate-100 rounded-full h-3 mb-6 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
              </div>
              
              <div className="max-w-lg mx-auto space-y-4 text-base text-slate-700 text-left bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm font-medium">
                <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> <span>Đang đọc Giấy phép kinh doanh... <span className="font-bold text-emerald-600">Hoàn tất</span></span></div>
                {ocrProgress > 50 && (
                  <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> <span>Đang trích xuất Báo cáo tài chính... <span className="font-bold text-emerald-600">Hoàn tất</span></span></div>
                )}
                {ocrProgress > 80 && (
                  <div className="flex items-center gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-500" /> <span>Đối chiếu khuôn mặt với CCCD... <span className="font-bold text-emerald-600">Hoàn tất</span></span></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final Results */}
        {scanStep === 'result' && (
          <div className="bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden animate-in zoom-in duration-500">
            <div className="bg-emerald-50 border-b border-emerald-100 p-12 text-center">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-md">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-extrabold text-emerald-900 tracking-tight">Nộp hồ sơ thành công</h3>
              <p className="text-emerald-700 mt-3 font-bold text-lg">Hồ sơ đã được mã hóa và chuyển tới Thẩm định viên.</p>
            </div>
            
            <div className="p-10">
              <h4 className="font-extrabold text-slate-800 text-xl mb-6 border-b border-slate-100 pb-4">Kết quả phân tích tự động (AI)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 text-emerald-600 font-extrabold mb-4 text-lg">
                    <ScanFace className="w-6 h-6" />
                    Xác thực khuôn mặt
                  </div>
                  <p className="text-base text-slate-600 font-medium leading-relaxed">Khuôn mặt chụp thực tế khớp <strong className="text-emerald-600 text-xl">98.5%</strong> với ảnh trên Căn cước công dân của Người đại diện pháp luật.</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 text-blue-600 font-extrabold mb-4 text-lg">
                    <FileScan className="w-6 h-6" />
                    Trích xuất hồ sơ (OCR)
                  </div>
                  <ul className="text-base text-slate-600 space-y-3 font-medium">
                    <li className="flex justify-between border-b border-slate-100 pb-2"><span>Mã số thuế:</span> <strong className="text-slate-900">0102030405</strong></li>
                    <li className="flex justify-between border-b border-slate-100 pb-2"><span>Loại hình:</span> <strong className="text-slate-900">Công ty Cổ phần</strong></li>
                    <li className="flex justify-between pb-2"><span>Năng lực trả nợ:</span> <strong className="text-emerald-600">Khả thi</strong></li>
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  onClick={handleReupload}
                  className="bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 py-3.5 px-8 rounded-xl font-bold transition-all text-lg"
                >
                  Nộp hồ sơ mới
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="bg-[#0A192F] text-white hover:bg-blue-900 py-3.5 px-10 rounded-xl font-bold transition-all shadow-lg shadow-[#0A192F]/20 text-lg hover:-translate-y-0.5"
                >
                  Về Trang chủ
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
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer text-center group ${
        selectedFile 
          ? 'bg-blue-50/50 border-blue-300 hover:border-blue-400' 
          : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
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
          <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
          <h4 className="text-base font-bold text-slate-900 line-clamp-1">{selectedFile}</h4>
          <span className="text-sm font-bold text-blue-600 mt-2 hover:underline">Thay đổi tệp</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-14 h-14 bg-white text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 group-hover:text-blue-600 group-hover:scale-110 group-hover:shadow-md transition-all">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed px-2">{desc}</p>
        </div>
      )}
    </div>
  );
}
