"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, Filter, CheckCircle, XCircle, Building2, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";

// Mock data for Manager (these are pre-approved by officer)
const applications = [
  {
    id: "HS-2023-1042",
    company: "Công ty CP Kỹ thuật Nam Anh",
    amount: "5,000,000,000 VNĐ",
    date: "12/10/2023",
    status: "pending_final",
    riskScore: 78,
    aiSummary: "Hồ sơ đầy đủ. Năng lực trả nợ tốt dựa trên BCTC năm ngoái. Có một khoản nợ chú ý tại ngân hàng khác nhưng đã tất toán.",
    officerNote: "Đã thẩm định các tài sản thế chấp khớp với hồ sơ pháp lý. Đề xuất giải ngân mức tối đa 5 tỷ.",
    officerName: "Nguyễn Văn A (Mã NV: 10234)"
  }
];

export default function ManagerDashboard() {
  const router = useRouter();
  const [selectedApp, setSelectedApp] = useState(applications[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = applications.filter(app => 
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFinalApprove = () => {
    toast.success("PHÊ DUYỆT THÀNH CÔNG", {
      description: `Đã phê duyệt giải ngân cho ${selectedApp.company}. Hệ thống đang tạo khế ước nhận nợ.`,
      duration: 5000,
    });
  };

  const handleReject = () => {
    toast.error("TỪ CHỐI GIẢI NGÂN", {
      description: `Đã từ chối cấp tín dụng. Thông báo đã được gửi về cho Nhân viên và Doanh nghiệp.`,
      duration: 5000,
    });
  };

  const handleLogout = () => {
    toast.success("Đăng xuất thành công");
    router.push('/');
  };

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-900">
      
      {/* Sidebar: Application List */}
      <div className="w-1/3 min-w-[350px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col h-screen z-10 shadow-sm relative">
        <div className="p-6 border-b border-slate-200 bg-[#0c4a6e] text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-amber-400/20 p-2 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">TechBank Executive</h1>
              <p className="text-xs text-blue-200 font-medium">Phân hệ Quản lý cấp cao</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-blue-300" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm hồ sơ chờ giải ngân..." 
              className="w-full bg-[#073654] text-sm text-white placeholder-blue-300/70 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 border border-[#0c4a6e] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chờ quyết định cuối ({filteredApps.length})</span>
            <button 
              onClick={() => toast.info("Tính năng lọc nâng cao đang được phát triển.")}
              className="text-blue-700 flex items-center gap-1.5 text-sm font-bold hover:bg-blue-100 px-2 py-1 rounded-md transition-colors"
            >
              <Filter className="w-4 h-4"/> Lọc
            </button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {filteredApps.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">Không tìm thấy hồ sơ phù hợp.</div>
            ) : (
              filteredApps.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  className={`p-5 cursor-pointer transition-all ${
                    selectedApp.id === app.id 
                      ? 'bg-blue-50/80 border-l-4 border-[#0c4a6e] shadow-sm relative z-0' 
                      : 'hover:bg-white border-l-4 border-transparent bg-slate-50/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2.5">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                      selectedApp.id === app.id ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {app.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{app.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 leading-snug">{app.company}</h3>
                  <p className="text-sm text-blue-700 font-bold flex items-center gap-1.5 bg-blue-50 w-fit px-2 py-0.5 rounded-md">
                    <DollarSign className="w-4 h-4" /> {app.amount}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Application Details */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-100">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Quyết định Cấp tín dụng</h2>
          <button 
            onClick={handleLogout} 
            className="text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors"
          >
            Đăng xuất
          </button>
        </header>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
          
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Title Section */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{selectedApp.id}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Đã qua thẩm định sơ bộ
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Building2 className="w-8 h-8 text-slate-500" />
                  </div>
                  {selectedApp.company}
                </h1>
              </div>
              <div className="text-left md:text-right w-full md:w-auto bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none border md:border-none border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Đề xuất giải ngân</p>
                <p className="text-3xl font-black text-emerald-600">{selectedApp.amount}</p>
              </div>
            </div>

            {/* Officer's Note Section */}
            <div className="bg-blue-50/80 rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="px-8 py-4 border-b border-blue-100 bg-blue-100/50 flex items-center justify-between">
                <h3 className="font-bold text-blue-900 text-lg">Ý kiến Thẩm định viên</h3>
                <span className="text-xs font-bold text-blue-800 uppercase bg-blue-200/50 px-3 py-1 rounded-md">{selectedApp.officerName}</span>
              </div>
              <div className="p-8">
                <p className="text-blue-900 font-medium leading-relaxed text-lg italic">
                  "{selectedApp.officerNote}"
                </p>
              </div>
            </div>

            {/* AI Summary Section (Condensed) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50/80 border-b border-slate-200 px-8 py-4 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-slate-600" />
                <h3 className="font-bold text-slate-800 text-lg">Tóm tắt Rủi ro (Hệ thống AI)</h3>
              </div>
              <div className="p-8 flex flex-col md:flex-row items-center gap-10">
                <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full border-[6px] border-emerald-500 shrink-0 bg-emerald-50 shadow-inner">
                  <span className="text-5xl font-black text-slate-900">{selectedApp.riskScore}</span>
                  <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider mt-2">An Toàn</span>
                </div>
                <div>
                  <p className="text-slate-800 font-medium leading-relaxed text-lg bg-slate-50 p-5 rounded-xl border border-slate-100">{selectedApp.aiSummary}</p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                      <CheckCircle className="w-5 h-5" /> BCTC Hợp lệ
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                      <CheckCircle className="w-5 h-5" /> Pháp lý Đầy đủ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Actions */}
            <div className="pt-6 flex flex-col md:flex-row gap-4">
              <button 
                onClick={handleReject}
                className="w-full md:w-1/3 bg-white border-2 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 py-4.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 focus:ring-4 focus:ring-rose-100 active:scale-[0.98]"
              >
                <XCircle className="w-6 h-6" />
                Từ chối Giải ngân
              </button>
              <button 
                onClick={handleFinalApprove}
                className="w-full md:w-2/3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-4.5 rounded-xl font-bold transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 text-lg focus:ring-4 focus:ring-emerald-600/30 active:scale-[0.98]"
              >
                <CheckCircle className="w-7 h-7" />
                Quyết định Giải ngân
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
