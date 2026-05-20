export interface UserProfileData {
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: "male" | "female" | ""
  address: string
  emergencyContact: string
  medicalNotes: string
  accessibilityMode?: "default" | "senior"
}

export interface AuthUser {
  id: string
  email: string
  name: string
  phone?: string
  dateOfBirth?: string
  gender?: "male" | "female" | ""
}

export type RecordType = "vaccination" | "treatment" | "checkup"
export type SourceType = "manual" | "api" | "ocr" | "smartwatch"
export type RiskLevel = "low" | "medium" | "high"

export interface HospitalEntity {
  hospital_id: string
  hospital_name: string
  address: string
}

export interface BodyPartEntity {
  body_part_id: string
  body_name: string
  region: "head" | "chest" | "back" | "leg"
}

export interface HealthDataEntity {
  health_data_id: string
  user_id: string
  data_type: "blood_pressure" | "blood_sugar" | "heart_rate" | "weight" | "activity" | "sleep"
  value: Record<string, string | number>
  source_type: SourceType
  created_at: string
}

export interface DiseaseResult {
  name: string
  riskLevel: RiskLevel
  explanation: string
}

export interface Recommendations {
  diet: string[]
  exercise: string[]
  lifestyle: string[]
}

export interface PredictionResult {
  prediction_id?: string
  user_id?: string
  record_id?: string
  diseases: DiseaseResult[]
  recommendations: Recommendations
  summary?: string
  analyzedAt?: string
  created_at?: string
}

export interface RecommendationEntity {
  recommendation_id: string
  prediction_id: string
  content: string
  created_at: string
}

export interface TreatmentRecordEntity {
  treatment_id: string
  record_id: string
  body_part_id: string
  diagnosis: string
  treatment_detail: string
  treatment_date: string
}

export interface VaccinationRecordEntity {
  vaccination_id: string
  record_id: string
  vaccine_name: string
  dose: number
  next_due_date?: string
  vaccination_date: string
}

export interface PrescriptionEntity {
  prescription_id: string
  treatment_id: string
  medicine_id?: string
  medicine_name?: string
  dosage: string
  duration: string
  issued_date: string
}

export interface MedicalRecord {
  id: string
  record_id: string
  user_id?: string
  hospital_id?: string
  hospitalName?: string
  hospitalAddress?: string
  record_type: RecordType
  source_type: SourceType
  note: string
  created_at: string

  // Legacy UI fields kept for compatibility
  fileName: string
  fileType: "pdf" | "image" | "manual"
  uploadDate: string
  extractedText: string
  department?: string
  diagnosisCode?: string
  visitDate?: string
  source?: "ocr" | "manual"

  treatment?: TreatmentRecordEntity
  vaccination?: VaccinationRecordEntity
  prescription?: PrescriptionEntity
  prediction?: PredictionResult
  recommendation?: RecommendationEntity
}
