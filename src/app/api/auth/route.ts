import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, role, isFaceId } = body;
    
    const db = readDB();

    if (action === 'register') {
      // Đăng ký
      const userExists = db.users.find((u: any) => u.email === email && u.role === role);
      if (userExists && !isFaceId) {
        return NextResponse.json({ success: false, message: 'Email đã tồn tại!' }, { status: 400 });
      }
      
      const newUser = {
        id: `USR-${Date.now()}`,
        email: email || `faceid_${Date.now()}@techbank.com`,
        password: password || null,
        role,
        isFaceId: !!isFaceId,
        createdAt: new Date().toISOString()
      };
      
      db.users.push(newUser);
      writeDB(db);
      return NextResponse.json({ success: true, user: newUser });
    }

    if (action === 'login') {
      if (isFaceId) {
        // Giả lập login Face ID luôn thành công
        return NextResponse.json({ success: true, message: 'Xác thực Face ID thành công' });
      }

      // Login bằng password
      const user = db.users.find((u: any) => u.email === email && u.password === password && u.role === role);
      if (!user) {
        return NextResponse.json({ success: false, message: 'Sai email hoặc mật khẩu' }, { status: 401 });
      }
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
