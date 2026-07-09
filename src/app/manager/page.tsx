"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, Filter, CheckCircle, XCircle, Building2, TrendingUp, DollarSign } from "lucide-react";

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
  const [actionStatus, setActionStatus] = useState<{type: 'approve' | 'reject', message: string} | null>(null);

  const handleFinalApprove = () => {
    setActionStatus({
      type: 'approve',
      message: "Đã PHÊ DUYỆT GIẢI NGÂN thành công. Hệ thống đang tạo khế ước nhận nợ."
    });
    setTimeout(() => setActionStatus(null), 4000);
  };

  const handleReject = () => {
    setActionStatus({
      type: 'reject',
      message: "Đã TỪ CHỐI giải ngân. Thông báo đã được gửi về cho Nhân viên và Doanh nghiệp."
    });
    setTimeout(() => setActionStatus(null), 4000);
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      
      {/* Sidebar: Application List */}
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col h-screen">
        <div className="p-6 border-b border-slate-200 bg-[#0c4a6e] text-white">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="font-bold">TechBank Executive</h1>
              <p className="text-xs text-blue-200">Phân hệ Quản lý cấp cao</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-blue-300" />
            <input 
              type="text" 
              placeholder="Tìm kiếm hồ sơ chờ giải ngân..." 
              className="w-full bg-[#073654] text-sm text-white placeholder-blue-300 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-amber-400 border border-[#0c4a6e]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center text-sm bg-slate-50">
            <span className="font-semibold text-slate-800">Chờ quyết định cuối (1)</span>
            <button className="text-blue-700 flex items-center gap-1 font-medium"><Filter className="w-4 h-4"/> Lọc</button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {applications.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className={`p-5 cursor-pointer transition-colors ${selectedApp.id === app.id ? 'bg-blue-50 border-l-4 border-[#0c4a6e]' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">{app.id}</span>
                  <span className="text-xs text-slate-500 font-medium">{app.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{app.company}</h3>
                <p className="text-sm text-blue-700 font-bold flex items-center gap-1">
                  <DollarSign className="w-4 h-4" /> {app.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Application Details */}
      <div className="w-2/3 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-800">Quyết định Cấp tín dụng</h2>
          <button onClick={() => router.push('/')} className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors">
            Đăng xuất
          </button>
        </header>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          
          {actionStatus && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50 transition-all duration-300 font-medium text-sm
              ${actionStatus.type === 'approve' ? 'bg-green-100 border border-green-300 text-green-900' : 'bg-red-100 border border-red-300 text-red-900'}
            `}>
              {actionStatus.type === 'approve' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span>{actionStatus.message}</span>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Title Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-slate-500">{selectedApp.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                    Đã qua thẩm định sơ bộ
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-slate-400" />
                  {selectedApp.company}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1 font-medium">Đề xuất giải ngân</p>
                <p className="text-2xl font-bold text-green-700">{selectedApp.amount}</p>
              </div>
            </div>

            {/* Officer's Note Section */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-blue-100 bg-blue-100/50 flex items-center justify-between">
                <h3 className="font-bold text-blue-900">Ý kiến Thẩm định viên</h3>
                <span className="text-xs font-medium text-blue-800">{selectedApp.officerName}</span>
              </div>
              <div className="p-6">
                <p className="text-blue-900 font-medium leading-relaxed">
                  "{selectedApp.officerNote}"
                </p>
              </div>
            </div>

            {/* AI Summary Section (Condensed) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-800">Tóm tắt Rủi ro (Hệ thống AI)</h3>
              </div>
              <div className="p-6 flex items-center gap-8">
                <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-green-500 shrink-0">
                  <span className="text-4xl font-bold text-slate-900">{selectedApp.riskScore}</span>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-wider mt-1">An Toàn</span>
                </div>
                <div>
                  <p className="text-slate-800 font-medium leading-relaxed">{selectedApp.aiSummary}</p>
                  <div className="mt-4 flex gap-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                      <CheckCircle className="w-4 h-4" /> BCTC Hợp lệ
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                      <CheckCircle className="w-4 h-4" /> Pháp lý Đầy đủ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Actions */}
            <div className="pt-8 flex gap-4">
              <button 
                onClick={handleReject}
                className="w-1/3 bg-white border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 py-4 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Từ chối Giải ngân
              </button>
              <button 
                onClick={handleFinalApprove}
                className="w-2/3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 text-lg"
              >
                <CheckCircle className="w-6 h-6" />
                Quyết định Giải ngân
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
