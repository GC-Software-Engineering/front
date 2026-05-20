"use client"

type Props = {
  selected: string
  onSelect: (region: string) => void
}

const regionStyle = (isSelected: boolean) =>
  isSelected
    ? "fill-red-400/35 stroke-red-500"
    : "fill-cyan-400/0 stroke-cyan-500/0 hover:fill-cyan-400/20 hover:stroke-cyan-500/70"

export default function HumanBody({ selected, onSelect }: Props) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">
          Interactive Body Medical History
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Select a body region to view organs and treatment history
        </p>
      </div>

      <div className="relative rounded-[32px] border border-cyan-100 bg-gradient-to-b from-cyan-50 via-white to-slate-50 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),transparent_58%)] pointer-events-none" />

        <svg
          viewBox="0 0 360 760"
          className="relative z-10 h-[620px] w-[280px] md:h-[700px] md:w-[320px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#cffafe" />
            </linearGradient>

            <linearGradient id="outlineGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.5" />
            </linearGradient>

            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0.2
                        0 0 1 0 0.3
                        0 0 0 0.28 0"
              />
            </filter>
          </defs>

          {/* glow behind */}
          <ellipse cx="180" cy="340" rx="90" ry="240" fill="#67e8f9" opacity="0.18" filter="url(#softGlow)" />

          {/* head */}
          <circle cx="180" cy="78" r="42" fill="url(#bodyGradient)" stroke="url(#outlineGradient)" strokeWidth="2.5" />

          {/* neck */}
          <rect x="165" y="116" width="30" height="30" rx="12" fill="url(#bodyGradient)" stroke="url(#outlineGradient)" strokeWidth="2" />

          {/* shoulders + torso */}
          <path
            d="M112 160
               C122 138, 145 130, 180 130
               C215 130, 238 138, 248 160
               L268 246
               C274 271, 267 318, 254 356
               C245 384, 236 410, 232 436
               C228 462, 229 490, 234 524
               L126 524
               C131 490, 132 462, 128 436
               C124 410, 115 384, 106 356
               C93 318, 86 271, 92 246
               Z"
            fill="url(#bodyGradient)"
            stroke="url(#outlineGradient)"
            strokeWidth="2.5"
          />

          {/* left arm */}
          <path
            d="M107 172
               C87 194, 72 231, 67 275
               C63 312, 66 343, 78 380
               C85 400, 90 418, 92 438
               C94 454, 104 463, 116 459
               C129 455, 134 441, 131 424
               C126 392, 123 371, 125 344
               C127 312, 132 283, 139 254
               C147 221, 144 193, 127 173
               Z"
            fill="url(#bodyGradient)"
            stroke="url(#outlineGradient)"
            strokeWidth="2.2"
          />

          {/* right arm */}
          <path
            d="M253 172
               C273 194, 288 231, 293 275
               C297 312, 294 343, 282 380
               C275 400, 270 418, 268 438
               C266 454, 256 463, 244 459
               C231 455, 226 441, 229 424
               C234 392, 237 371, 235 344
               C233 312, 228 283, 221 254
               C213 221, 216 193, 233 173
               Z"
            fill="url(#bodyGradient)"
            stroke="url(#outlineGradient)"
            strokeWidth="2.2"
          />

          {/* pelvis */}
          <path
            d="M136 524
               C146 512, 160 506, 180 506
               C200 506, 214 512, 224 524
               C223 546, 218 566, 210 588
               L150 588
               C142 566, 137 546, 136 524
               Z"
            fill="url(#bodyGradient)"
            stroke="url(#outlineGradient)"
            strokeWidth="2.2"
          />

          {/* left leg */}
          <path
            d="M154 588
               C145 624, 140 660, 139 700
               C139 720, 147 732, 159 732
               C171 732, 177 721, 176 706
               C174 669, 176 632, 184 588
               Z"
            fill="url(#bodyGradient)"
            stroke="url(#outlineGradient)"
            strokeWidth="2.2"
          />

          {/* right leg */}
          <path
            d="M206 588
               C215 624, 220 660, 221 700
               C221 720, 213 732, 201 732
               C189 732, 183 721, 184 706
               C186 669, 184 632, 176 588
               Z"
            fill="url(#bodyGradient)"
            stroke="url(#outlineGradient)"
            strokeWidth="2.2"
          />

          {/* feet */}
          <ellipse cx="157" cy="740" rx="22" ry="10" fill="#dbeafe" stroke="#94a3b8" strokeWidth="1.8" />
          <ellipse cx="203" cy="740" rx="22" ry="10" fill="#dbeafe" stroke="#94a3b8" strokeWidth="1.8" />

          {/* ========= CLICKABLE REGIONS ========= */}

          {/* head */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelect("head")}
          >
            <circle
              cx="180"
              cy="78"
              r="50"
              className={`${regionStyle(selected === "head")} transition-all duration-300`}
              strokeWidth="3"
            />
            <text
              x="180"
              y="18"
              textAnchor="middle"
              className="fill-slate-500 text-[12px] font-semibold"
            >
              HEAD
            </text>
          </g>

          {/* chest */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelect("chest")}
          >
            <path
              d="M120 162
                 C128 150, 147 145, 180 145
                 C213 145, 232 150, 240 162
                 L252 238
                 C255 260, 252 286, 243 322
                 L117 322
                 C108 286, 105 260, 108 238
                 Z"
              className={`${regionStyle(selected === "chest")} transition-all duration-300`}
              strokeWidth="3"
            />
            <text
              x="180"
              y="236"
              textAnchor="middle"
              className="fill-slate-600 text-[14px] font-bold"
            >
              CHEST
            </text>
          </g>

          {/* back */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelect("back")}
          >
            <path
              d="M126 330
                 C133 318, 151 314, 180 314
                 C209 314, 227 318, 234 330
                 C236 356, 232 383, 226 414
                 L134 414
                 C128 383, 124 356, 126 330
                 Z"
              className={`${regionStyle(selected === "back")} transition-all duration-300`}
              strokeWidth="3"
            />
            <text
              x="180"
              y="372"
              textAnchor="middle"
              className="fill-slate-600 text-[14px] font-bold"
            >
              BACK
            </text>
          </g>

          {/* leg */}
          <g
            className="cursor-pointer transition-all duration-300"
            onClick={() => onSelect("leg")}
          >
            <rect
              x="138"
              y="586"
              width="84"
              height="152"
              rx="28"
              className={`${regionStyle(selected === "leg")} transition-all duration-300`}
              strokeWidth="3"
            />
            <text
              x="180"
              y="660"
              textAnchor="middle"
              className="fill-slate-600 text-[14px] font-bold"
            >
              LEG
            </text>
          </g>
        </svg>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-slate-600 shadow-sm">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            Treated
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-slate-600 shadow-sm">
            <span className="h-3 w-3 rounded-full bg-amber-300" />
            Monitoring
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-slate-600 shadow-sm">
            <span className="h-3 w-3 rounded-full bg-slate-300" />
            No medical record
          </div>
        </div>
      </div>
    </div>
  )
}