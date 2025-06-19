export interface Dataset {
  id: string;
  title: string; // ชื่อชุดข้อมูล
  project: string; // ใช้ในโปรเจกต์
  description: string; // คำอธิบาย
  sourceName: string; // หน่วยงานเจ้าของข้อมูล
  sourceLink: string; // ลิงก์ต้นทาง
  fileType: string; // ประเภทไฟล์
  dateAcquired: string; // วันที่ได้ข้อมูล
  dateUpdated: string; // วันที่อัปเดตล่าสุด
  license: string; // สิทธิ์การใช้งาน
  tags: string[]; // แท็ก
}

export interface FilterOptions {
  fileType: string[];
  tags: string[];
  province: string[];
}

export interface SearchFilters {
  searchTerm: string;
  selectedFileTypes: string[];
  selectedTags: string[];
  selectedProvinces: string[];
}
