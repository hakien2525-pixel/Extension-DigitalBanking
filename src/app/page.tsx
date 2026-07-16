"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ScanFace, Camera, Loader2, KeyRound, UserPlus, Fingerprint } from "lucide-react";
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

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "register") {
      toast.success("Đăng ký thành công bằng Mật khẩu!");
    } else {
      toast.success("Đăng nhập thành công bằng Mật khẩu!");
    }
    navigateToRole();
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

  const captureFace = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      if (scanMode === "register") {
        toast.success("Đã ghi nhận dữ liệu khuôn mặt thành công!");
      } else {
        toast.success("Xác thực Face ID thành công!");
      }
      setTimeout(() => {
        setIsFaceScanning(false);
        navigateToRole();
      }, 1500);
    }
  }, [webcamRef, scanMode, selectedRole]);

  return (
    <main className="min-h-screen flex bg-white font-sans">
      {/* Face Scan Modal */}
      {isFaceScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden relative border border-slate-700 text-white w-full max-w-2xl">
            <div className="p-6 text-center border-b border-slate-800 flex justify-between items-center">
              <div></div>
              <div className="text-center">
                <ScanFace className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold">
                  {scanMode === "register" ? "Đăng ký Face ID" : "Đăng nhập bằng Face ID"}
                </h2>
              </div>
              <button onClick={() => setIsFaceScanning(false)} className="text-slate-400 hover:text-white px-4 py-2 bg-slate-800 rounded-lg">Đóng</button>
            </div>
            
            <div className="relative bg-black flex justify-center items-center min-h-[400px]">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured Face" className="h-[400px] object-cover" />
              ) : (
                <div className="relative w-full">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 border-[6px] border-blue-500/50 border-dashed rounded-[100px] m-10 animate-pulse pointer-events-none"></div>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-900 flex justify-center">
              {!capturedImage ? (
                <button 
                  onClick={captureFace}
                  className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-8 rounded-full font-bold flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Camera className="w-5 h-5" />
                  Quét khuôn mặt
                </button>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {scanMode === "register" ? "Đang mã hóa dữ liệu sinh trắc..." : "Đang xác thực thông tin..."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Left Column: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A192F] text-white flex-col justify-between p-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TechBank Enterprise</h1>
          <p className="text-slate-400 mt-2 text-sm">Hệ thống Vay vốn & Thẩm định Kỹ thuật số</p>
        </div>
        
        <div className="max-w-md">
          <h2 className="text-4xl font-light leading-tight mb-6">
            Giải pháp tài chính <br/>
            <span className="font-bold text-blue-400">tối ưu cho doanh nghiệp.</span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Quy trình nộp hồ sơ, bóc tách dữ liệu AI và xét duyệt tín dụng hoàn toàn tự động, minh bạch và nhanh chóng.
          </p>
        </div>
        
        <div className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} TechBank. All rights reserved.
        </div>
      </div>

      {/* Right Column: Login/Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <h1 className="text-2xl font-bold text-slate-900">TechBank Enterprise</h1>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button 
              onClick={() => setTab("login")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${tab === "login" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setTab("register")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${tab === "register" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Đăng ký
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {tab === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
            </h2>
            <p className="text-slate-500">Vui lòng chọn phân hệ và xác thực để tiếp tục.</p>
          </div>

          <form onSubmit={handleStandardSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Vai trò truy cập</label>
              <div className="grid grid-cols-1 gap-3">
                <RoleOption value="business" selected={selectedRole} onChange={setSelectedRole} title="Doanh nghiệp" desc="Nộp và theo dõi hồ sơ vay vốn" />
                <RoleOption value="officer" selected={selectedRole} onChange={setSelectedRole} title="Nhân viên Ngân hàng" desc="Thẩm định và đánh giá rủi ro" />
                <RoleOption value="manager" selected={selectedRole} onChange={setSelectedRole} title="Quản lý cấp cao" desc="Phê duyệt quyết định giải ngân" />
              </div>
            </div>

            {/* Simulated standard inputs */}
            <div className="space-y-4">
              <div>
                <input type="email" required placeholder="Địa chỉ Email" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
              </div>
              <div>
                <input type="password" required placeholder="Mật khẩu" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium" />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button
                type="submit"
                className="w-full bg-[#0A192F] hover:bg-blue-900 text-white py-3.5 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
              >
                {tab === "login" ? <KeyRound className="w-5 h-5"/> : <UserPlus className="w-5 h-5"/>}
                {tab === "login" ? "Đăng nhập bằng Mật khẩu" : "Đăng ký Tài khoản"}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">HOẶC</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button
                type="button"
                onClick={() => startFaceScan(tab)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-3.5 px-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
              >
                {tab === "login" ? <Fingerprint className="w-5 h-5"/> : <ScanFace className="w-5 h-5"/>}
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
      flex items-center p-4 border rounded-xl cursor-pointer transition-all
      ${selected === value ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'}
    `}>
      <input 
        type="radio" 
        value={value} 
        checked={selected === value} 
        onChange={() => onChange(value)}
        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-600"
      />
      <div className="ml-3 flex flex-col">
        <span className={`block text-sm font-bold ${selected === value ? 'text-blue-900' : 'text-slate-900'}`}>
          {title}
        </span>
        <span className={`block text-xs mt-0.5 ${selected === value ? 'text-blue-700' : 'text-slate-500 font-medium'}`}>
          {desc}
        </span>
      </div>
    </label>
  );
}
