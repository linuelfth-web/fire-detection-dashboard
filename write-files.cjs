const fs = require('fs');

const code = `import React, { useState, useEffect } from "react";

export const EscapeRoute = ({
  hasAlert,
  hasWarn,
  flameZone,
  kitchenTemp,
  kitchenGas,
  kitchenFlame,
  kitchenHum,
  bedroomTemp,
  bedroomGas,
  bedroomFlame,
  bedroomHum,
}: any) => {
  const [flameAnim, setFlameAnim] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFlameAnim((a) => (a + 1) % 3), 400);
    return () => clearInterval(id);
  }, []);

  const headerBg = hasAlert ? "#3b0000" : hasWarn ? "#2d1a00" : "#0f2318";
  const headerBorder = hasAlert ? "#dc2626" : hasWarn ? "#d97706" : "#059669";
  const headerColor = hasAlert ? "#f87171" : hasWarn ? "#fbbf24" : "#34d399";
  const ff = ["🔥", "🔥 ", "  🔥"];

  const kTempColor = kitchenTemp >= 50 ? "#f87171" : kitchenTemp >= 40 ? "#fb923c" : kitchenTemp >= 30 ? "#fbbf24" : "#34d399";
  const kGasColor  = kitchenGas  >= 700 ? "#f87171" : kitchenGas  >= 400 ? "#fbbf24" : "#34d399";
  const bTempColor = bedroomTemp >= 50 ? "#f87171" : bedroomTemp >= 40 ? "#fb923c" : bedroomTemp >= 30 ? "#fbbf24" : "#34d399";
  const bGasColor  = bedroomGas  >= 700 ? "#f87171" : bedroomGas  >= 400 ? "#fbbf24" : "#34d399";

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#0f172a" }}>
      <style>{\`
        @keyframes fireGlow { 0%,100%{filter:drop-shadow(0 0 6px #ef4444)} 50%{filter:drop-shadow(0 0 18px #ef4444)} }
        @keyframes smokeUp  { 0%{opacity:0.7;transform:translateY(0)} 100%{opacity:0;transform:translateY(-20px)} }
        .fire-room  { animation: fireGlow 0.7s infinite }
        .smoke-puff { animation: smokeUp  1.4s infinite }
      \`}</style>

      {/* Header */}
      <div style={{ background:headerBg, borderBottom:"1px solid "+headerBorder, padding:"10px 14px", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>🗺️</span>
          <div style={{ fontSize:14, fontWeight:700, color:headerColor }}>Escape Route Planner</div>
          {hasAlert && flameZone && (
            <span style={{ marginLeft:"auto", fontSize:11, background:"#7f1d1d", color:"#fca5a5", border:"1px solid #f87171", borderRadius:6, padding:"2px 8px", fontWeight:700 }}>
              🔥 Fire in {flameZone}
            </span>
          )}
        </div>
        <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>
          {hasAlert && flameZone ? "🚨 Fire in "+flameZone+" — Evacuate immediately"
            : hasAlert ? "🚨 Evacuate now"
            : hasWarn  ? "⚠️ Warning — Identify nearest exit"
            : "✅ All clear — Routes standing by"}
        </div>
      </div>

      {/* Floor Plan */}
      <div style={{ flex:1, padding:"8px 10px", overflow:"hidden", display:"flex", flexDirection:"column" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, color:"#6b7280", marginBottom:4, textTransform:"uppercase" }}>
          Floor Plan — Live Sensor Readings
        </div>
        <svg viewBox="0 0 580 360" preserveAspectRatio="xMidYMid meet" style={{ width:"100%", flex:1, display:"block" }}>
          <rect x="0" y="0" width="580" height="360" rx="8" fill="#080f1e"/>

          {/* ── ROOMS ── */}

          {/* Bathroom top-left */}
          <rect x="8" y="8" width="138" height="118" rx="6" fill="#1a2d1a" stroke="#2d5a2d" strokeWidth="1.5"/>
          <text x="77" y="52" textAnchor="middle" fill="#4ade80" fontSize="13" fontFamily="'Segoe UI',system-ui" fontWeight="700">BATHROOM</text>

          {/* Living Room center */}
          <rect x="154" y="8" width="256" height="242" rx="6" fill="#0e1b2e" stroke="#1e3a52" strokeWidth="1.5"/>
          <text x="282" y="122" textAnchor="middle" fill="#3b82f6" fontSize="16" fontFamily="'Segoe UI',system-ui" fontWeight="700">LIVING</text>
          <text x="282" y="142" textAnchor="middle" fill="#3b82f6" fontSize="16" fontFamily="'Segoe UI',system-ui" fontWeight="700">ROOM</text>
          <text x="282" y="160" textAnchor="middle" fill="#1e3a52" fontSize="9" fontFamily="'Segoe UI',system-ui">Common Area</text>

          {/* Dining top-right — 20% wider */}
          <rect x="418" y="8" width="154" height="162" rx="6" fill="#1e1a0a" stroke="#5a4a00" strokeWidth="1.5"/>
          <text x="495" y="82" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily="'Segoe UI',system-ui" fontWeight="700">DINING</text>
          <text x="495" y="98" textAnchor="middle" fill="#fbbf24" fontSize="12" fontFamily="'Segoe UI',system-ui" fontWeight="700">AREA</text>

          {/* Kitchen left — same height as hallway bottom edge (y=288) */}
          <rect x="8" y="134" width="138" height="154" rx="6"
            fill={flameZone==="Kitchen" ? "#3b0000" : "#111a0a"}
            stroke={flameZone==="Kitchen" ? "#ef4444" : "#4a5a00"}
            strokeWidth={flameZone==="Kitchen" ? 3 : 1.5}
            className={flameZone==="Kitchen" ? "fire-room" : ""}/>
          <text x="77" y="152" textAnchor="middle" fill={flameZone==="Kitchen" ? "#f87171" : "#84cc16"} fontSize="12" fontFamily="'Segoe UI',system-ui" fontWeight="700">KITCHEN</text>

          {/* Kitchen sensors */}
          <rect x="12" y="158" width="130" height="16" rx="3" fill="#0a1020" opacity="0.85"/>
          <text x="18" y="170" fill="#6b7280" fontSize="9" fontFamily="'Segoe UI',system-ui">🌡 Temp</text>
          <text x="138" y="170" textAnchor="end" fill={kTempColor} fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">{(kitchenTemp??'--')+'°C'}</text>

          <rect x="12" y="177" width="130" height="16" rx="3" fill="#0a1020" opacity="0.85"/>
          <text x="18" y="189" fill="#6b7280" fontSize="9" fontFamily="'Segoe UI',system-ui">💧 Humidity</text>
          <text x="138" y="189" textAnchor="end" fill="#60a5fa" fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">{(kitchenHum??'--')+'%'}</text>

          <rect x="12" y="196" width="130" height="16" rx="3" fill="#0a1020" opacity="0.85"/>
          <text x="18" y="208" fill="#6b7280" fontSize="9" fontFamily="'Segoe UI',system-ui">💨 Gas</text>
          <text x="138" y="208" textAnchor="end" fill={kGasColor} fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">{(kitchenGas??'--')+'ppm'}</text>

          <rect x="12" y="215" width="130" height="16" rx="3" fill="#0a1020" opacity="0.85"/>
          <text x="18" y="227" fill="#6b7280" fontSize="9" fontFamily="'Segoe UI',system-ui">🔥 Flame</text>
          <text x="138" y="227" textAnchor="end" fill={kitchenFlame?"#f87171":"#34d399"} fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">{kitchenFlame?'DETECTED':'None'}</text>

          {flameZone==="Kitchen" && <text x="77" y="262" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="'Segoe UI',system-ui" fontWeight="700">⚠ FIRE HERE</text>}
          {flameZone==="Kitchen" && <ellipse cx="50" cy="248" rx="5" ry="8" fill="#94a3b8" opacity="0.2" className="smoke-puff"/>}
          {flameZone==="Kitchen" && <ellipse cx="104" cy="244" rx="4" ry="6" fill="#94a3b8" opacity="0.15" className="smoke-puff"/>}

          {/* Bedroom bottom-right — expanded */}
          <rect x="418" y="178" width="154" height="170" rx="6"
            fill={flameZone==="Bedroom" ? "#3b0000" : "#1a0e1a"}
            stroke={flameZone==="Bedroom" ? "#ef4444" : "#5a2a5a"}
            strokeWidth={flameZone==="Bedroom" ? 3 : 1.5}
            className={flameZone==="Bedroom" ? "fire-room" : ""}/>
          <text x="495" y="200" textAnchor="middle" fill={flameZone==="Bedroom" ? "#f87171" : "#c084fc"} fontSize="12" fontFamily="'Segoe UI',system-ui" fontWeight="700">BEDROOM</text>

          {/* Bedroom sensors */}
          <rect x="422" y="206" width="146" height="16" rx="3" fill="#0a1020" opacity="0.85"/>
          <text x="428" y="218" fill="#6b7280" fontSize="9" fontFamily="'Segoe UI',system-ui">🌡 Temp</text>
          <text x="564" y="218" textAnchor="end" fill={bTempColor} fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">{(bedroomTemp??'--')+'°C'}</text>

          <rect x="422" y="225" width="146" height="16" rx="3" fill="#0a1020" opacity="0.85"/>
          <text x="428" y="237" fill="#6b7280" fontSize="9" fontFamily="'Segoe UI',system-ui">💧 Humidity</text>
          <text x="564" y="237" textAnchor="end" fill="#60a5fa" fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">{(bedroomHum??'--')+'%'}</text>

          <rect x="422" y="244" width="146" height="16" rx="3" fill="#0a1020" opacity="0.85"/>
          <text x="428" y="256" fill="#6b7280" fontSize="9" fontFamily="'Segoe UI',system-ui">💨 Gas</text>
          <text x="564" y="256" textAnchor="end" fill={bGasColor} fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">{(bedroomGas??'--')+'ppm'}</text>

          <rect x="422" y="263" width="146" height="16" rx="3" fill="#0a1020" opacity="0.85"/>
          <text x="428" y="275" fill="#6b7280" fontSize="9" fontFamily="'Segoe UI',system-ui">🔥 Flame</text>
          <text x="564" y="275" textAnchor="end" fill={bedroomFlame?"#f87171":"#34d399"} fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">{bedroomFlame?'DETECTED':'None'}</text>

          {flameZone==="Bedroom" && <text x="495" y="308" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="'Segoe UI',system-ui" fontWeight="700">⚠ FIRE HERE</text>}
          {flameZone==="Bedroom" && <ellipse cx="468" cy="294" rx="5" ry="8" fill="#94a3b8" opacity="0.2" className="smoke-puff"/>}
          {flameZone==="Bedroom" && <ellipse cx="522" cy="290" rx="4" ry="6" fill="#94a3b8" opacity="0.15" className="smoke-puff"/>}

          {/* Hallway */}
          <rect x="154" y="258" width="256" height="88" rx="6" fill="#0a1520" stroke="#1e3a52" strokeWidth="1"/>
          <text x="282" y="306" textAnchor="middle" fill="#1e3a52" fontSize="11" fontFamily="'Segoe UI',system-ui" fontWeight="700">HALLWAY / CORRIDOR</text>

          {/* ── EXITS ── */}

          {/* Main Door bottom center */}
          <rect x="220" y="344" width="124" height="14" rx="7" fill="#34d399" stroke="#059669" strokeWidth="2"/>
          <text x="282" y="355" textAnchor="middle" fill="#022c22" fontSize="9" fontFamily="'Segoe UI',system-ui" fontWeight="700">MAIN DOOR</text>

          {/* Back Door top of Dining */}
          <rect x="438" y="1" width="96" height="12" rx="6" fill="#60a5fa" stroke="#2563eb" strokeWidth="1.5"/>
          <text x="486" y="11" textAnchor="middle" fill="#0c1a3a" fontSize="8" fontFamily="'Segoe UI',system-ui" fontWeight="700">BACK DOOR</text>

          {/* Kitchen Window bottom of Kitchen */}
          <rect x="14" y="282" width="126" height="12" rx="6" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5"/>
          <text x="77" y="292" textAnchor="middle" fill="#1a0a3a" fontSize="8" fontFamily="'Segoe UI',system-ui" fontWeight="700">KITCHEN WINDOW</text>

          {/* Dining Window right side */}
          <rect x="569" y="22" width="11" height="72" rx="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
          <text x="574" y="66" textAnchor="middle" fill="#1c0a00" fontSize="7" fontFamily="'Segoe UI',system-ui" fontWeight="700" transform="rotate(90,574,60)">DINING WIN.</text>

          {/* Bedroom Window right side */}
          <rect x="569" y="200" width="11" height="72" rx="5" fill="#f472b6" stroke="#be185d" strokeWidth="1.5"/>
          <text x="574" y="244" textAnchor="middle" fill="#1c0010" fontSize="7" fontFamily="'Segoe UI',system-ui" fontWeight="700" transform="rotate(90,574,238)">BEDROOM WIN.</text>

          {/* ── INTERIOR DOORS ── */}

          {/* Bathroom ↔ Living Room */}
          <rect x="146" y="44" width="14" height="30" rx="7" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
          <text x="153" y="64" textAnchor="middle" fill="#78350f" fontSize="6" fontFamily="'Segoe UI',system-ui" fontWeight="900" transform="rotate(90,153,59)">DOOR</text>

          {/* Bedroom ↔ Living Room */}
          <rect x="406" y="210" width="14" height="30" rx="7" fill="#fde68a" stroke="#f59e0b" strokeWidth="2"/>
          <text x="413" y="230" textAnchor="middle" fill="#78350f" fontSize="6" fontFamily="'Segoe UI',system-ui" fontWeight="900" transform="rotate(90,413,225)">DOOR</text>

        </svg>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('frontend/src/components/EscapeRoute.tsx', code);
console.log('Done! Size:', code.length);