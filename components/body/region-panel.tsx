import { bodyData } from "./body-data"

const regionTitle: Record<string, string> = {
  head: "Head",
  chest: "Chest",
  back: "Back",
  leg: "Leg",
}

export default function RegionPanel({ region }: { region: string }) {
  if (!region) {
    return <div className="p-6 text-slate-400">Select a body region</div>
  }

  const organs = bodyData[region as keyof typeof bodyData] || []

  return (
    <div className="p-6">
      <div className="mb-5">
        <div className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
          Selected Region
        </div>
        <h2 className="mt-3 text-2xl font-bold text-slate-800">
          {regionTitle[region] || region}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Related organs and treatment history
        </p>
      </div>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
        {organs.map((o, i) => {
          const treated = o.status === "treated"

          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    {o.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {o.detail}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                    treated
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {treated ? "Treated" : "No medical record"}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
