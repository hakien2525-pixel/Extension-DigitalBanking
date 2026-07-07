"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, FileText, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BusinessDashboard() {
  const router = useRouter();
  const [loanAmount, setLoanAmount] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ status: 'idle' | 'success' | 'error', message: string }>({ status: 'idle', message: '' });

  const handleAiAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
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
    }, 4000);
  };

  const handleReupload = () => {
    setAnalysisResult({ status: 'idle', message: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0A192F] text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight">TechBank <span className="font-light text-slate-300">Enterprise</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center font-bold">
              C
            </div>
            <span>Công ty CP ABC</span>
          </div>
          <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white transition-colors">
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Khởi tạo Hồ sơ Vay vốn</h2>
          <p className="text-slate-500 mt-1">Cung cấp thông tin và tài liệu để hệ thống AI tự động bóc tách và đánh giá.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {analysisResult.status === 'error' ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Phân tích hồ sơ chưa đạt</h3>
              <p className="text-red-600 font-medium">{analysisResult.message}</p>
              <div className="pt-4">
                <button 
                  onClick={handleReupload}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  Bổ sung hồ sơ
                </button>
              </div>
            </div>
          ) : isAnalyzing ? (
            <div className="p-12 text-center space-y-6">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-slate-900">AI đang quét và bóc tách dữ liệu...</h3>
                <p className="text-slate-500 mt-2">Quá trình này mất khoảng vài giây. Vui lòng không đóng trình duyệt.</p>
              </div>
              
              <div className="max-w-md mx-auto space-y-3 text-sm text-slate-600 text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> <span>Đang đọc Giấy phép kinh doanh... Hoàn tất</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> <span>Đang phân tích Báo cáo tài chính... Hoàn tất</span></div>
                <div className="flex items-center gap-2 text-blue-600"><Loader2 className="w-4 h-4 animate-spin" /> <span>Đang trích xuất thông tin CCCD...</span></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAiAnalysis} className="p-8">
              <div className="space-y-8">
                {/* Loan Amount */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">1. Thông tin khoản vay</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Số tiền cần giải ngân (VNĐ)</label>
                    <input 
                      type="text" 
                      required
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="VD: 5,000,000,000"
                      className="w-full max-w-md p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900"
                    />
                  </div>
                </div>

                {/* Document Uploads */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">2. Tài liệu đính kèm</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    <UploadSection title="Hồ sơ pháp lý" desc="ĐKKD, CCCD người đại diện" />
                    <UploadSection title="Hồ sơ tài chính" desc="BCTC, Khai báo thuế, Sao kê 6 tháng" />
                    <UploadSection title="Mục đích sử dụng vốn" desc="Hợp đồng, Hóa đơn, Phiếu XNK" />
                    <UploadSection title="Tài sản thế chấp" desc="Giấy chứng nhận QSDĐ, Hợp đồng thế chấp" />

                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#0A192F] hover:bg-[#112240] text-white py-3 px-8 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
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

function UploadSection({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="border border-slate-300 border-dashed rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-center group">
      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
        <UploadCloud className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
      <div className="mt-3">
        <span className="text-xs font-medium text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-200 shadow-sm inline-block">
          Chọn file tải lên
        </span>
      </div>
    </div>
  );
}
