"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, Filter, CheckCircle, XCircle, Building2, TrendingUp, DollarSign, Loader2, BarChart3, ListChecks } from "lucide-react";
import { toast } from "sonner";

export default function ManagerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'review' | 'analytics'>('review');
  const [applications, setApplications] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]); // For analytics
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await fetch('/api/applications'); // Fetch all
      const data = await res.json();
      if (data.success) {
        setAllApplications(data.data);
        const pendingFinal = data.data.filter((a: any) => a.status === 'pending_final');
        setApplications(pendingFinal);
        if (pendingFinal.length > 0) setSelectedApp(pendingFinal[0]);
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

  const handleFinalApprove = async () => {
    if (!selectedApp) return;
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        body: JSON.stringify({ id: selectedApp.id, status: 'approved' })
      });
      if (res.ok) {
        toast.success("PHÊ DUYỆT THÀNH CÔNG", { description: `Đã giải ngân cho ${selectedApp.company}` });
        fetchApps();
        setSelectedApp(null);
      }
    } catch (e) {
      toast.error("Lỗi phê duyệt");
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        body: JSON.stringify({ id: selectedApp.id, status: 'rejected' })
      });
      if (res.ok) {
        toast.error("TỪ CHỐI GIẢI NGÂN", { description: `Đã từ chối cấp tín dụng cho ${selectedApp.company}` });
        fetchApps();
        setSelectedApp(null);
      }
    } catch (e) {
      toast.error("Lỗi từ chối");
    }
  };

  const handleLogout = () => {
    toast.success("Đăng xuất thành công");
    router.push('/');
  };

  // Analytics Math
  const totalApps = allApplications.length;
  const approvedApps = allApplications.filter(a => a.status === 'approved').length;
  const rejectedApps = allApplications.filter(a => a.status === 'rejected').length;
  const totalMoneyStr = allApplications
    .filter(a => a.status === 'approved')
    .reduce((acc, curr) => acc + parseInt(curr.amount.replace(/\D/g, '') || '0'), 0)
    .toLocaleString('vi-VN');

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <div className="w-20 lg:w-64 bg-[#0A192F] text-white flex flex-col h-screen shrink-0 relative z-20">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-700">
          <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
          <span className="hidden lg:block ml-3 font-extrabold text-lg tracking-tight">TechBank <span className="text-amber-400 font-light">Exec</span></span>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2 px-3">
          <button 
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'review' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <ListChecks className="w-6 h-6 shrink-0" />
            <span className="hidden lg:block font-bold text-sm">Phê duyệt ( {applications.length} )</span>
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <BarChart3 className="w-6 h-6 shrink-0" />
            <span className="hidden lg:block font-bold text-sm">Tổng quan Thống kê</span>
          </button>
        </div>
        <div className="p-4 border-t border-slate-700">
          <button onClick={handleLogout} className="w-full text-center text-sm font-bold text-slate-400 hover:text-white transition-colors">Đăng xuất</button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        // Analytics Tab
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Báo cáo Tổng quan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-sm font-bold text-slate-400 uppercase mb-2">Tổng hồ sơ nhận được</p>
              <p className="text-4xl font-black text-slate-900">{totalApps}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm bg-emerald-50/30">
              <p className="text-sm font-bold text-emerald-600 uppercase mb-2">Đã giải ngân</p>
              <p className="text-4xl font-black text-emerald-700">{approvedApps}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm bg-rose-50/30">
              <p className="text-sm font-bold text-rose-600 uppercase mb-2">Bị từ chối</p>
              <p className="text-4xl font-black text-rose-700">{rejectedApps}</p>
            </div>
            <div className="bg-gradient-to-br from-[#0A192F] to-[#0f284e] p-6 rounded-2xl shadow-xl text-white">
              <p className="text-sm font-bold text-slate-400 uppercase mb-2">Tổng tiền giải ngân</p>
              <p className="text-3xl font-black text-amber-400">{totalMoneyStr} ₫</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Biểu đồ giả lập (Tỷ lệ phê duyệt)</h3>
            <div className="flex items-center gap-4">
              <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden flex">
                <div className="bg-emerald-500 h-full flex items-center justify-center text-xs font-bold text-white transition-all" style={{ width: `${totalApps ? (approvedApps/totalApps)*100 : 0}%` }}>
                  {approvedApps > 0 && `${Math.round((approvedApps/totalApps)*100)}%`}
                </div>
                <div className="bg-rose-500 h-full flex items-center justify-center text-xs font-bold text-white transition-all" style={{ width: `${totalApps ? (rejectedApps/totalApps)*100 : 0}%` }}>
                  {rejectedApps > 0 && `${Math.round((rejectedApps/totalApps)*100)}%`}
                </div>
              </div>
            </div>
            <div className="flex gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-sm font-bold text-slate-600">Duyệt</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-sm font-bold text-slate-600">Từ chối</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300"></div><span className="text-sm font-bold text-slate-600">Đang chờ</span></div>
            </div>
          </div>
        </div>
      ) : (
        // Review Tab (Split View)
        <div className="flex-1 flex overflow-hidden">
          {/* Sub Sidebar: Application List */}
          <div className="w-[350px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
            <div className="p-5 border-b border-slate-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm hồ sơ chờ giải ngân..." 
                  className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 transition-all font-medium"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-50">
              {isLoading ? (
                <div className="p-8 text-center flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
              ) : filteredApps.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm font-medium">Chưa có hồ sơ chờ duyệt.</div>
              ) : (
                filteredApps.map(app => (
                  <div 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)}
                    className={`p-5 border-b border-slate-100 cursor-pointer transition-all ${
                      selectedApp?.id === app.id 
                        ? 'bg-blue-50/80 border-l-4 border-blue-600 shadow-sm relative z-0' 
                        : 'hover:bg-white border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2.5">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                        selectedApp?.id === app.id ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
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

          {/* Main Content: Detail */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 relative">
            <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800">Quyết định Cấp tín dụng</h2>
            </header>

            <div className="p-8 lg:p-12">
              {!selectedApp ? (
                <div className="h-full flex items-center justify-center text-slate-400 font-medium text-lg">
                  Vui lòng chọn hồ sơ để duyệt
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-8 pb-20">
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

                  <div className="bg-blue-50/80 rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                    <div className="px-8 py-4 border-b border-blue-100 bg-blue-100/50 flex items-center justify-between">
                      <h3 className="font-bold text-blue-900 text-lg">Ý kiến Thẩm định viên</h3>
                      <span className="text-xs font-bold text-blue-800 uppercase bg-blue-200/50 px-3 py-1 rounded-md">{selectedApp.officerName || 'Thẩm định viên (Hệ thống)'}</span>
                    </div>
                    <div className="p-8">
                      <p className="text-blue-900 font-medium leading-relaxed text-lg italic">
                        "{selectedApp.officerNote}"
                      </p>
                    </div>
                  </div>

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
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={handleReject}
                      className="w-full md:w-1/3 bg-white border-2 border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 py-4.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 focus:ring-4 focus:ring-rose-100 active:scale-[0.98]"
                    >
                      <XCircle className="w-6 h-6" /> Từ chối
                    </button>
                    <button 
                      onClick={handleFinalApprove}
                      className="w-full md:w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white py-4.5 rounded-xl font-bold transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 text-lg focus:ring-4 focus:ring-emerald-600/30 active:scale-[0.98]"
                    >
                      <CheckCircle className="w-7 h-7" /> Giải ngân
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
