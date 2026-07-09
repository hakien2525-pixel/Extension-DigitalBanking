"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, Search, Filter, FileText, CheckCircle, AlertTriangle, FileCheck } from "lucide-react";

// Mock data
const applications = [
  {
    id: "HS-2023-1042",
    company: "Công ty CP Kỹ thuật Nam Anh",
    amount: "5,000,000,000 VNĐ",
    date: "12/10/2023",
    status: "pending",
    riskScore: 78,
    aiSummary: "Hồ sơ đầy đủ. Năng lực trả nợ tốt dựa trên BCTC năm ngoái. Có một khoản nợ chú ý tại ngân hàng khác nhưng đã tất toán.",
  },
  {
    id: "HS-2023-1045",
    company: "Công ty TNHH Thương mại Dịch vụ XYZ",
    amount: "2,500,000,000 VNĐ",
    date: "14/10/2023",
    status: "pending",
    riskScore: 45,
    aiSummary: "Rủi ro cao. Báo cáo tài chính cho thấy doanh thu giảm 30% so với cùng kỳ. Lợi nhuận âm trong 2 quý gần nhất.",
  }
];

export default function OfficerDashboard() {
  const router = useRouter();
  const [selectedApp, setSelectedApp] = useState(applications[0]);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handleApprove = () => {
    setActionStatus("Hồ sơ đã được phê duyệt sơ bộ và chuyển lên Quản lý cấp cao.");
    setTimeout(() => setActionStatus(null), 3000);
  };

  const handleReject = () => {
    setActionStatus("Đã gửi yêu cầu bổ sung hồ sơ cho doanh nghiệp.");
    setTimeout(() => setActionStatus(null), 3000);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* Sidebar: Application List */}
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col h-screen">
        <div className="p-6 border-b border-slate-200 bg-[#0A192F] text-white">
          <div className="flex items-center gap-3 mb-6">
            <UserCircle className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="font-bold">TechBank Officer</h1>
              <p className="text-xs text-slate-400">Phân hệ Thẩm định viên</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm mã hồ sơ, tên công ty..." 
              className="w-full bg-slate-800 text-sm text-white placeholder-slate-400 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center text-sm">
            <span className="font-medium text-slate-700">Hồ sơ chờ duyệt (2)</span>
            <button className="text-blue-600 flex items-center gap-1"><Filter className="w-4 h-4"/> Lọc</button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {applications.map(app => (
              <div 
                key={app.id} 
                onClick={() => setSelectedApp(app)}
                className={`p-5 cursor-pointer transition-colors ${selectedApp.id === app.id ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{app.id}</span>
                  <span className="text-xs text-slate-500">{app.date}</span>
                </div>
                <h3 className="font-medium text-slate-900 mb-1">{app.company}</h3>
                <p className="text-sm text-slate-600 font-medium">{app.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Application Details */}
      <div className="w-2/3 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-800">Chi tiết Hồ sơ</h2>
          <button onClick={() => router.push('/')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Đăng xuất
          </button>
        </header>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          
          {actionStatus && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-100 border border-green-200 text-green-800 px-6 py-3 rounded-lg shadow-md flex items-center gap-2 z-50 transition-all duration-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium text-sm">{actionStatus}</span>
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-slate-500">{selectedApp.id}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  Chờ thẩm định sơ bộ
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{selectedApp.company}</h1>
              <div className="mt-4 flex gap-10">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Số tiền đề nghị vay</p>
                  <p className="text-xl font-semibold text-blue-700">{selectedApp.amount}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Ngày nộp hồ sơ</p>
                  <p className="text-lg font-medium text-slate-800">{selectedApp.date}</p>
                </div>
              </div>
            </div>

            {/* AI Analysis Report */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-800">Báo cáo Phân tích từ AI</h3>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100">
                <div className="col-span-1 md:border-r border-slate-100 pr-6">
                  <p className="text-sm text-slate-500 mb-2">Điểm Tín dụng (AI chấm)</p>
                  <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${selectedApp.riskScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedApp.riskScore}
                    </span>
                    <span className="text-slate-400 mb-1 font-medium">/ 100</span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${selectedApp.riskScore >= 70 ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${selectedApp.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Đánh giá chung</p>
                    <p className="text-slate-800 font-medium leading-relaxed">{selectedApp.aiSummary}</p>
                  </div>
                  {selectedApp.riskScore < 50 && (
                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800 leading-relaxed">Cảnh báo rủi ro cao. Cần xem xét kỹ báo cáo tài chính quý gần nhất và yêu cầu giải trình về sự sụt giảm doanh thu.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document List */}
              <div className="p-6">
                <p className="text-sm font-semibold text-slate-700 mb-4">Tài liệu đã được AI bóc tách (OCR)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Giấy ĐKKD</p>
                      <p className="text-xs text-green-600 font-medium">Đã xác thực chữ ký số</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">BCTC Năm 2022</p>
                      <p className="text-xs text-green-600 font-medium">Đã đối chiếu số liệu</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">CCCD Người đại diện</p>
                      <p className="text-xs text-green-600 font-medium">Khớp thông tin ĐKKD</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <FileText className="w-8 h-8 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">Sao kê ngân hàng</p>
                      <p className="text-xs text-slate-500 font-medium">Đang chờ đối chiếu dòng tiền</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={handleReject}
                className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 py-3 rounded-lg font-medium transition-colors"
              >
                Yêu cầu bổ sung hồ sơ
              </button>
              <button 
                onClick={handleApprove}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                Phê duyệt sơ bộ & Chuyển Quản lý
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
