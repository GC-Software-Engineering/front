"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { Brain, Calendar as CalendarIcon, Eye, FileText, PlusCircle, ScanText, Search, Trash2, Upload, X } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { RecordPrediction } from "@/components/record-prediction"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { MedicalRecord, RecordType, SourceType } from "@/lib/types"

const STORAGE_KEY = "medicalRecords_v2"
const sampleTexts = [
  "Blood pressure elevated. ECG check recommended. Follow-up after 2 weeks.",
  "Vitamin D low. Sleep pattern unstable. Moderate activity advised.",
  "Knee pain after exercise. Physical therapy and stretching recommended.",
]

const defaultForm = {
  fileName: "",
  hospitalName: "",
  hospitalAddress: "",
  recordType: "treatment" as RecordType,
  sourceType: "manual" as SourceType,
  visitDate: "",
  note: "",
  diagnosis: "",
  bodyPart: "",
  treatmentDetail: "",
  vaccineName: "",
  dose: "1",
  nextDueDate: "",
  dosage: "",
  duration: "",
}

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [searchDate, setSearchDate] = useState<Date | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [activeTab, setActiveTab] = useState("records")
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("medicalRecords")
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as MedicalRecord[]
      setRecords(parsed)
    } catch {
      console.error("Failed to parse saved records")
    }
  }, [])

  const saveRecords = useCallback((next: MedicalRecord[]) => {
    setRecords(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    localStorage.setItem("medicalRecords", JSON.stringify(next))
  }, [])

  const createBaseRecord = (partial: Partial<MedicalRecord>): MedicalRecord => {
    const id = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    return {
      id,
      record_id: id,
      fileName: partial.fileName || "Untitled record",
      fileType: partial.fileType || "manual",
      uploadDate: timestamp,
      created_at: timestamp,
      extractedText: partial.extractedText || "",
      record_type: partial.record_type || "treatment",
      source_type: partial.source_type || "manual",
      source: partial.source || "manual",
      note: partial.note || "",
      visitDate: partial.visitDate,
      hospitalName: partial.hospitalName,
      hospitalAddress: partial.hospitalAddress,
      department: partial.department,
      diagnosisCode: partial.diagnosisCode,
      treatment: partial.treatment,
      vaccination: partial.vaccination,
      prescription: partial.prescription,
      prediction: partial.prediction,
      recommendation: partial.recommendation,
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
    const uploadedRecord = createBaseRecord({
      fileName: file.name,
      fileType: file.type.includes("pdf") ? "pdf" : "image",
      record_type: "checkup",
      source_type: "ocr",
      source: "ocr",
      extractedText: text,
      note: text,
      visitDate: new Date().toISOString().split("T")[0],
      hospitalName: "Scanned outside hospital",
      diagnosisCode: `OCR-${Math.floor(Math.random() * 900 + 100)}`,
    })

    saveRecords([uploadedRecord, ...records])
    setIsUploading(false)
    toast.success("OCR record created")
    e.target.value = ""
  }

  const handleManualAdd = () => {
    if (!form.fileName || !form.visitDate || !form.note || !form.hospitalName) {
      toast.error("Please fill title, hospital, visit date, and note")
      return
    }

    const base = createBaseRecord({
      fileName: form.fileName,
      fileType: "manual",
      record_type: form.recordType,
      source_type: form.sourceType,
      source: form.sourceType === "ocr" ? "ocr" : "manual",
      extractedText: form.note,
      note: form.note,
      visitDate: form.visitDate,
      hospitalName: form.hospitalName,
      hospitalAddress: form.hospitalAddress,
      diagnosisCode: form.diagnosis || undefined,
      department:
        form.recordType === "vaccination"
          ? "Vaccination"
          : form.recordType === "checkup"
            ? "Checkup"
            : "Treatment",
    })

    const record: MedicalRecord = {
      ...base,
      treatment:
        form.recordType === "treatment"
          ? {
              treatment_id: crypto.randomUUID(),
              record_id: base.record_id,
              body_part_id: form.bodyPart || "body-general",
              diagnosis: form.diagnosis || "General diagnosis",
              treatment_detail: form.treatmentDetail || form.note,
              treatment_date: form.visitDate,
            }
          : undefined,
      vaccination:
        form.recordType === "vaccination"
          ? {
              vaccination_id: crypto.randomUUID(),
              record_id: base.record_id,
              vaccine_name: form.vaccineName || "Vaccination record",
              dose: Number(form.dose || 1),
              next_due_date: form.nextDueDate || undefined,
              vaccination_date: form.visitDate,
            }
          : undefined,
      prescription:
        form.recordType === "treatment" && form.dosage
          ? {
              prescription_id: crypto.randomUUID(),
              treatment_id: crypto.randomUUID(),
              dosage: form.dosage,
              duration: form.duration || "As directed",
              issued_date: form.visitDate,
            }
          : undefined,
    }

    saveRecords([record, ...records])
    setForm(defaultForm)
    toast.success("Record added based on ERD structure")
  }

  const handleDelete = (id: string) => {
    const next = records.filter((record) => record.id !== id)
    saveRecords(next)
    if (selectedRecord?.id === id) setSelectedRecord(null)
    toast.success("Record deleted")
  }

  const handlePredictionComplete = (recordId: string, prediction: MedicalRecord["prediction"]) => {
    const next = records.map((record) =>
      record.id === recordId
        ? {
            ...record,
            prediction,
            recommendation: prediction
              ? {
                  recommendation_id: crypto.randomUUID(),
                  prediction_id: prediction.prediction_id || crypto.randomUUID(),
                  content: prediction.recommendations.lifestyle.join(" / "),
                  created_at: new Date().toISOString(),
                }
              : undefined,
          }
        : record,
    )
    saveRecords(next)
    setSelectedRecord((prev) => (prev ? next.find((r) => r.id === prev.id) || null : null))
  }

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesQuery =
        !q ||
        record.fileName.toLowerCase().includes(q) ||
        record.note.toLowerCase().includes(q) ||
        (record.hospitalName || "").toLowerCase().includes(q) ||
        (record.treatment?.diagnosis || "").toLowerCase().includes(q) ||
        (record.vaccination?.vaccine_name || "").toLowerCase().includes(q)

      const matchesDate =
        !searchDate ||
        (record.visitDate && format(new Date(record.visitDate), "yyyy-MM-dd") === format(searchDate, "yyyy-MM-dd"))

      return matchesQuery && matchesDate
    })
  }, [records, searchDate, searchQuery])

  const detailItems = selectedRecord
    ? [
        ["Record type", selectedRecord.record_type],
        ["Hospital", selectedRecord.hospitalName || "Not set"],
        ["Visit date", selectedRecord.visitDate || format(new Date(selectedRecord.uploadDate), "yyyy-MM-dd")],
        ["Source", selectedRecord.source_type],
        ["Diagnosis", selectedRecord.treatment?.diagnosis || selectedRecord.diagnosisCode || "Not available"],
      ]
    : []

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="rounded-3xl border bg-gradient-to-r from-cyan-50 via-white to-sky-50 p-6 shadow-sm">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Medical Records</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500">
            This screen now follows your ERD structure: Medical_record as the base, then Treatment, Vaccination, Prescription, AI Prediction, and Recommendation.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="records"><FileText className="mr-2 h-4 w-4" />Records</TabsTrigger>
            <TabsTrigger value="prediction"><Brain className="mr-2 h-4 w-4" />AI Prediction</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="mt-6 space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5 text-primary" />Direct record input</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Record title</Label>
                      <Input value={form.fileName} onChange={(e) => setForm((p) => ({ ...p, fileName: e.target.value }))} placeholder="2026 annual checkup" />
                    </div>
                    <div>
                      <Label>Visit date</Label>
                      <Input type="date" value={form.visitDate} onChange={(e) => setForm((p) => ({ ...p, visitDate: e.target.value }))} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Hospital name</Label>
                      <Input value={form.hospitalName} onChange={(e) => setForm((p) => ({ ...p, hospitalName: e.target.value }))} placeholder="Gachon Medical Center" />
                    </div>
                    <div>
                      <Label>Hospital address</Label>
                      <Input value={form.hospitalAddress} onChange={(e) => setForm((p) => ({ ...p, hospitalAddress: e.target.value }))} placeholder="Seongnam-si, Gyeonggi-do" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Record type</Label>
                      <Select value={form.recordType} onValueChange={(value: RecordType) => setForm((p) => ({ ...p, recordType: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="treatment">Treatment</SelectItem>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="checkup">Checkup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Source type</Label>
                      <Select value={form.sourceType} onValueChange={(value: SourceType) => setForm((p) => ({ ...p, sourceType: value }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="ocr">OCR</SelectItem>
                          <SelectItem value="smartwatch">Smartwatch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {form.recordType === "treatment" && (
                    <div className="rounded-2xl border bg-slate-50 p-4 space-y-4">
                      <p className="text-sm font-semibold text-slate-700">Treatment_record fields</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Diagnosis</Label>
                          <Input value={form.diagnosis} onChange={(e) => setForm((p) => ({ ...p, diagnosis: e.target.value }))} placeholder="Lumbar pain" />
                        </div>
                        <div>
                          <Label>Body part</Label>
                          <Select value={form.bodyPart} onValueChange={(value) => setForm((p) => ({ ...p, bodyPart: value }))}>
                            <SelectTrigger><SelectValue placeholder="Select body part" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="head">Head</SelectItem>
                              <SelectItem value="chest">Chest</SelectItem>
                              <SelectItem value="back">Back</SelectItem>
                              <SelectItem value="leg">Leg</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Treatment detail</Label>
                        <Textarea rows={3} value={form.treatmentDetail} onChange={(e) => setForm((p) => ({ ...p, treatmentDetail: e.target.value }))} placeholder="Physical therapy, medication, doctor memo" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Prescription dosage</Label>
                          <Input value={form.dosage} onChange={(e) => setForm((p) => ({ ...p, dosage: e.target.value }))} placeholder="1 tablet after meal" />
                        </div>
                        <div>
                          <Label>Prescription duration</Label>
                          <Input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="7 days" />
                        </div>
                      </div>
                    </div>
                  )}

                  {form.recordType === "vaccination" && (
                    <div className="rounded-2xl border bg-slate-50 p-4 space-y-4">
                      <p className="text-sm font-semibold text-slate-700">Vaccination_record fields</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Vaccine name</Label>
                          <Input value={form.vaccineName} onChange={(e) => setForm((p) => ({ ...p, vaccineName: e.target.value }))} placeholder="Influenza vaccine" />
                        </div>
                        <div>
                          <Label>Dose</Label>
                          <Input type="number" min="1" value={form.dose} onChange={(e) => setForm((p) => ({ ...p, dose: e.target.value }))} />
                        </div>
                      </div>
                      <div>
                        <Label>Next due date</Label>
                        <Input type="date" value={form.nextDueDate} onChange={(e) => setForm((p) => ({ ...p, nextDueDate: e.target.value }))} />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Common note</Label>
                    <Textarea rows={4} value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} placeholder="Common Medical_record note or checkup memo" />
                  </div>

                  <Button onClick={handleManualAdd} className="w-full">Add Record</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ScanText className="h-5 w-5 text-primary" />Document upload (OCR style)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="file-upload" className={cn("flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors", "hover:border-primary hover:bg-primary/5", isUploading && "pointer-events-none opacity-50")}>
                    <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{isUploading ? "Processing document..." : "Click to upload PDF or image"}</span>
                    <span className="mt-2 text-xs text-muted-foreground">A simulated OCR-based checkup record will be added.</span>
                    <Input id="file-upload" type="file" accept=".pdf,image/*" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
                  </Label>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Search Records</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search by title, hospital, diagnosis, vaccine..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {searchDate ? format(searchDate, "MMM d, yyyy") : "Filter by date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar mode="single" selected={searchDate} onSelect={setSearchDate} />
                    </PopoverContent>
                  </Popover>
                  {(searchQuery || searchDate) && (
                    <Button variant="ghost" onClick={() => { setSearchDate(undefined); setSearchQuery("") }}>
                      <X className="mr-2 h-4 w-4" />Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{filteredRecords.length} record{filteredRecords.length !== 1 ? "s" : ""} found</h2>
                {filteredRecords.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No matching records yet</p>
                    </CardContent>
                  </Card>
                ) : filteredRecords.map((record) => (
                  <Card key={record.id} className={selectedRecord?.id === record.id ? "border-primary" : ""}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{record.fileName}</h3>
                            <Badge variant="secondary">{record.record_type}</Badge>
                            <Badge variant="outline">{record.source_type}</Badge>
                            {record.prediction ? <Badge>AI analyzed</Badge> : null}
                          </div>
                          <p className="text-sm text-muted-foreground">Hospital: {record.hospitalName || "Not set"}</p>
                          <p className="text-sm text-muted-foreground">Visit date: {record.visitDate || format(new Date(record.uploadDate), "yyyy-MM-dd")}</p>
                          <p className="line-clamp-2 text-sm text-slate-700">{record.note}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}><Eye className="mr-2 h-4 w-4" />View</Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(record.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="h-fit xl:sticky xl:top-24">
                <CardHeader>
                  <CardTitle>Selected record detail</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedRecord ? (
                    <div className="space-y-4 text-sm">
                      {detailItems.map(([label, value]) => (
                        <p key={label}><span className="font-medium">{label}:</span> {value}</p>
                      ))}

                      <div className="rounded-2xl bg-muted p-4 leading-7 text-slate-700">
                        {selectedRecord.note}
                      </div>

                      {selectedRecord.treatment && (
                        <div className="rounded-2xl border p-4">
                          <p className="font-medium">Treatment_record</p>
                          <p className="mt-2">Body part: {selectedRecord.treatment.body_part_id}</p>
                          <p>Detail: {selectedRecord.treatment.treatment_detail}</p>
                        </div>
                      )}

                      {selectedRecord.vaccination && (
                        <div className="rounded-2xl border p-4">
                          <p className="font-medium">Vaccination_record</p>
                          <p className="mt-2">Vaccine: {selectedRecord.vaccination.vaccine_name}</p>
                          <p>Dose: {selectedRecord.vaccination.dose}</p>
                          <p>Next due: {selectedRecord.vaccination.next_due_date || "Not set"}</p>
                        </div>
                      )}

                      {selectedRecord.prescription && (
                        <div className="rounded-2xl border p-4">
                          <p className="font-medium">Prescription</p>
                          <p className="mt-2">Dosage: {selectedRecord.prescription.dosage}</p>
                          <p>Duration: {selectedRecord.prescription.duration}</p>
                        </div>
                      )}

                      {selectedRecord.recommendation && (
                        <div className="rounded-2xl border p-4">
                          <p className="font-medium">Recommendation</p>
                          <p className="mt-2">{selectedRecord.recommendation.content}</p>
                        </div>
                      )}
                    </div>
                  ) : <p className="text-sm text-muted-foreground">Select a record to review the summary.</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prediction" className="mt-6">
            <RecordPrediction records={records} selectedRecord={selectedRecord} onSelectRecord={setSelectedRecord} onPredictionComplete={handlePredictionComplete} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
