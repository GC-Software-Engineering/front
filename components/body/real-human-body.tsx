"use client"

type Props = {
  selected: string
  onSelect: (region: string) => void
}

export default function RealHumanBody({ selected, onSelect }: Props) {
  const regionClass = (name: string) =>
    `absolute transition-all duration-300 ${
      selected === name
        ? "bg-red-400/20 ring-2 ring-red-400 shadow-[0_0_0_8px_rgba(248,113,113,0.12)]"
        : "bg-cyan-400/0 hover:bg-cyan-400/15 hover:ring-2 hover:ring-cyan-400"
    }`

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Interactive Body Medical History
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Click Head, Chest, Back, or Leg to view medical records
        </p>
      </div>

      <div className="rounded-[32px] border bg-gradient-to-b from-slate-50 to-white p-4 shadow-lg">
        <div className="relative w-[230px] sm:w-[260px] md:w-[290px] aspect-[290/640] overflow-hidden rounded-[24px]">
          <img
            src="/body-real.png"
            alt="Human body"
            className="absolute inset-0 h-full w-full object-contain select-none"
            draggable={false}
          />

          <button
            type="button"
            onClick={() => onSelect("head")}
            className={`${regionClass("head")} top-[2.5%] left-[30%] h-[16%] w-[40%] rounded-full`}
            aria-label="Head region"
          />

          <button
            type="button"
            onClick={() => onSelect("chest")}
            className={`${regionClass("chest")} top-[18%] left-[24%] h-[22%] w-[52%] rounded-[32px]`}
            aria-label="Chest region"
          />

          <button
            type="button"
            onClick={() => onSelect("back")}
            className={`${regionClass("back")} top-[40%] left-[26%] h-[18%] w-[48%] rounded-[28px]`}
            aria-label="Back region"
          />

          <button
            type="button"
            onClick={() => onSelect("leg")}
            className={`${regionClass("leg")} top-[58%] left-[29%] h-[31%] w-[42%] rounded-[28px]`}
            aria-label="Leg region"
          />

          <div className="pointer-events-none absolute top-[8%] left-[74%] rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
            Head
          </div>
          <div className="pointer-events-none absolute top-[27%] left-[74%] rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
            Chest
          </div>
          <div className="pointer-events-none absolute top-[45%] left-[74%] rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
            Back
          </div>
          <div className="pointer-events-none absolute top-[73%] left-[74%] rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
            Leg
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
        <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-slate-600 shadow-sm">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          Treated
        </div>
        <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-slate-600 shadow-sm">
          <span className="h-3 w-3 rounded-full bg-slate-300" />
          No medical record
        </div>
      </div>
    </div>
  )
}
