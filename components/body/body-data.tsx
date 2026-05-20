export const bodyData = {
  head: [
    { name: "Eyes", status: "no", detail: "No medical record" },
    { name: "Nose", status: "no", detail: "No medical record" },
    { name: "Mouth", status: "no", detail: "No medical record" },
    { name: "Brain", status: "treated", detail: "MRI scan, neurology consultation" },
    { name: "Ears", status: "no", detail: "No medical record" },
    { name: "Throat", status: "no", detail: "No medical record" },
  ],

  chest: [
    { name: "Heart", status: "treated", detail: "ECG test, blood pressure treatment" },
    { name: "Lungs", status: "no", detail: "No medical record" },
    { name: "Stomach", status: "treated", detail: "Gastritis medication" },
    { name: "Kidney", status: "no", detail: "No medical record" },
    { name: "Pancreas", status: "no", detail: "No medical record" },
    { name: "Liver", status: "no", detail: "No medical record" },
    { name: "Blood", status: "treated", detail: "Blood test completed" },
    { name: "Small intestine", status: "no", detail: "No medical record" },
    { name: "Large intestine", status: "no", detail: "No medical record" },
  ],

  back: [
    { name: "Neck", status: "no", detail: "No medical record" },
    { name: "Shoulder", status: "no", detail: "No medical record" },
    { name: "Spine", status: "treated", detail: "Posture check, X-ray and physical therapy history" },
    { name: "Lower back", status: "treated", detail: "Muscle pain treatment and stretching guidance" },
    { name: "Pelvis", status: "no", detail: "No medical record" },
  ],

  leg: [
    { name: "Leg", status: "no", detail: "No medical record" },
    { name: "Calf", status: "no", detail: "No medical record" },
    { name: "Thigh", status: "no", detail: "No medical record" },
    { name: "Knee", status: "treated", detail: "X-ray, physical therapy" },
    { name: "Ankle", status: "no", detail: "No medical record" },
    { name: "Toes", status: "no", detail: "No medical record" },
  ],
} as const
