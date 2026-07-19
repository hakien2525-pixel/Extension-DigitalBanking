import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

// GET danh sách hồ sơ (có thể lọc theo status)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // 'pending', 'pending_final', 'approved', 'rejected'
  
  const db = readDB();
  let apps = db.applications;

  if (status) {
    apps = apps.filter((app: any) => app.status === status);
  }

  // Sắp xếp mới nhất lên đầu
  apps.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ success: true, data: apps });
}

// POST: Tạo hồ sơ mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = readDB();

    const newApp = {
      id: `HS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...body, // company, amount, files
      date: new Date().toLocaleDateString('vi-VN'),
      createdAt: new Date().toISOString(),
      status: 'pending', // Trạng thái mặc định chờ Thẩm định viên
      riskScore: Math.floor(Math.random() * (99 - 50) + 50), // Random điểm AI từ 50-99
      aiSummary: 'Hồ sơ đầy đủ các loại giấy tờ bắt buộc. Đã phân tích tự động thành công.',
      officerNote: '',
      officerName: ''
    };

    db.applications.push(newApp);
    writeDB(db);

    return NextResponse.json({ success: true, data: newApp });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}

// PATCH: Cập nhật trạng thái hồ sơ (Phê duyệt / Từ chối)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, officerNote, officerName } = body;
    
    const db = readDB();
    const appIndex = db.applications.findIndex((app: any) => app.id === id);

    if (appIndex === -1) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy hồ sơ' }, { status: 404 });
    }

    db.applications[appIndex] = {
      ...db.applications[appIndex],
      status: status || db.applications[appIndex].status,
      officerNote: officerNote !== undefined ? officerNote : db.applications[appIndex].officerNote,
      officerName: officerName !== undefined ? officerName : db.applications[appIndex].officerName,
      updatedAt: new Date().toISOString()
    };

    writeDB(db);
    return NextResponse.json({ success: true, data: db.applications[appIndex] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi server' }, { status: 500 });
  }
}
