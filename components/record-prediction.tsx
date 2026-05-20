"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Utensils,
  Dumbbell,
  Heart,
  FileText,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { MedicalRecord, PredictionResult, DiseaseResult, Recommendations } from "@/lib/types"

interface RecordPredictionProps {
  records: MedicalRecord[]
  selectedRecord: MedicalRecord | null
  onSelectRecord: (record: MedicalRecord | null) => void
  onPredictionComplete: (recordId: string, prediction: PredictionResult) => void
}

// Simulated AI analysis based on extracted text keywords
function analyzeRecord(extractedText: string): PredictionResult {
  const text = extractedText.toLowerCase()
  const diseases: DiseaseResult[] = []
  const dietSuggestions: string[] = []
  const exerciseSuggestions: string[] = []
  const lifestyleSuggestions: string[] = []

  // Check for diabetes indicators
  if (text.includes("glucose") || text.includes("hba1c") || text.includes("blood sugar")) {
    if (text.includes("elevated") || text.includes("high") || parseFloat(text.match(/glucose.*?(\d+)/)?.[1] || "0") > 100) {
      diseases.push({
        name: "Pre-diabetes / Diabetes Risk",
        riskLevel: text.includes("126") || text.includes("6.8") ? "medium" : "low",
        explanation: "Blood glucose levels indicate potential glucose metabolism issues. HbA1c levels suggest need for monitoring.",
      })
      dietSuggestions.push("Reduce refined carbohydrates and sugary foods")
      dietSuggestions.push("Increase fiber intake through vegetables and whole grains")
      dietSuggestions.push("Choose low glycemic index foods")
      exerciseSuggestions.push("30 minutes of moderate walking daily")
      exerciseSuggestions.push("Include resistance training 2-3 times per week")
    }
  }

  // Check for cardiovascular indicators
  if (text.includes("cholesterol") || text.includes("ldl") || text.includes("blood pressure")) {
    if (text.includes("220") || text.includes("140") || text.includes("135/85")) {
      diseases.push({
        name: "Cardiovascular Disease Risk",
        riskLevel: "medium",
        explanation: "Cholesterol and blood pressure readings indicate elevated cardiovascular risk factors.",
      })
      dietSuggestions.push("Reduce saturated fat intake")
      dietSuggestions.push("Increase omega-3 fatty acids (fish, nuts, seeds)")
      dietSuggestions.push("Limit sodium intake to less than 2300mg daily")
      exerciseSuggestions.push("Aerobic exercise 150 minutes per week")
      exerciseSuggestions.push("Include heart-healthy activities like swimming or cycling")
      lifestyleSuggestions.push("Monitor blood pressure regularly")
    }
  }

  // Check for thyroid issues
  if (text.includes("thyroid") || text.includes("tsh") || text.includes("t4")) {
    if (text.includes("elevated") || text.includes("4.8")) {
      diseases.push({
        name: "Hypothyroidism Risk",
        riskLevel: "low",
        explanation: "Slightly elevated TSH may indicate subclinical hypothyroidism. Monitoring recommended.",
      })
      dietSuggestions.push("Include iodine-rich foods like seafood")
      dietSuggestions.push("Ensure adequate selenium intake")
      lifestyleSuggestions.push("Regular thyroid function monitoring")
      lifestyleSuggestions.push("Avoid excessive soy consumption")
    }
  }

  // Check for vitamin deficiencies
  if (text.includes("vitamin d") && (text.includes("insufficient") || text.includes("low"))) {
    diseases.push({
      name: "Vitamin D Deficiency",
      riskLevel: "low",
      explanation: "Vitamin D levels are below optimal range. Supplementation may be beneficial.",
    })
    dietSuggestions.push("Increase vitamin D rich foods (fatty fish, fortified dairy)")
    lifestyleSuggestions.push("Get 15-20 minutes of sunlight exposure daily")
    lifestyleSuggestions.push("Consider vitamin D3 supplementation (consult doctor)")
  }

  // Check for BMI/weight issues
  if (text.includes("bmi") && parseFloat(text.match(/bmi.*?(\d+\.?\d*)/)?.[1] || "0") > 25) {
    diseases.push({
      name: "Overweight / Obesity Risk",
      riskLevel: parseFloat(text.match(/bmi.*?(\d+\.?\d*)/)?.[1] || "0") > 30 ? "high" : "medium",
      explanation: "BMI indicates above normal weight range, which can contribute to various health conditions.",
    })
    dietSuggestions.push("Maintain caloric deficit through portion control")
    dietSuggestions.push("Focus on whole, unprocessed foods")
    exerciseSuggestions.push("Aim for 10,000 steps daily")
    exerciseSuggestions.push("Combine cardio with strength training")
    lifestyleSuggestions.push("Track food intake and physical activity")
  }

  // Default recommendations if nothing specific found
  if (diseases.length === 0) {
    diseases.push({
      name: "General Health Status",
      riskLevel: "low",
      explanation: "No significant health concerns detected based on the medical record analysis.",
    })
  }

  if (dietSuggestions.length === 0) {
    dietSuggestions.push("Maintain a balanced diet with plenty of fruits and vegetables")
    dietSuggestions.push("Stay hydrated with adequate water intake")
    dietSuggestions.push("Limit processed foods and added sugars")
  }

  if (exerciseSuggestions.length === 0) {
    exerciseSuggestions.push("Engage in regular physical activity for at least 150 minutes per week")
    exerciseSuggestions.push("Include both cardio and strength exercises")
  }

  if (lifestyleSuggestions.length === 0) {
    lifestyleSuggestions.push("Get 7-9 hours of quality sleep each night")
    lifestyleSuggestions.push("Manage stress through relaxation techniques")
    lifestyleSuggestions.push("Schedule regular health checkups")
  }

  return {
    diseases,
    recommendations: {
      diet: dietSuggestions,
      exercise: exerciseSuggestions,
      lifestyle: lifestyleSuggestions,
    },
    analyzedAt: new Date().toISOString(),
  }
}

const riskColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
}

const riskIcons = {
  low: CheckCircle,
  medium: AlertCircle,
  high: AlertTriangle,
}

export function RecordPrediction({
  records,
  selectedRecord,
  onSelectRecord,
  onPredictionComplete,
}: RecordPredictionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!selectedRecord) return

    setIsAnalyzing(true)
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const prediction = analyzeRecord(selectedRecord.extractedText)
    onPredictionComplete(selectedRecord.id, prediction)
    setIsAnalyzing(false)
    toast.success("AI analysis complete")
  }

  const recordsWithoutPrediction = records.filter((r) => !r.prediction)

  return (
    <div className="flex flex-col gap-6">
      {/* Record Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Health Prediction
          </CardTitle>
          <CardDescription>
            Select a medical record to analyze and get AI-powered health predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Select Medical Record</label>
            <Select
              value={selectedRecord?.id || ""}
              onValueChange={(value) => {
                const record = records.find((r) => r.id === value)
                onSelectRecord(record || null)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a record to analyze" />
              </SelectTrigger>
              <SelectContent>
                {records.map((record) => (
                  <SelectItem key={record.id} value={record.id}>
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {record.fileName}
                      {record.prediction && (
                        <Badge variant="secondary" className="ml-2">Analyzed</Badge>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRecord && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Extracted Text Preview</h4>
              <p className="text-sm text-muted-foreground">
                {selectedRecord.extractedText}
              </p>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            disabled={!selectedRecord || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                {selectedRecord?.prediction ? "Re-analyze Record" : "Analyze Record"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {selectedRecord?.prediction && (
        <>
          {/* Disease Predictions */}
          <Card>
            <CardHeader>
              <CardTitle>Possible Health Conditions</CardTitle>
              <CardDescription>
                Based on AI analysis of your medical record
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {selectedRecord.prediction.diseases.map((disease, index) => {
                const RiskIcon = riskIcons[disease.riskLevel]
                return (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border",
                      riskColors[disease.riskLevel]
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <RiskIcon className="h-5 w-5 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{disease.name}</h4>
                          <Badge
                            variant="outline"
                            className={cn("capitalize", riskColors[disease.riskLevel])}
                          >
                            {disease.riskLevel} Risk
                          </Badge>
                        </div>
                        <p className="text-sm">{disease.explanation}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Health Recommendations</CardTitle>
              <CardDescription>
                Personalized suggestions based on your analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Diet Recommendations */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Utensils className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Diet Suggestions</h4>
                </div>
                <ul className="space-y-2 ml-11">
                  {selectedRecord.prediction.recommendations.diet.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Exercise Recommendations */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Dumbbell className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Exercise Suggestions</h4>
                </div>
                <ul className="space-y-2 ml-11">
                  {selectedRecord.prediction.recommendations.exercise.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Lifestyle Recommendations */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Heart className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold">Lifestyle Advice</h4>
                </div>
                <ul className="space-y-2 ml-11">
                  {selectedRecord.prediction.recommendations.lifestyle.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Disclaimer</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    This AI analysis is for informational purposes only and should not be considered as medical advice. 
                    Please consult with a qualified healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Record Selected State */}
      {!selectedRecord && records.length > 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Select a medical record above to start AI analysis
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Records State */}
      {records.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Upload a medical record first to use AI prediction
            </p>
            <Button variant="outline" asChild>
              <a href="/records">Go to Records</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
