import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/data/db.json');

export const readDB = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      const defaultData = { users: [], applications: [] };
      fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Lỗi đọc DB:", error);
    return { users: [], applications: [] };
  }
};

export const writeDB = (data: any) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Lỗi ghi DB:", error);
    return false;
  }
};
