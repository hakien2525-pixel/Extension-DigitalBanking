"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, Search, Filter, FileText, AlertTriangle, FileCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OfficerDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/applications?status=pending');
      const data = await res.json();
      if (data.success) {
        setApplications(data.data);
        if (data.data.length > 0) setSelectedApp(data.data[0]);
      }
    } catch (e) {
      toast.error("Lỗi tải danh sách hồ sơ");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApps = applications.filter(app => 
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async () => {
    if (!selectedApp) return;
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        body: JSON.stringify({
          id: selectedApp.id,
          status: 'pending_final',
          officerNote: 'Hồ sơ pháp lý và tài chính hợp lệ. Đề xuất duyệt.',
          officerName: 'Thẩm định viên (System)'
        })
      });
      if (res.ok) {
        toast.success("Đã phê duyệt sơ bộ!", { description: `Hồ sơ ${selectedApp.id} đã chuyển lên Quản lý.` });
        fetchApps(); // Reload list
        setSelectedApp(null);
      }
    } catch (e) {
      toast.error("Lỗi duyệt hồ sơ");
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        body: JSON.stringify({
          id: selectedApp.id,
          status: 'rejected',
          officerNote: 'Hồ sơ chưa đạt yêu cầu.'
        })
      });
      if (res.ok) {
        toast.error("Yêu cầu bổ sung", { description: `Đã thông báo cho doanh nghiệp.` });
        fetchApps();
        setSelectedApp(null);
      }
    } catch (e) {
      toast.error("Lỗi từ chối hồ sơ");
    }
  };

  const handleLogout = () => {
    toast.success("Đăng xuất thành công");
    router.push('/');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar: Application List */}
      <div className="w-1/3 min-w-[350px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col h-screen z-10 shadow-sm relative">
        <div className="p-6 border-b border-slate-200 bg-[#0A192F] text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-900/50 p-2 rounded-xl">
              <UserCircle className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">TechBank Officer</h1>
              <p className="text-xs text-blue-200 font-medium">Phân hệ Thẩm định viên</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã hồ sơ, tên công ty..." 
              className="w-full bg-slate-800/50 text-sm text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hồ sơ chờ duyệt ({filteredApps.length})</span>
            <button 
              onClick={() => toast.info("Tính năng lọc nâng cao đang được phát triển.")}
              className="text-blue-600 flex items-center gap-1.5 text-sm font-semibold hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
            >
              <Filter className="w-4 h-4"/> Lọc
            </button>
          </div>
          
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
            ) : filteredApps.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm font-medium">Chưa có hồ sơ chờ duyệt.</div>
            ) : (
              filteredApps.map(app => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  className={`p-5 cursor-pointer transition-all ${
                    selectedApp?.id === app.id 
                      ? 'bg-blue-50/80 border-l-4 border-blue-600 shadow-sm relative z-0' 
                      : 'hover:bg-white border-l-4 border-transparent bg-slate-50/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      selectedApp?.id === app.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {app.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{app.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1.5 leading-snug">{app.company}</h3>
                  <p className="text-sm text-blue-700 font-semibold">{app.amount}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Application Details */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Chi tiết Hồ sơ Thẩm định</h2>
          <button 
            onClick={handleLogout} 
            className="text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
          >
            Đăng xuất
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
          {!selectedApp ? (
            <div className="h-full flex items-center justify-center text-slate-400 font-medium text-lg">
              Vui lòng chọn một hồ sơ từ danh sách để xem chi tiết
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
              {/* Title Section */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{selectedApp.id}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Chờ thẩm định sơ bộ
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{selectedApp.company}</h1>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1.5">Số tiền đề nghị vay</p>
                    <p className="text-xl font-bold text-blue-700">{selectedApp.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1.5">Ngày nộp hồ sơ</p>
                    <p className="text-lg font-semibold text-slate-800">{selectedApp.date}</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis Report */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50/80 border-b border-slate-200 px-8 py-5 flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-slate-800 text-lg">Báo cáo Phân tích từ AI</h3>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-100">
                  <div className="col-span-1 md:border-r border-slate-100 pr-8 flex flex-col justify-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Điểm Tín dụng (AI chấm)</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className={`text-6xl font-black ${selectedApp.riskScore >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {selectedApp.riskScore}
                      </span>
                      <span className="text-slate-400 font-bold text-xl">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${selectedApp.riskScore >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                        style={{ width: `${selectedApp.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 space-y-5">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Đánh giá chung</p>
                      <p className="text-slate-800 font-medium leading-relaxed text-lg bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {selectedApp.aiSummary}
                      </p>
                    </div>
                    {selectedApp.riskScore < 70 && (
                      <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-rose-800 mb-1">Cảnh báo rủi ro</h4>
                          <p className="text-sm text-rose-700 leading-relaxed font-medium">Hồ sơ có dấu hiệu rủi ro. Cần xem xét kỹ thêm báo cáo tài chính.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document List */}
                <div className="p-8">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">Tài liệu đính kèm ({selectedApp.files?.length || 0})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedApp.files?.map((file: string, idx: number) => (
                       <DocumentStatus key={idx} icon="Check" title={file} status="Đã bóc tách thành công" active />
                    ))}
                    {!selectedApp.files?.length && <p className="text-slate-500 text-sm">Không có file chi tiết.</p>}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleReject}
                  className="flex-1 bg-white border-2 border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-700 hover:bg-rose-50 py-4 rounded-xl font-bold transition-all focus:ring-4 focus:ring-rose-100"
                >
                  Yêu cầu bổ sung hồ sơ
                </button>
                <button 
                  onClick={handleApprove}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 focus:ring-4 focus:ring-blue-600/20 active:scale-[0.98]"
                >
                  Phê duyệt sơ bộ & Chuyển Quản lý
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocumentStatus({ active, title, status, icon }: { active?: boolean, title: string, status: string, icon: 'Check' | 'Wait' }) {
  return (
    <div className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${active ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}>
      <div className={`p-2.5 rounded-lg ${active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
        <FileText className="w-6 h-6" />
      </div>
      <div>
        <p className={`font-bold line-clamp-1 ${active ? 'text-slate-900' : 'text-slate-700'}`}>{title}</p>
        <p className={`text-xs font-semibold mt-0.5 ${active ? 'text-emerald-600' : 'text-slate-500'}`}>{status}</p>
      </div>
    </div>
  );
}
