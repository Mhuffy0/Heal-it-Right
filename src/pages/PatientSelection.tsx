import React from "react";
import "./PatientSelection.css";

export type PatientId = "female" | "male";

type PatientInfo = {
  id: PatientId;
  name: string;
  subtitle: string;
  description: string;
  image: string;
};

type Props = {
  onBack?: () => void;
  onSelectPatient: (id: PatientId) => void;
};

// TODO: swap these image paths to your real ones
import femaleImg from "../assets/Patients/female.png";
import maleImg from "../assets/Patients/male.png";

const PATIENTS: PatientInfo[] = [
  {
    id: "female",
    name: "ผู้ป่วยหญิงไทย อายุ 72 ปี ",
    subtitle: "เคส 1",
    description:
      "นอนโรงพยาบาลจากข้อเข่าเสื่อมรุนแรง เคลื่อนไหวลำบาก ต้องพึ่งพาผู้อื่นในการช่วยพลิกตัว หลีกเลี่ยงการขยับตัวเพราะปวดข้อ ร่วมกับความดันโลหิตสูงควบคุมไม่ดี ผลประเมิน Braden score เท่ากับ 15 คะแนน พบบริเวณก้นกบมีผิวหนังแดงไม่จางเมื่อกด ผิวอุ่นกว่าบริเวณอื่น ขนาดพื้นที่แดงประมาณ 3×3 ซม. ผู้ป่วยบอกว่าปวดหนึบๆ เมื่อสัมผัส",
    image: femaleImg,
  },
  {
    id: "male",
    name: "ผู้ป่วยชายไทย อายุ 88 ปี ",
    subtitle: "เคส 2",
    description:
      "มีภาวะสมองเสื่อม หัวใจล้มเหลว และควบคุมการขับถ่ายไม่ได้ ต้องใช้ผ้าอ้อมตลอดเวลา รับประทานอาหารได้น้อย ผล Braden score = 8 คะแนน พบบริเวณก้นกบมีแผลลึกลงถึงโครงสร้างใต้ผิวหนัง ขนาดประมาณ 5×6 ซม. ลึก 2.5 ซม. มีหนองและ กลิ่นเหม็น ผู้ป่วยตอบสนองความเจ็บลดลง",
    image: maleImg,
  },
];

export default function PatientSelection({ onBack, onSelectPatient }: Props) {
  return (
    <div className="ps-root">
      <div className="ps-bg" />

      <div className="ps-layer">
        <header className="ps-header">
          {onBack && (
            <button className="ps-back-btn" onClick={onBack}>
              กลับ
            </button>
          )}
          <div>
            <h1 className="ps-title">เลือกผู้ป่วย</h1>
            <p className="ps-subtitle">
              เลือกเคสผู้ป่วยที่ต้องการเข้าไปดูเนื้อหาและทำแบบฝึกหัด
            </p>
          </div>
        </header>

        <div className="ps-card-list">
          {PATIENTS.map((p) => (
            <button
              key={p.id}
              className="ps-card"
              onClick={() => onSelectPatient(p.id)}
            >
              <div className="ps-card-left">
                <img src={p.image} className="ps-avatar" />
              </div>

              <div className="ps-card-right">
                <div className="ps-card-header">
                  <h2 className="ps-card-title">{p.name}</h2>
                  <div className="ps-card-tag">{p.subtitle}</div>
                </div>

                <p className="ps-card-desc">{p.description}</p>

                <div className="ps-card-footer">
                  <span className="ps-card-hint">
                    กดเพื่อไปหน้าเลือกบทเรียนของเคสนี้
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
