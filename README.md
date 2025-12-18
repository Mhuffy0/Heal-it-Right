## Built With
- **React** (TypeScript)
- **Vite** (Build & Development Framework)
- **CSS (custom)** สำหรับ layout และ responsive
- **HTML5 Video** สำหรับเล่นวิดีโอและหยุดตามจังหวะคำถาม
- **LocalStorage** สำหรับเก็บข้อมูลผู้เล่นบนเครื่องผู้เล่นเท่านั้น ไม่มี Backend

---


## โครงสร้างการไหลของหน้าจอ (Screen Flow)
ไฟล์หลัก:
- `src/App.tsx`  
  เป็นตัวควบคุมการสลับหน้า (menu / patient select / chapter select / chapter pages)

หน้าหลัก:
- `src/pages/MainMenu.tsx` → หน้าเมนู
- `src/pages/PatientSelection.tsx` → เลือกผู้ป่วย (ชาย/หญิง)
- `src/pages/ChapterSelection.tsx` → เลือก Chapter ตามผู้ป่วย
- `src/pages/Chapter1.tsx ... Chapter8.tsx` (และ `src/pages/male/Chapter1.tsx ...`)  
  แต่ละ Chapter ประกอบด้วยวิดีโอ + จุดคำถาม + ส่งผลคะแนน

องค์ประกอบกลาง:
- `src/components/GameLayout.tsx`  
  Layout wrapper (พื้นหลัง/กรอบ UI ร่วม)
- `src/components/ChapterPlayer.tsx` หรือ Player ของ Chapter  
  ควบคุมวิดีโอ, pause, เปิดหน้าคำถาม, timer, resume video
- `src/components/Quiz.tsx`  
  แสดงคำถาม/ตัวเลือก, handle เลือกตอบ, ส่งผลถูก/ผิด/หมดเวลา
- `src/components/ResultScreen.tsx`  
  หน้าสรุปผลต่อคำถาม/ต่อ chapter

---

## Import
รูปแบบโดยทั่วไปในแต่ละ Chapter:
- `src/pages/ChapterX.tsx`
  - import `Quiz` / `ChapterPlayer` / assets (bg, hint, sound, video)
  - รับ props เช่น `patient`, `onBack`, `onNext`
  - เรียก `saveChapterResult(...)` เพื่อบันทึกคะแนน/ความคืบหน้า

ตัวอย่าง flow:
- `App.tsx` → render `PatientSelection`
- เลือกผู้ป่วย → ไป `ChapterSelection`
- เลือกบท → ไป `ChapterX.tsx`
- `ChapterX.tsx` → ใช้ `ChapterPlayer` เล่นวิดีโอ
- ถึงจุด pause → เปิด `Quiz`
- ได้ผลลัพธ์ → `saveSystem.ts` บันทึกลง LocalStorage

---

## Data Storage (บันทึกข้อมูลยังไง)
เก็บทั้งหมดใน Browser ด้วย **LocalStorage** (ไม่มี Backend)

ไฟล์จัดการ save:
- `src/utils/saveSystem.ts`

Logic:
- เก็บเป็น JSON ภายใต้ key เดียว (เช่น `healItRightSave_v1`)
- โครงสร้างข้อมูลหลักโดยทั่วไป:
  - รายชื่อผู้เล่น (players)
  - activePlayerId
  - progress ของแต่ละ chapter (score)
  - chapter unlock status

การใช้งาน:
- ตอนจบ Chapter หรือจบ Quiz → `saveChapterResult(chapterId, score, patient)`  
- เวลาเปิดเกม → โหลดจาก LocalStorage เพื่อคืนค่า progress

---

## Assets (ภาพ/เสียง/วิดีโอ)
- `src/assets/...`
  - `UI/` พื้นหลัง ปุ่ม hint/back ฯลฯ
  - `Sound/` click/correct/wrong/countdown ฯลฯ
  - `ChapterX/` วิดีโอและรูปของแต่ละบท

Call method:
- import โดยตรงในไฟล์ `.tsx` (Vite handle bundling ให้)
- ตัว Video ใช้ `<video src={...} />`

---

## Build / Run
ติดตั้งและรัน:
- `npm install`
- `npm run dev` (local dev)

Build สำหรับ deploy:
- `npm run build`

---

## Notes
- ผม Hard code ตรงส่วนของหน้าแต่ละ chapter ถ้าจะขยายต่อ แนะนำว่าให้เขียนเป็น Class แล้ว Call มาใช้แต่ละหน้า ค่อยเปลี่ยนแค่เนื้อหาก็พอนะครับ
- เวลา Host ผมใช้ Vercel project
- Logic ส่วนใหญ่จะอยู่ใน Components Folder 
- เขียน comment แบ่ง section ในโค้ดแต่ละส่วนว่าอะไรทำงานตรงไหนไว้แล้ว
