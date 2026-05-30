import React, { useState, useEffect } from "react";

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

  const kTempColor =
    kitchenTemp >= 50
      ? "#f87171"
      : kitchenTemp >= 40
        ? "#fb923c"
        : kitchenTemp >= 30
          ? "#fbbf24"
          : "#34d399";
  const kGasColor =
    kitchenGas >= 700 ? "#f87171" : kitchenGas >= 400 ? "#fbbf24" : "#34d399";
  const bTempColor =
    bedroomTemp >= 50
      ? "#f87171"
      : bedroomTemp >= 40
        ? "#fb923c"
        : bedroomTemp >= 30
          ? "#fbbf24"
          : "#34d399";
  const bGasColor =
    bedroomGas >= 700 ? "#f87171" : bedroomGas >= 400 ? "#fbbf24" : "#34d399";

  // Sensor row helper — each row is 16px tall, text centered at y+8
  const rowMid = (y: number) => y + 8;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0f172a",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700;900&display=swap');
        @keyframes fireGlow { 0%,100%{filter:drop-shadow(0 0 6px #ef4444)} 50%{filter:drop-shadow(0 0 18px #ef4444)} }
        @keyframes smokeUp  { 0%{opacity:0.7;transform:translateY(0)} 100%{opacity:0;transform:translateY(-20px)} }
        .fire-room  { animation: fireGlow 0.7s infinite }
        .smoke-puff { animation: smokeUp  1.4s infinite }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: headerBg,
          borderBottom: "1px solid " + headerBorder,
          padding: "10px 14px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🗺️</span>
          <div style={{ fontSize: 14, fontWeight: 700, color: headerColor }}>
            Escape Route Planner
          </div>
          {hasAlert && flameZone && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                background: "#7f1d1d",
                color: "#fca5a5",
                border: "1px solid #f87171",
                borderRadius: 6,
                padding: "2px 8px",
                fontWeight: 700,
              }}
            >
              🔥 Fire in {flameZone}
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
          {hasAlert && flameZone
            ? "🚨 Fire in " + flameZone + " — Evacuate immediately"
            : hasAlert
              ? "🚨 Evacuate now"
              : hasWarn
                ? "⚠️ Warning — Identify nearest exit"
                : "✅ All clear — Routes standing by"}
        </div>
      </div>

      {/* Floor Plan */}
      <div
        style={{
          flex: 1,
          padding: "8px 10px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#6b7280",
            marginBottom: 4,
            textTransform: "uppercase",
          }}
        >
          Floor Plan — Live Sensor Readings
        </div>
        <svg
          viewBox="0 0 580 360"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", flex: 1, display: "block" }}
        >
          <rect x="0" y="0" width="580" height="360" rx="8" fill="#080f1e" />

          {/* ── ROOMS ── */}

          {/* Bathroom top-left */}
          <rect
            x="8"
            y="8"
            width="138"
            height="118"
            rx="6"
            fill="#1a2d1a"
            stroke="#2d5a2d"
            strokeWidth="1.5"
          />
          <text
            x="77"
            y="67"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#4ade80"
            fontSize="13"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            BATHROOM
          </text>

          {/* Living Room center */}
          <rect
            x="154"
            y="8"
            width="256"
            height="242"
            rx="6"
            fill="#0e1b2e"
            stroke="#1e3a52"
            strokeWidth="1.5"
          />
          <text
            x="282"
            y="119"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#3b82f6"
            fontSize="16"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            LIVING
          </text>
          <text
            x="282"
            y="139"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#3b82f6"
            fontSize="16"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            ROOM
          </text>
          <text
            x="282"
            y="157"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1e3a52"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            Common Area
          </text>

          {/* Dining top-right */}
          <rect
            x="418"
            y="8"
            width="154"
            height="162"
            rx="6"
            fill="#1e1a0a"
            stroke="#5a4a00"
            strokeWidth="1.5"
          />
          <text
            x="495"
            y="80"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fbbf24"
            fontSize="12"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            DINING
          </text>
          <text
            x="495"
            y="96"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fbbf24"
            fontSize="12"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            AREA
          </text>

          {/* Kitchen left */}
          <rect
            x="8"
            y="134"
            width="138"
            height="154"
            rx="6"
            fill={flameZone === "Kitchen" ? "#3b0000" : "#111a0a"}
            stroke={flameZone === "Kitchen" ? "#ef4444" : "#4a5a00"}
            strokeWidth={flameZone === "Kitchen" ? 3 : 1.5}
            className={flameZone === "Kitchen" ? "fire-room" : ""}
          />
          <text
            x="77"
            y="149"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={flameZone === "Kitchen" ? "#f87171" : "#84cc16"}
            fontSize="12"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            KITCHEN
          </text>

          {/* Kitchen sensor rows — each rect is 16px tall, text at rowMid */}
          <rect
            x="12"
            y="158"
            width="130"
            height="16"
            rx="3"
            fill="#0a1020"
            opacity="0.85"
          />
          <text
            x="18"
            y={rowMid(158)}
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            🌡 Temp
          </text>
          <text
            x="138"
            y={rowMid(158)}
            dominantBaseline="middle"
            textAnchor="end"
            fill={kTempColor}
            fontSize="10"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            {(kitchenTemp ?? "--") + "°C"}
          </text>

          <rect
            x="12"
            y="177"
            width="130"
            height="16"
            rx="3"
            fill="#0a1020"
            opacity="0.85"
          />
          <text
            x="18"
            y={rowMid(177)}
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            💧 Humidity
          </text>
          <text
            x="138"
            y={rowMid(177)}
            dominantBaseline="middle"
            textAnchor="end"
            fill="#60a5fa"
            fontSize="10"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            {(kitchenHum ?? "--") + "%"}
          </text>

          <rect
            x="12"
            y="196"
            width="130"
            height="16"
            rx="3"
            fill="#0a1020"
            opacity="0.85"
          />
          <text
            x="18"
            y={rowMid(196)}
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            💨 Gas
          </text>
          <text
            x="138"
            y={rowMid(196)}
            dominantBaseline="middle"
            textAnchor="end"
            fill={kGasColor}
            fontSize="10"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            {(kitchenGas ?? "--") + "ppm"}
          </text>

          <rect
            x="12"
            y="215"
            width="130"
            height="16"
            rx="3"
            fill="#0a1020"
            opacity="0.85"
          />
          <text
            x="18"
            y={rowMid(215)}
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            🔥 Flame
          </text>
          <text
            x="138"
            y={rowMid(215)}
            dominantBaseline="middle"
            textAnchor="end"
            fill={kitchenFlame ? "#f87171" : "#34d399"}
            fontSize="10"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            {kitchenFlame ? "DETECTED" : "None"}
          </text>

          {flameZone === "Kitchen" && (
            <text
              x="77"
              y="258"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#f87171"
              fontSize="9"
              fontFamily="'Roboto',sans-serif"
              fontWeight="700"
            >
              ⚠ FIRE HERE
            </text>
          )}
          {flameZone === "Kitchen" && (
            <ellipse
              cx="50"
              cy="248"
              rx="5"
              ry="8"
              fill="#94a3b8"
              opacity="0.2"
              className="smoke-puff"
            />
          )}
          {flameZone === "Kitchen" && (
            <ellipse
              cx="104"
              cy="244"
              rx="4"
              ry="6"
              fill="#94a3b8"
              opacity="0.15"
              className="smoke-puff"
            />
          )}

          {/* Bedroom bottom-right */}
          <rect
            x="418"
            y="178"
            width="154"
            height="170"
            rx="6"
            fill={flameZone === "Bedroom" ? "#3b0000" : "#1a0e1a"}
            stroke={flameZone === "Bedroom" ? "#ef4444" : "#5a2a5a"}
            strokeWidth={flameZone === "Bedroom" ? 3 : 1.5}
            className={flameZone === "Bedroom" ? "fire-room" : ""}
          />
          <text
            x="495"
            y="196"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={flameZone === "Bedroom" ? "#f87171" : "#c084fc"}
            fontSize="12"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            BEDROOM
          </text>

          {/* Bedroom sensor rows */}
          <rect
            x="422"
            y="206"
            width="146"
            height="16"
            rx="3"
            fill="#0a1020"
            opacity="0.85"
          />
          <text
            x="428"
            y={rowMid(206)}
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            🌡 Temp
          </text>
          <text
            x="564"
            y={rowMid(206)}
            dominantBaseline="middle"
            textAnchor="end"
            fill={bTempColor}
            fontSize="10"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            {(bedroomTemp ?? "--") + "°C"}
          </text>

          <rect
            x="422"
            y="225"
            width="146"
            height="16"
            rx="3"
            fill="#0a1020"
            opacity="0.85"
          />
          <text
            x="428"
            y={rowMid(225)}
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            💧 Humidity
          </text>
          <text
            x="564"
            y={rowMid(225)}
            dominantBaseline="middle"
            textAnchor="end"
            fill="#60a5fa"
            fontSize="10"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            {(bedroomHum ?? "--") + "%"}
          </text>

          <rect
            x="422"
            y="244"
            width="146"
            height="16"
            rx="3"
            fill="#0a1020"
            opacity="0.85"
          />
          <text
            x="428"
            y={rowMid(244)}
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            💨 Gas
          </text>
          <text
            x="564"
            y={rowMid(244)}
            dominantBaseline="middle"
            textAnchor="end"
            fill={bGasColor}
            fontSize="10"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            {(bedroomGas ?? "--") + "ppm"}
          </text>

          <rect
            x="422"
            y="263"
            width="146"
            height="16"
            rx="3"
            fill="#0a1020"
            opacity="0.85"
          />
          <text
            x="428"
            y={rowMid(263)}
            dominantBaseline="middle"
            fill="#6b7280"
            fontSize="9"
            fontFamily="'Roboto',sans-serif"
          >
            🔥 Flame
          </text>
          <text
            x="564"
            y={rowMid(263)}
            dominantBaseline="middle"
            textAnchor="end"
            fill={bedroomFlame ? "#f87171" : "#34d399"}
            fontSize="10"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            {bedroomFlame ? "DETECTED" : "None"}
          </text>

          {flameZone === "Bedroom" && (
            <text
              x="495"
              y="304"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#f87171"
              fontSize="9"
              fontFamily="'Roboto',sans-serif"
              fontWeight="700"
            >
              ⚠ FIRE HERE
            </text>
          )}
          {flameZone === "Bedroom" && (
            <ellipse
              cx="468"
              cy="294"
              rx="5"
              ry="8"
              fill="#94a3b8"
              opacity="0.2"
              className="smoke-puff"
            />
          )}
          {flameZone === "Bedroom" && (
            <ellipse
              cx="522"
              cy="290"
              rx="4"
              ry="6"
              fill="#94a3b8"
              opacity="0.15"
              className="smoke-puff"
            />
          )}

          {/* Hallway */}
          <rect
            x="154"
            y="258"
            width="256"
            height="88"
            rx="6"
            fill="#0a1520"
            stroke="#1e3a52"
            strokeWidth="1"
          />
          <text
            x="282"
            y="302"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1e3a52"
            fontSize="11"
            fontFamily="'Roboto',sans-serif"
            fontWeight="700"
          >
            HALLWAY / CORRIDOR
          </text>

          {/* ── EXITS ── */}

          {/* Main Door — bottom center, midY = 344+7 = 351 */}
          <rect
            x="220"
            y="344"
            width="124"
            height="14"
            rx="7"
            fill="#34d399"
            stroke="#059669"
            strokeWidth="2"
          />
          <text
            x="282"
            y="351"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#022c22"
            fontSize="8"
            fontFamily="'Roboto',sans-serif"
            fontWeight="900"
            letterSpacing="2"
          >
            DOOR
          </text>

          {/* Back Door — top of Dining, midY = 1+6 = 7 */}
          <rect
            x="438"
            y="1"
            width="96"
            height="12"
            rx="6"
            fill="#60a5fa"
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text
            x="486"
            y="7"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#0c1a3a"
            fontSize="8"
            fontFamily="'Roboto',sans-serif"
            fontWeight="900"
            letterSpacing="2"
          >
            DOOR
          </text>

          {/* Kitchen Window — bottom of Kitchen, midY = 282+6 = 288 */}
          <rect
            x="14"
            y="282"
            width="126"
            height="12"
            rx="6"
            fill="#a78bfa"
            stroke="#7c3aed"
            strokeWidth="1.5"
          />
          <text
            x="77"
            y="288"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1a0a3a"
            fontSize="8"
            fontFamily="'Roboto',sans-serif"
            fontWeight="900"
            letterSpacing="2"
          >
            WINDOW
          </text>

          {/* Dining Window — right side, rect x=569 y=22 w=11 h=72, centerX=574.5 centerY=58 */}
          <rect
            x="569"
            y="22"
            width="11"
            height="72"
            rx="5"
            fill="#fbbf24"
            stroke="#d97706"
            strokeWidth="1.5"
          />
          <text
            x="574.5"
            y="58"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1c0a00"
            fontSize="8"
            fontFamily="'Roboto',sans-serif"
            fontWeight="900"
            letterSpacing="2"
            transform="rotate(90,574.5,58)"
          >
            WINDOW
          </text>

          {/* Bedroom Window — right side, rect x=569 y=200 w=11 h=72, centerX=574.5 centerY=236 */}
          <rect
            x="569"
            y="200"
            width="11"
            height="72"
            rx="5"
            fill="#f472b6"
            stroke="#be185d"
            strokeWidth="1.5"
          />
          <text
            x="574.5"
            y="236"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1c0010"
            fontSize="8"
            fontFamily="'Roboto',sans-serif"
            fontWeight="900"
            letterSpacing="2"
            transform="rotate(90,574.5,236)"
          >
            WINDOW
          </text>

          {/* ── INTERIOR DOORS ── */}

          {/* Bathroom ↔ Living Room — rect x=146 y=44 w=14 h=30, centerX=153 centerY=59 */}
          <rect
            x="146"
            y="44"
            width="14"
            height="30"
            rx="7"
            fill="#fde68a"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <text
            x="153"
            y="59"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#78350f"
            fontSize="7"
            fontFamily="'Roboto',sans-serif"
            fontWeight="900"
            letterSpacing="1"
            transform="rotate(90,153,59)"
          >
            DOOR
          </text>

          {/* Bedroom ↔ Living Room — rect x=406 y=210 w=14 h=30, centerX=413 centerY=225 */}
          <rect
            x="406"
            y="210"
            width="14"
            height="30"
            rx="7"
            fill="#fde68a"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <text
            x="413"
            y="225"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#78350f"
            fontSize="7"
            fontFamily="'Roboto',sans-serif"
            fontWeight="900"
            letterSpacing="1"
            transform="rotate(90,413,225)"
          >
            DOOR
          </text>
          {/* Warning trace — show when elevated but no full alert */}
          {hasWarn && !flameZone && (
            <g>
              <circle cx="282" cy="50" r="5" fill="#fbbf24" opacity="0.6" />
              <circle cx="282" cy="50" r="3" fill="#fbbf24" />
              <polyline
                points="282,50 282,258 282,344"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeDasharray="8,4"
                strokeLinecap="round"
                opacity="0.8"
              />
              <polygon
                points="274,342 282,354 290,342"
                fill="#fbbf24"
                opacity="0.8"
              />
              <text
                x="298"
                y="200"
                fill="#fbbf24"
                fontSize="9"
                fontFamily="'Roboto',sans-serif"
                fontWeight="700"
                opacity="0.9"
              >
                ⚠ Exit via Main Door
              </text>
              <rect
                x="10"
                y="312"
                width="136"
                height="10"
                rx="3"
                fill="#080f1e"
                opacity="0.9"
              />
              <line
                x1="14"
                y1="317"
                x2="24"
                y2="317"
                stroke="#fbbf24"
                strokeWidth="2"
              />
              <text
                x="28"
                y="321"
                fill="#fbbf24"
                fontSize="7"
                fontFamily="'Roboto',sans-serif"
              >
                Elevated — use Main Door
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
