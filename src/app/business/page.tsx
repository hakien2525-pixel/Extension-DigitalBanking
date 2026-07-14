"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText, Building2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BusinessDashboard() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ status: 'idle' | 'success' | 'error', message: string }>({ status: 'idle', message: '' });
  
  // Track selected files
  const [files, setFiles] = useState<Record<string, string>>({});

  const handleAiAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanAmount || Object.keys(files).length === 0) {
      toast.error("Vui lòng nhập số tiền và tải lên ít nhất 1 tài liệu.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult({ status: 'idle', message: '' });
    
    // Simulate AI scanning and extraction
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simulate finding an error in the documents to show AI capability
      setAnalysisResult({
        status: 'error',
        message: 'AI phát hiện: Thiếu mặt sau CCCD của người đại diện pháp luật. Vui lòng bổ sung để tiếp tục.'
      });
      toast.error("Phân tích hồ sơ chưa đạt. Yêu cầu bổ sung tài liệu.");
    }, 4000);
  };

  const handleReupload = () => {
    setAnalysisResult({ status: 'idle', message: '' });
    toast.info("Vui lòng tải lên tài liệu bổ sung.");
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Khởi tạo Hồ sơ Vay vốn</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Cung cấp thông tin và tài liệu. Hệ thống AI của TechBank sẽ tự động bóc tách dữ liệu và đánh giá hồ sơ trong vài giây.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {analysisResult.status === 'error' ? (
            <div className="p-10 text-center space-y-4">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Phân tích hồ sơ chưa đạt</h3>
              <p className="text-red-600 font-medium max-w-md mx-auto leading-relaxed">{analysisResult.message}</p>
              <div className="pt-6">
                <button 
                  onClick={handleReupload}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-8 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20"
                >
                  Bổ sung hồ sơ ngay
                </button>
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="p-16 text-center space-y-8">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <Loader2 className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">AI đang quét và bóc tách dữ liệu...</h3>
                <p className="text-slate-500 mt-2 text-sm">Quá trình này mất khoảng vài giây. Vui lòng không đóng trình duyệt.</p>
              </div>
              
              <div className="max-w-md mx-auto space-y-3 text-sm text-slate-700 text-left bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span>Đang đọc Giấy phép kinh doanh... <span className="font-semibold text-emerald-600">Hoàn tất</span></span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> <span>Đang phân tích Báo cáo tài chính... <span className="font-semibold text-emerald-600">Hoàn tất</span></span></div>
                <div className="flex items-center gap-3 text-blue-600 font-medium"><Loader2 className="w-5 h-5 animate-spin" /> <span>Đang trích xuất thông tin CCCD...</span></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAiAnalysis} className="p-8 sm:p-10">
              <div className="space-y-10">
                {/* Loan Amount */}
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

                {/* Document Uploads */}
                <section>
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                    <h3 className="text-xl font-bold text-slate-900">Tài liệu đính kèm</h3>
                  </div>
                  <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <UploadSection 
                      id="phaply" 
                      title="Hồ sơ pháp lý" 
                      desc="ĐKKD, CCCD người đại diện" 
                      selectedFile={files['phaply']}
                      onFileSelect={(name) => setFiles(prev => ({...prev, phaply: name}))}
                    />
                    <UploadSection 
                      id="taichinh" 
                      title="Hồ sơ tài chính" 
                      desc="BCTC, Khai báo thuế, Sao kê 6 tháng" 
                      selectedFile={files['taichinh']}
                      onFileSelect={(name) => setFiles(prev => ({...prev, taichinh: name}))}
                    />
                    <UploadSection 
                      id="mucdich" 
                      title="Mục đích sử dụng vốn" 
                      desc="Hợp đồng, Hóa đơn, Phiếu XNK" 
                      selectedFile={files['mucdich']}
                      onFileSelect={(name) => setFiles(prev => ({...prev, mucdich: name}))}
                    />
                    <UploadSection 
                      id="taisan" 
                      title="Tài sản thế chấp" 
                      desc="Giấy chứng nhận QSDĐ, HĐ thế chấp" 
                      selectedFile={files['taisan']}
                      onFileSelect={(name) => setFiles(prev => ({...prev, taisan: name}))}
                    />
                  </div>
                </section>
              </div>

              <div className="mt-12 pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#0A192F] hover:bg-blue-900 text-white py-3.5 px-8 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-[#0A192F]/20 focus:ring-4 focus:ring-[#0A192F]/20 active:scale-[0.98]"
                >
                  <FileText className="w-5 h-5" />
                  Nộp hồ sơ & Phân tích AI
                </button>
              </div>
            </form>
          )}
        </div>
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
