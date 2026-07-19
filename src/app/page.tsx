"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ScanFace, Camera, Loader2, KeyRound, UserPlus, Fingerprint, Building2 } from "lucide-react";
import { toast } from "sonner";
import Webcam from "react-webcam";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"business" | "officer" | "manager">("business");
  const router = useRouter();

  // Face Scan state
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [scanMode, setScanMode] = useState<"login" | "register">("login");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emailInput = (e.target as any)[0].value;
      const passInput = (e.target as any)[1].value;

      const res = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify({
          action: tab,
          email: emailInput,
          password: passInput,
          role: selectedRole
        })
      });
      const data = await res.json();

      if (data.success) {
        toast.success(tab === "register" ? "Đăng ký thành công!" : "Đăng nhập thành công!");
        navigateToRole();
      } else {
        toast.error(data.message || "Có lỗi xảy ra");
      }
    } catch (e) {
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  const navigateToRole = () => {
    if (selectedRole === "business") router.push("/business");
    if (selectedRole === "officer") router.push("/officer");
    if (selectedRole === "manager") router.push("/manager");
  };

  const startFaceScan = (mode: "login" | "register") => {
    setScanMode(mode);
    setIsFaceScanning(true);
    setCapturedImage(null);
  };

  const captureFace = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          body: JSON.stringify({
            action: scanMode,
            role: selectedRole,
            isFaceId: true
          })
        });
        const data = await res.json();
        
        if (data.success) {
          toast.success(scanMode === "register" ? "Đã ghi nhận dữ liệu khuôn mặt!" : "Xác thực Face ID thành công!");
          setTimeout(() => {
            setIsFaceScanning(false);
            navigateToRole();
          }, 1500);
        } else {
          toast.error(data.message || "Lỗi xác thực Face ID");
          setIsFaceScanning(false);
        }
      } catch (e) {
        toast.error("Lỗi kết nối máy chủ");
        setIsFaceScanning(false);
      }
    }
  }, [webcamRef, scanMode, selectedRole]);

  return (
    <main className="min-h-screen flex bg-slate-50 font-sans">
      {/* Face Scan Modal */}
      {isFaceScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 p-4 backdrop-blur-sm transition-all duration-300">
          <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-700 text-white w-full max-w-2xl transform scale-100">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div className="w-16"></div>
              <div className="text-center flex flex-col items-center">
                <ScanFace className="w-10 h-10 text-blue-500 mb-2" />
                <h2 className="text-xl font-bold tracking-tight">
                  {scanMode === "register" ? "Đăng ký Face ID" : "Đăng nhập bằng Face ID"}
                </h2>
              </div>
              <button onClick={() => setIsFaceScanning(false)} className="text-slate-400 hover:text-white px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors font-medium">Đóng</button>
            </div>
            
            <div className="relative bg-black flex justify-center items-center min-h-[450px]">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured Face" className="w-full h-[450px] object-cover" />
              ) : (
                <div className="relative w-full h-[450px]">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-[4px] border-blue-500/50 border-dashed rounded-[100px] m-12 animate-pulse pointer-events-none"></div>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-slate-900 flex justify-center">
              {!capturedImage ? (
                <button 
                  onClick={captureFace}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-4 px-10 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <Camera className="w-6 h-6" />
                  Chụp ảnh khuôn mặt
                </button>
              ) : (
                <div className="flex items-center gap-3 text-emerald-400 font-medium bg-emerald-400/10 px-6 py-3 rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  {scanMode === "register" ? "Đang mã hóa dữ liệu sinh trắc..." : "Đang xác thực thông tin..."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Left Column: Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0A192F] text-white flex-col justify-between p-16 shadow-2xl z-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-extrabold tracking-tight">TechBank <span className="font-light text-slate-300">Enterprise</span></h1>
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">Hệ thống Vay vốn & Thẩm định Kỹ thuật số</p>
        </div>
        
        <div className="max-w-md relative z-10 my-20">
          <h2 className="text-5xl font-light leading-tight mb-8">
            Giải pháp tài chính <br/>
            <span className="font-bold text-blue-400">tối ưu cho doanh nghiệp.</span>
          </h2>
          <p className="text-slate-300 leading-relaxed text-lg font-medium">
            Quy trình nộp hồ sơ, bóc tách dữ liệu AI và xét duyệt tín dụng hoàn toàn tự động, minh bạch và nhanh chóng.
          </p>
        </div>
        
        <div className="text-xs text-slate-500 font-medium relative z-10">
          &copy; {new Date().getFullYear()} TechBank. All rights reserved.
        </div>
      </div>

      {/* Right Column: Login/Register Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-12 lg:p-20 overflow-y-auto bg-white">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 lg:hidden flex items-center justify-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">TechBank Enterprise</h1>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10 shadow-inner">
            <button 
              onClick={() => setTab("login")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === "login" ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setTab("register")}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tab === "register" ? 'bg-white text-blue-600 shadow-md transform scale-[1.02]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              Đăng ký
            </button>
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {tab === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
            </h2>
            <p className="text-slate-500 font-medium">Vui lòng chọn phân hệ và xác thực để tiếp tục.</p>
          </div>

          <form onSubmit={handleStandardSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Vai trò truy cập</label>
              <div className="grid grid-cols-1 gap-3">
                <RoleOption value="business" selected={selectedRole} onChange={setSelectedRole} title="Doanh nghiệp" desc="Nộp và theo dõi hồ sơ vay vốn" />
                <RoleOption value="officer" selected={selectedRole} onChange={setSelectedRole} title="Nhân viên Ngân hàng" desc="Thẩm định và đánh giá rủi ro" />
                <RoleOption value="manager" selected={selectedRole} onChange={setSelectedRole} title="Quản lý cấp cao" desc="Phê duyệt quyết định giải ngân" />
              </div>
            </div>

            {/* Simulated standard inputs */}
            <div className="space-y-4">
              <div>
                <input type="email" required placeholder="Địa chỉ Email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder-slate-400" />
              </div>
              <div>
                <input type="password" required placeholder="Mật khẩu" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder-slate-400" />
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <button
                type="submit"
                className="w-full bg-[#0A192F] hover:bg-blue-900 text-white py-4 px-4 rounded-2xl font-bold transition-all flex justify-center items-center gap-3 shadow-lg shadow-[#0A192F]/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                {tab === "login" ? <KeyRound className="w-5 h-5"/> : <UserPlus className="w-5 h-5"/>}
                {tab === "login" ? "Đăng nhập bằng Mật khẩu" : "Đăng ký Tài khoản"}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Hoặc</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={() => startFaceScan(tab)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-4 px-4 rounded-2xl font-bold transition-all flex justify-center items-center gap-3 hover:-translate-y-0.5 active:translate-y-0"
              >
                {tab === "login" ? <Fingerprint className="w-6 h-6"/> : <ScanFace className="w-6 h-6"/>}
                {tab === "login" ? "Đăng nhập nhanh bằng Face ID" : "Đăng ký nhận diện khuôn mặt"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function RoleOption({ value, selected, onChange, title, desc }: any) {
  return (
    <label className={`
      flex items-center p-4 border rounded-2xl cursor-pointer transition-all duration-200
      ${selected === value ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600 shadow-md transform scale-[1.02]' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'}
    `}>
      <input 
        type="radio" 
        value={value} 
        checked={selected === value} 
        onChange={() => onChange(value)}
        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-600 accent-blue-600 cursor-pointer"
      />
      <div className="ml-4 flex flex-col">
        <span className={`block text-sm font-bold ${selected === value ? 'text-blue-900' : 'text-slate-900'}`}>
          {title}
        </span>
        <span className={`block text-xs mt-1 ${selected === value ? 'text-blue-700 font-semibold' : 'text-slate-500 font-medium'}`}>
          {desc}
        </span>
      </div>
    </label>
  );
}
