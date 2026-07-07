"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"business" | "officer" | "manager">("business");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "business") router.push("/business");
    if (selectedRole === "officer") router.push("/officer");
    if (selectedRole === "manager") router.push("/manager");
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* Left Column: Branding (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A192F] text-white flex-col justify-between p-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TechBank Enterprise</h1>
          <p className="text-slate-400 mt-2 text-sm">Hệ thống Vay vốn & Thẩm định Kỹ thuật số</p>
        </div>
        
        <div className="max-w-md">
          <h2 className="text-4xl font-light leading-tight mb-6">
            Giải pháp tài chính <br/>
            <span className="font-semibold text-blue-400">tối ưu cho doanh nghiệp.</span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Quy trình nộp hồ sơ, bóc tách dữ liệu AI và xét duyệt tín dụng hoàn toàn tự động, minh bạch và nhanh chóng.
          </p>
        </div>
        
        <div className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} TechBank. All rights reserved.
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <h1 className="text-2xl font-bold text-slate-900">TechBank Enterprise</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-slate-900 mb-2">Đăng nhập</h2>
            <p className="text-slate-500">Vui lòng chọn phân hệ truy cập hệ thống</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Vai trò truy cập
              </label>
              
              <div className="grid grid-cols-1 gap-3">
                <label className={`
                  flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                  ${selectedRole === 'business' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}
                `}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="business" 
                    checked={selectedRole === 'business'} 
                    onChange={() => setSelectedRole('business')}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600"
                  />
                  <div className="ml-3 flex flex-col">
                    <span className={`block text-sm font-medium ${selectedRole === 'business' ? 'text-blue-900' : 'text-slate-900'}`}>
                      Doanh nghiệp
                    </span>
                    <span className={`block text-xs mt-0.5 ${selectedRole === 'business' ? 'text-blue-700' : 'text-slate-500'}`}>
                      Nộp và theo dõi hồ sơ vay vốn
                    </span>
                  </div>
                </label>

                <label className={`
                  flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                  ${selectedRole === 'officer' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}
                `}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="officer" 
                    checked={selectedRole === 'officer'} 
                    onChange={() => setSelectedRole('officer')}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600"
                  />
                  <div className="ml-3 flex flex-col">
                    <span className={`block text-sm font-medium ${selectedRole === 'officer' ? 'text-blue-900' : 'text-slate-900'}`}>
                      Nhân viên Ngân hàng
                    </span>
                    <span className={`block text-xs mt-0.5 ${selectedRole === 'officer' ? 'text-blue-700' : 'text-slate-500'}`}>
                      Thẩm định và đánh giá rủi ro
                    </span>
                  </div>
                </label>

                <label className={`
                  flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                  ${selectedRole === 'manager' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}
                `}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="manager" 
                    checked={selectedRole === 'manager'} 
                    onChange={() => setSelectedRole('manager')}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600"
                  />
                  <div className="ml-3 flex flex-col">
                    <span className={`block text-sm font-medium ${selectedRole === 'manager' ? 'text-blue-900' : 'text-slate-900'}`}>
                      Quản lý cấp cao
                    </span>
                    <span className={`block text-xs mt-0.5 ${selectedRole === 'manager' ? 'text-blue-700' : 'text-slate-500'}`}>
                      Phê duyệt quyết định giải ngân
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0A192F] hover:bg-[#112240] text-white py-3.5 px-4 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A192F]"
            >
              Tiếp tục
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
