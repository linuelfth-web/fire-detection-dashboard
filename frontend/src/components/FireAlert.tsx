import React, { useEffect, useState } from "react";

interface Props {
  flameDetected: boolean;
  gasLevel: number;
  temperature: number;
  flameZone: string;
  gasZone?: string;
  tempZone?: string;
}

export const FireAlert = ({
  flameDetected,
  gasLevel,
  temperature,
  flameZone,
  gasZone = "",
  tempZone = "",
}: Props) => {
  const [phase, setPhase] = useState<"hidden" | "alarm" | "escape">(
    window.location.hash === "#alert" ? "escape" : "hidden",
  );
  const [countdown, setCountdown] = useState(15);
  const [dismissCD, setDismissCD] = useState(10);
  const [prevAny, setPrevAny] = useState(false);
  const [fa, setFa] = useState(0);
  const [savedZone, setSavedZone] = useState("");

  const gasAlert = gasLevel >= 700;
  const tempAlert = temperature >= 40;
  const anyAlert = flameDetected || gasAlert || tempAlert;
  const alertType = flameDetected ? "flame" : gasAlert ? "gas" : "temp";
  const activeZone = savedZone || flameZone;
  const isKFire = activeZone === "Kitchen";
  const isBFire = activeZone === "Bedroom";
  const isTemp = activeZone === "Temp";
  const ff = ["🔥", "🔥 ", "  🔥"];

  useEffect(() => {
    const id = setInterval(() => setFa((a) => (a + 1) % 3), 350);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (anyAlert && !prevAny) {
      setPhase("alarm");
      if (tempAlert) {
        setSavedZone("Temp");
        setCountdown(3);
      } else if (flameDetected) {
        setSavedZone(flameZone);
        setCountdown(15);
      } else if (gasAlert) {
        setSavedZone(gasZone || "Gas");
        setCountdown(15);
      }
    }
    if (!anyAlert && prevAny && phase === "alarm") {
      setPhase("escape");
      setDismissCD(10);
    }
    setPrevAny(anyAlert);
  }, [anyAlert, flameZone]);

  useEffect(() => {
    if (phase !== "alarm") return;
    if (countdown <= 0) {
      setPhase("escape");
      setDismissCD(10);
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== "escape" || dismissCD <= 0) return;
    const id = setTimeout(() => setDismissCD((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, dismissCD]);

  if (phase === "hidden") return null;

  const configs: any = {
    flame: {
      emoji: "🔥",
      title: "FLAME",
      subtitle: "DETECTED",
      tc: "#fff",
      sc: "#fca5a5",
      bg: "linear-gradient(135deg,#7f1d1d,#991b1b)",
      border: "#f87171",
      glow: "#dc2626",
      desc: "Fire detected in your home.",
      action: "Evacuate immediately via nearest exit.",
      dot: "#f87171",
      lbl: "FIRE ACTIVE",
    },
    gas: {
      emoji: "💨",
      title: "DANGEROUS",
      subtitle: "GAS LEVEL",
      tc: "#fbbf24",
      sc: "#fde68a",
      bg: "linear-gradient(135deg,#451a03,#78350f)",
      border: "#f59e0b",
      glow: "#d97706",
      desc: "Dangerous gas concentration.",
      action: "Open windows and evacuate.",
      dot: "#f59e0b",
      lbl: "GAS ALERT",
    },
    temp: {
      emoji: "🌡️",
      title: "CRITICAL",
      subtitle: "TEMPERATURE",
      tc: "#fb923c",
      sc: "#fed7aa",
      bg: "linear-gradient(135deg,#431407,#7c2d12)",
      border: "#f97316",
      glow: "#ea580c",
      desc: "Temperature has reached 40°C — Fire may have spread to multiple areas.",
      action: "Kitchen and Living Room may be affected. Evacuate immediately.",
      dot: "#f97316",
      lbl: "TEMP ALERT",
    },
  };
  const c = configs[alertType];

  const zoneDetails: any = {
    Kitchen: {
      icon: "🍳",
      location: "Kitchen Area — CH-01/02/03",
      sensors: "Flame sensor triggered · IR intensity critical",
      advice: "Do NOT enter Kitchen — use Living Room to exit",
      safeDir: "Living Room → Main Door OR Dining → Back Door",
    },
    Bedroom: {
      icon: "🛏️",
      location: "Bedroom Area — CH-01/02/03",
      sensors: "Flame sensor triggered · IR intensity critical",
      advice: "Do NOT enter Bedroom — use Living Room side to exit",
      safeDir: "Living Room → Main Door at bottom",
    },
    Gas: {
      icon: "💨",
      location: "Gas/Smoke Sensor — MQ-2",
      sensors: "Gas concentration critical · Above 700ppm",
      advice: "Open all windows and doors immediately",
      safeDir: "Evacuate via nearest exit — do not use switches",
    },
    Temp: {
      icon: "🌡️",
      location: "Multiple Areas — Fire Spreading",
      sensors: "Temp above 40°C · Kitchen + Living Room affected",
      advice: "Fire may have spread — avoid Kitchen and Living Room",
      safeDir: "Use Back Door via Dining Area OR Bedroom Window",
    },
  };

  const zd = zoneDetails[activeZone] || null;

  if (phase === "escape") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#060c18",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch" as any,
          padding: "16px 16px 32px",
        }}
      >
        <style>{`
          @keyframes ep{0%,100%{opacity:1}50%{opacity:0.4}}
          @keyframes eglow{0%,100%{filter:drop-shadow(0 0 5px #ef4444)}50%{filter:drop-shadow(0 0 18px #ef4444)}}
          @keyframes esmoke{0%{opacity:0.5;transform:translateY(0)}100%{opacity:0;transform:translateY(-20px)}}
          @keyframes edash{to{stroke-dashoffset:-24}}
          @keyframes efade{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          .ep{animation:ep 1.5s infinite}
          .eglow{animation:eglow 0.8s infinite}
          .esmoke{animation:esmoke 1.6s infinite}
          .edash{animation:edash 0.6s linear infinite}
          .efade{animation:efade 0.5s ease}
        `}</style>

        <div
          className="efade"
          style={{
            width: "100%",
            maxWidth: 860,
            margin: "0 auto",
            background: "#131e2e",
            border: "2px solid " + c.border,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: c.bg,
              padding: "14px 22px",
              textAlign: "center",
              borderBottom: "2px solid " + c.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 26 }}>{c.emoji}</div>
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: 2,
                }}
              >
                FOLLOW ESCAPE ROUTE
              </div>
              <div style={{ fontSize: 11, color: "#fecaca", marginTop: 2 }}>
                {activeZone
                  ? isTemp
                    ? "CRITICAL TEMP — Fire spread to Kitchen, Living Room and Hallway"
                    : "Fire was in " +
                      activeZone +
                      " — Use route AWAY from " +
                      activeZone
                  : "Follow the safest exit route"}
              </div>
            </div>
          </div>

          {/* Zone detail */}
          {zd && (
            <div
              style={{
                background: "rgba(220,38,38,0.12)",
                borderBottom: "1px solid #dc262644",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap" as const,
              }}
            >
              <span style={{ fontSize: 22 }}>{zd.icon}</span>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#f87171",
                    marginBottom: 2,
                  }}
                >
                  🔥 Fire Location: {zd.location}
                </div>
                <div style={{ fontSize: 11, color: "#fca5a5" }}>
                  {zd.sensors}
                </div>
              </div>
              <div
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid #f87171",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: 11,
                  color: "#fde68a",
                }}
              >
                ⚠️ {zd.advice}
              </div>
            </div>
          )}

          <div style={{ padding: "10px 14px" }}>
            {/* Route cards — compact 3-column */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 6,
                marginBottom: 10,
              }}
            >
              {isKFire && (
                <>
                  <div
                    style={{
                      background: "#60a5fa22",
                      border: "2px solid #60a5fa",
                      borderRadius: 8,
                      padding: "7px 8px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        right: -1,
                        background: "#16a34a",
                        color: "#fff",
                        fontSize: 7,
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "0 6px 0 4px",
                      }}
                    >
                      ✅ SAFEST
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#60a5fa",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#60a5fa",
                        }}
                      >
                        Back Door
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Living → Dining → Back
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#0f172a",
                      border: "1px solid #1e3a52",
                      borderRadius: 8,
                      padding: "7px 8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#fbbf24",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#fbbf24",
                        }}
                      >
                        Dining Win.
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Dining → Side Win.
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#0f172a",
                      border: "1px solid #1e3a52",
                      borderRadius: 8,
                      padding: "7px 8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#f472b6",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#f472b6",
                        }}
                      >
                        Bedroom Win.
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Bedroom → Side Win.
                    </div>
                    <div
                      style={{ fontSize: 7, color: "#f87171", fontWeight: 700 }}
                    >
                      ⚠ Near fire zone
                    </div>
                  </div>
                </>
              )}
              {isBFire && (
                <>
                  <div
                    style={{
                      background: "#34d39922",
                      border: "2px solid #34d399",
                      borderRadius: 8,
                      padding: "7px 8px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        right: -1,
                        background: "#16a34a",
                        color: "#fff",
                        fontSize: 7,
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "0 6px 0 4px",
                      }}
                    >
                      ✅ SAFEST
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#34d399",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#34d399",
                        }}
                      >
                        Main Door
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Living Room → Main
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#0f172a",
                      border: "1px solid #1e3a52",
                      borderRadius: 8,
                      padding: "7px 8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#60a5fa",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#60a5fa",
                        }}
                      >
                        Back Door
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Living → Dining → Back
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#0f172a",
                      border: "1px solid #1e3a52",
                      borderRadius: 8,
                      padding: "7px 8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#a78bfa",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#a78bfa",
                        }}
                      >
                        Kitchen Win.
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Kitchen → Bottom Win.
                    </div>
                  </div>
                </>
              )}
              {isTemp && (
                <>
                  <div
                    style={{
                      background: "#60a5fa22",
                      border: "2px solid #60a5fa",
                      borderRadius: 8,
                      padding: "7px 8px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: -1,
                        right: -1,
                        background: "#16a34a",
                        color: "#fff",
                        fontSize: 7,
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "0 6px 0 4px",
                      }}
                    >
                      SAFEST
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#60a5fa",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#60a5fa",
                        }}
                      >
                        Dining → Back
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Dining → Back Door
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#0f172a",
                      border: "1px solid #1e3a52",
                      borderRadius: 8,
                      padding: "7px 8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#f472b6",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#f472b6",
                        }}
                      >
                        Bedroom Win.
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Bedroom → Side Win.
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#0f172a",
                      border: "1px solid #1e3a52",
                      borderRadius: 8,
                      padding: "7px 8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#fbbf24",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#fbbf24",
                        }}
                      >
                        Hallway → Win.
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                    >
                      Hallway → Bedroom Win.
                    </div>
                    <div
                      style={{ fontSize: 7, color: "#f87171", fontWeight: 700 }}
                    >
                      ⚠ Stay right
                    </div>
                  </div>
                </>
              )}
              {!activeZone && !isTemp && (
                <div
                  style={{
                    background: "#34d39922",
                    border: "2px solid #34d399",
                    borderRadius: 8,
                    padding: "7px 8px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      right: -1,
                      background: "#16a34a",
                      color: "#fff",
                      fontSize: 7,
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: "0 6px 0 4px",
                    }}
                  >
                    ✅ SAFEST
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 2,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#34d399",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#34d399",
                      }}
                    >
                      Main Door
                    </span>
                  </div>
                  <div
                    style={{ fontSize: 8, color: "#9ca3af", lineHeight: 1.3 }}
                  >
                    Living Room → Main
                  </div>
                </div>
              )}
            </div>

            {/* Floor Plan — emphasized, max size */}
            <div
              style={{
                border: "2px solid " + c.border,
                borderRadius: 12,
                padding: 4,
                background: "#080f1e",
                marginBottom: 12,
                marginLeft: "auto",
                marginRight: "auto",
                width: "100%",
                maxWidth: "100%",
                boxShadow: "0 0 24px " + c.glow + "66",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: c.border,
                  textTransform: "uppercase" as const,
                  textAlign: "center" as const,
                  padding: "4px 0 2px",
                }}
              >
                🗺️ Floor Plan — Follow Highlighted Route
              </div>
              <svg
                viewBox="0 0 560 340"
                style={{ width: "100%", display: "block", borderRadius: 8 }}
              >
                <style>{`
                  @keyframes fmGlow{0%,100%{filter:drop-shadow(0 0 6px #ef4444)}50%{filter:drop-shadow(0 0 18px #ef4444)}}
                  @keyframes fmSmoke{0%{opacity:0.6;transform:translateY(0)}100%{opacity:0;transform:translateY(-16px)}}
                  @keyframes fmDash{to{stroke-dashoffset:-20}}
                  .fm-fire{animation:fmGlow 0.7s infinite}
                  .fm-smoke{animation:fmSmoke 1.4s infinite}
                  .fm-dash{animation:fmDash 0.5s linear infinite}
                `}</style>
                <rect
                  x="0"
                  y="0"
                  width="560"
                  height="340"
                  rx="8"
                  fill="#080f1e"
                />

                {/* Rooms */}
                <rect
                  x="8"
                  y="8"
                  width="120"
                  height="110"
                  rx="5"
                  fill="#1a2d1a"
                  stroke="#2d5a2d"
                  strokeWidth="1.5"
                />
                <text
                  x="68"
                  y="52"
                  textAnchor="middle"
                  fill="#4ade80"
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  BATH
                </text>
                <text
                  x="68"
                  y="65"
                  textAnchor="middle"
                  fill="#4ade80"
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  ROOM
                </text>

                <rect
                  x="136"
                  y="8"
                  width="250"
                  height="230"
                  rx="5"
                  fill="#0e1b2e"
                  stroke="#1e3a52"
                  strokeWidth="1.5"
                />
                <text
                  x="261"
                  y="115"
                  textAnchor="middle"
                  fill="#3b82f6"
                  fontSize="14"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  LIVING
                </text>
                <text
                  x="261"
                  y="132"
                  textAnchor="middle"
                  fill="#3b82f6"
                  fontSize="14"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  ROOM
                </text>

                <rect
                  x="394"
                  y="8"
                  width="158"
                  height="155"
                  rx="5"
                  fill="#1e1a0a"
                  stroke="#5a4a00"
                  strokeWidth="1.5"
                />
                <text
                  x="473"
                  y="78"
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  DINING
                </text>
                <text
                  x="473"
                  y="92"
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  AREA
                </text>

                <rect
                  x="8"
                  y="126"
                  width="120"
                  height="130"
                  rx="5"
                  fill={isKFire ? "#3b0000" : "#1a1a0e"}
                  stroke={isKFire ? "#ef4444" : "#4a5a00"}
                  strokeWidth={isKFire ? 3 : 1.5}
                  className={isKFire ? "fm-fire" : ""}
                />
                <text
                  x="68"
                  y="178"
                  textAnchor="middle"
                  fill={isKFire ? "#f87171" : "#84cc16"}
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  KITCHEN
                </text>
                <text
                  x="68"
                  y="191"
                  textAnchor="middle"
                  fill={isKFire ? "#f87171" : "#84cc16"}
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  AREA
                </text>
                {isKFire && (
                  <text x="40" y="218" fontSize="16" textAnchor="middle">
                    {ff[fa]}
                  </text>
                )}
                {isKFire && (
                  <text x="96" y="218" fontSize="16" textAnchor="middle">
                    {ff[(fa + 1) % 3]}
                  </text>
                )}
                {isKFire && (
                  <text
                    x="68"
                    y="236"
                    textAnchor="middle"
                    fill="#f87171"
                    fontSize="8"
                    fontFamily="system-ui"
                    fontWeight="700"
                  >
                    FIRE HERE
                  </text>
                )}
                {isKFire && (
                  <ellipse
                    cx="52"
                    cy="204"
                    rx="4"
                    ry="7"
                    fill="#94a3b8"
                    opacity="0.15"
                    className="fm-smoke"
                  />
                )}
                {isKFire && (
                  <ellipse
                    cx="84"
                    cy="200"
                    rx="3"
                    ry="6"
                    fill="#94a3b8"
                    opacity="0.1"
                    className="fm-smoke"
                  />
                )}

                <rect
                  x="394"
                  y="170"
                  width="158"
                  height="162"
                  rx="5"
                  fill={isBFire ? "#3b0000" : "#1a0e1a"}
                  stroke={isBFire ? "#ef4444" : "#5a2a5a"}
                  strokeWidth={isBFire ? 3 : 1.5}
                  className={isBFire ? "fm-fire" : ""}
                />
                <text
                  x="473"
                  y="248"
                  textAnchor="middle"
                  fill={isBFire ? "#f87171" : "#c084fc"}
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  BEDROOM
                </text>
                {isBFire && (
                  <text x="448" y="272" fontSize="16" textAnchor="middle">
                    {ff[fa]}
                  </text>
                )}
                {isBFire && (
                  <text x="498" y="272" fontSize="16" textAnchor="middle">
                    {ff[(fa + 1) % 3]}
                  </text>
                )}
                {isBFire && (
                  <text
                    x="473"
                    y="290"
                    textAnchor="middle"
                    fill="#f87171"
                    fontSize="8"
                    fontFamily="system-ui"
                    fontWeight="700"
                  >
                    FIRE HERE
                  </text>
                )}
                {isBFire && (
                  <ellipse
                    cx="458"
                    cy="258"
                    rx="4"
                    ry="7"
                    fill="#94a3b8"
                    opacity="0.15"
                    className="fm-smoke"
                  />
                )}
                {isBFire && (
                  <ellipse
                    cx="488"
                    cy="254"
                    rx="3"
                    ry="6"
                    fill="#94a3b8"
                    opacity="0.1"
                    className="fm-smoke"
                  />
                )}

                <rect
                  x="136"
                  y="246"
                  width="250"
                  height="86"
                  rx="5"
                  fill="#0a1520"
                  stroke="#1e3a52"
                  strokeWidth="1"
                />
                <text
                  x="261"
                  y="292"
                  textAnchor="middle"
                  fill="#1e3a52"
                  fontSize="10"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  HALLWAY
                </text>

                {/* Exits */}
                <rect
                  x="208"
                  y="328"
                  width="106"
                  height="12"
                  rx="6"
                  fill="#34d399"
                  stroke="#059669"
                  strokeWidth="1.5"
                />
                <text
                  x="261"
                  y="337"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#022c22"
                  fontSize="7"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  DOOR
                </text>
                <rect
                  x="424"
                  y="2"
                  width="80"
                  height="10"
                  rx="5"
                  fill="#60a5fa"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                />
                <text
                  x="464"
                  y="7"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#0c1a3a"
                  fontSize="7"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  DOOR
                </text>
                <rect
                  x="14"
                  y="254"
                  width="106"
                  height="10"
                  rx="5"
                  fill="#a78bfa"
                  stroke="#7c3aed"
                  strokeWidth="1.5"
                />
                <text
                  x="67"
                  y="259"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#1a0a3a"
                  fontSize="7"
                  fontFamily="system-ui"
                  fontWeight="700"
                >
                  WINDOW
                </text>
                <rect
                  x="548"
                  y="25"
                  width="10"
                  height="60"
                  rx="5"
                  fill="#fbbf24"
                  stroke="#d97706"
                  strokeWidth="1.5"
                />
                <text
                  x="553"
                  y="55"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#1c0a00"
                  fontSize="6"
                  fontFamily="system-ui"
                  fontWeight="700"
                  transform="rotate(90,553,55)"
                >
                  WIN
                </text>
                <rect
                  x="548"
                  y="188"
                  width="10"
                  height="60"
                  rx="5"
                  fill="#f472b6"
                  stroke="#be185d"
                  strokeWidth="1.5"
                />
                <text
                  x="553"
                  y="218"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#1c0010"
                  fontSize="6"
                  fontFamily="system-ui"
                  fontWeight="700"
                  transform="rotate(90,553,218)"
                >
                  WIN
                </text>

                {/* Interior doors */}
                <rect
                  x="128"
                  y="42"
                  width="14"
                  height="26"
                  rx="7"
                  fill="#fde68a"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <rect
                  x="382"
                  y="198"
                  width="14"
                  height="26"
                  rx="7"
                  fill="#fde68a"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />

                {/* TEMP fire spread */}
                {isTemp && (
                  <g>
                    <rect
                      x="8"
                      y="126"
                      width="120"
                      height="130"
                      rx="5"
                      fill="#7f1d1d"
                      stroke="#ef4444"
                      strokeWidth="3"
                    />
                    <text
                      x="68"
                      y="162"
                      textAnchor="middle"
                      fill="#fca5a5"
                      fontSize="9"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      🔥 FIRE ZONE
                    </text>
                    <text x="40" y="208" fontSize="14" textAnchor="middle">
                      {ff[fa]}
                    </text>
                    <text x="96" y="208" fontSize="14" textAnchor="middle">
                      {ff[(fa + 1) % 3]}
                    </text>
                    <ellipse
                      cx="40"
                      cy="148"
                      rx="5"
                      ry="9"
                      fill="#94a3b8"
                      opacity="0.3"
                      className="fm-smoke"
                    />
                    <ellipse
                      cx="96"
                      cy="143"
                      rx="4"
                      ry="7"
                      fill="#94a3b8"
                      opacity="0.2"
                      className="fm-smoke"
                    />
                    <rect
                      x="136"
                      y="8"
                      width="250"
                      height="230"
                      rx="5"
                      fill="#7c2d1280"
                      stroke="#f97316"
                      strokeWidth="2.5"
                    />
                    <text
                      x="261"
                      y="50"
                      textAnchor="middle"
                      fill="#fb923c"
                      fontSize="10"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      ⚠ FIRE SPREADING
                    </text>
                    <text x="220" y="170" fontSize="16" textAnchor="middle">
                      {ff[fa]}
                    </text>
                    <text x="310" y="190" fontSize="14" textAnchor="middle">
                      {ff[(fa + 1) % 3]}
                    </text>
                    <ellipse
                      cx="190"
                      cy="28"
                      rx="7"
                      ry="11"
                      fill="#94a3b8"
                      opacity="0.2"
                      className="fm-smoke"
                    />
                    <ellipse
                      cx="320"
                      cy="22"
                      rx="5"
                      ry="8"
                      fill="#94a3b8"
                      opacity="0.15"
                      className="fm-smoke"
                    />
                    <rect
                      x="136"
                      y="246"
                      width="140"
                      height="86"
                      rx="4"
                      fill="#78350f60"
                      stroke="#f97316"
                      strokeWidth="2"
                    />
                    <text
                      x="205"
                      y="285"
                      textAnchor="middle"
                      fill="#fb923c"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      ⚠ FIRE CREEPING
                    </text>
                    <rect
                      x="8"
                      y="8"
                      width="120"
                      height="110"
                      rx="5"
                      fill="#78350f25"
                      stroke="#f97316"
                      strokeWidth="2"
                    />
                    <text
                      x="68"
                      y="100"
                      textAnchor="middle"
                      fill="#fb923c"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      ⚠ HEAT
                    </text>
                    <rect
                      x="394"
                      y="8"
                      width="158"
                      height="155"
                      rx="5"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    <text
                      x="473"
                      y="120"
                      textAnchor="middle"
                      fill="#4ade80"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      ✓ SAFE
                    </text>
                    <rect
                      x="394"
                      y="170"
                      width="158"
                      height="162"
                      rx="5"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    <text
                      x="473"
                      y="255"
                      textAnchor="middle"
                      fill="#4ade80"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      ✓ SAFE
                    </text>
                    <circle
                      cx="464"
                      cy="100"
                      r="5"
                      fill="#60a5fa"
                      opacity="0.4"
                    />
                    <circle cx="464" cy="100" r="3" fill="#60a5fa" />
                    <polyline
                      points="464,100 464,12"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="3.5"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      className="fm-dash"
                    />
                    <polygon points="457,14 464,4 471,14" fill="#60a5fa" />
                    <text
                      x="420"
                      y="62"
                      textAnchor="middle"
                      fill="#60a5fa"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      1 Back Door
                    </text>
                    <circle
                      cx="473"
                      cy="220"
                      r="4"
                      fill="#f472b6"
                      opacity="0.4"
                    />
                    <circle cx="473" cy="220" r="2.5" fill="#f472b6" />
                    <polyline
                      points="473,220 548,220"
                      fill="none"
                      stroke="#f472b6"
                      strokeWidth="3"
                      strokeDasharray="7,4"
                      strokeLinecap="round"
                      opacity="0.9"
                      className="fm-dash"
                    />
                    <polygon
                      points="545,214 555,220 545,226"
                      fill="#f472b6"
                      opacity="0.9"
                    />
                    <text
                      x="473"
                      y="212"
                      textAnchor="middle"
                      fill="#f472b6"
                      fontSize="7"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      2 Bed.Win.
                    </text>
                    <circle
                      cx="370"
                      cy="270"
                      r="4"
                      fill="#fbbf24"
                      opacity="0.4"
                    />
                    <circle cx="370" cy="270" r="2.5" fill="#fbbf24" />
                    <polyline
                      points="370,270 394,270 394,240 548,240"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      strokeDasharray="7,4"
                      strokeLinecap="round"
                      opacity="0.85"
                      className="fm-dash"
                    />
                    <polygon
                      points="545,234 555,240 545,246"
                      fill="#fbbf24"
                      opacity="0.85"
                    />
                    <text
                      x="430"
                      y="263"
                      textAnchor="middle"
                      fill="#fbbf24"
                      fontSize="7"
                      fontFamily="system-ui"
                      opacity="0.95"
                    >
                      3 Hall→Bed.Win.
                    </text>
                    <rect
                      x="8"
                      y="268"
                      width="120"
                      height="9"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.92"
                    />
                    <line
                      x1="12"
                      y1="272"
                      x2="20"
                      y2="272"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                    />
                    <text
                      x="24"
                      y="276"
                      fill="#60a5fa"
                      fontSize="7"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      1 Back Door (SAFEST)
                    </text>
                    <rect
                      x="8"
                      y="279"
                      width="120"
                      height="9"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.92"
                    />
                    <line
                      x1="12"
                      y1="283"
                      x2="20"
                      y2="283"
                      stroke="#f472b6"
                      strokeWidth="2"
                    />
                    <text
                      x="24"
                      y="287"
                      fill="#f472b6"
                      fontSize="7"
                      fontFamily="system-ui"
                    >
                      2 Bedroom Window
                    </text>
                    <rect
                      x="8"
                      y="290"
                      width="120"
                      height="9"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.92"
                    />
                    <line
                      x1="12"
                      y1="294"
                      x2="20"
                      y2="294"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />
                    <text
                      x="24"
                      y="298"
                      fill="#fbbf24"
                      fontSize="7"
                      fontFamily="system-ui"
                    >
                      3 Hallway→Bed.Win.
                    </text>
                  </g>
                )}

                {/* Kitchen fire routes */}
                {isKFire && !isTemp && (
                  <g>
                    {/* Route 1 SAFEST - Back Door - blue - through Bathroom door → Living Room → Dining → Back Door */}
                    <circle
                      cx="142"
                      cy="55"
                      r="5"
                      fill="#60a5fa"
                      opacity="0.6"
                    />
                    <circle cx="142" cy="55" r="3" fill="#60a5fa" />
                    <polyline
                      points="142,55 392,55 464,55 464,12"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="4"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      className="fm-dash"
                    />
                    <polygon points="457,14 464,4 471,14" fill="#60a5fa" />
                    <circle
                      cx="464"
                      cy="5"
                      r="6"
                      fill="#60a5fa"
                      opacity="0.4"
                      stroke="#60a5fa"
                      strokeWidth="2"
                    />
                    <text
                      x="300"
                      y="48"
                      textAnchor="middle"
                      fill="#60a5fa"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="900"
                    >
                      1 Back Door (SAFEST)
                    </text>

                    {/* Route 2 - Bedroom Window - amber - Living Room → right → Bedroom Window */}
                    <circle
                      cx="310"
                      cy="150"
                      r="4"
                      fill="#fbbf24"
                      opacity="0.6"
                    />
                    <circle cx="310" cy="150" r="2.5" fill="#fbbf24" />
                    <polyline
                      points="310,150 392,150 473,150 473,170 548,210"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="3"
                      strokeDasharray="7,4"
                      strokeLinecap="round"
                      opacity="0.9"
                      className="fm-dash"
                    />
                    <polygon points="546,204 558,210 546,216" fill="#fbbf24" />
                    <text
                      x="430"
                      y="144"
                      textAnchor="middle"
                      fill="#fbbf24"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      2 Bed.Win.
                    </text>

                    {/* Route 3 - Main Door - green - Living Room straight down → Hallway → Main Door */}
                    <circle
                      cx="260"
                      cy="30"
                      r="4"
                      fill="#34d399"
                      opacity="0.6"
                    />
                    <circle cx="260" cy="30" r="2.5" fill="#34d399" />
                    <polyline
                      points="260,30 260,246 260,328"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="3"
                      strokeDasharray="7,4"
                      strokeLinecap="round"
                      opacity="0.85"
                      className="fm-dash"
                    />
                    <polygon points="252,326 260,338 268,326" fill="#34d399" />
                    <circle
                      cx="260"
                      cy="334"
                      r="5"
                      fill="#34d399"
                      opacity="0.3"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    <text
                      x="276"
                      y="180"
                      fill="#34d399"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      3 Living→Main
                    </text>

                    {/* Legend */}
                    <rect
                      x="8"
                      y="276"
                      width="128"
                      height="10"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.95"
                    />
                    <line
                      x1="12"
                      y1="281"
                      x2="22"
                      y2="281"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                    />
                    <text
                      x="26"
                      y="285"
                      fill="#60a5fa"
                      fontSize="7"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      1 Back Door (SAFEST)
                    </text>
                    <rect
                      x="8"
                      y="288"
                      width="128"
                      height="10"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.95"
                    />
                    <line
                      x1="12"
                      y1="293"
                      x2="22"
                      y2="293"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />
                    <text
                      x="26"
                      y="297"
                      fill="#fbbf24"
                      fontSize="7"
                      fontFamily="system-ui"
                    >
                      2 Bedroom Window
                    </text>
                    <rect
                      x="8"
                      y="300"
                      width="128"
                      height="10"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.95"
                    />
                    <line
                      x1="12"
                      y1="305"
                      x2="22"
                      y2="305"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    <text
                      x="26"
                      y="309"
                      fill="#34d399"
                      fontSize="7"
                      fontFamily="system-ui"
                    >
                      3 Living→Main Door
                    </text>
                  </g>
                )}

                {/* Bedroom fire routes */}
                {isBFire && !isTemp && (
                  <g>
                    <circle
                      cx="261"
                      cy="265"
                      r="5"
                      fill="#34d399"
                      opacity="0.4"
                    />
                    <circle cx="261" cy="265" r="3" fill="#34d399" />
                    <polyline
                      points="261,265 261,328"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="3.5"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      className="fm-dash"
                    />
                    <polygon points="253,326 261,338 269,326" fill="#34d399" />
                    <circle
                      cx="261"
                      cy="334"
                      r="6"
                      fill="#34d399"
                      opacity="0.25"
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                    <text
                      x="278"
                      y="285"
                      fill="#34d399"
                      fontSize="8"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      1 Main Door (SAFEST)
                    </text>
                    <circle
                      cx="464"
                      cy="100"
                      r="4"
                      fill="#60a5fa"
                      opacity="0.35"
                    />
                    <circle cx="464" cy="100" r="2.5" fill="#60a5fa" />
                    <polyline
                      points="464,100 464,12"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      strokeDasharray="7,4"
                      strokeLinecap="round"
                      opacity="0.85"
                      className="fm-dash"
                    />
                    <polygon
                      points="457,14 464,4 471,14"
                      fill="#60a5fa"
                      opacity="0.85"
                    />
                    <text
                      x="420"
                      y="60"
                      fill="#60a5fa"
                      fontSize="7"
                      fontFamily="system-ui"
                      opacity="0.9"
                    >
                      2 Dining→Back
                    </text>
                    <circle
                      cx="68"
                      cy="180"
                      r="4"
                      fill="#a78bfa"
                      opacity="0.35"
                    />
                    <circle cx="68" cy="180" r="2.5" fill="#a78bfa" />
                    <polyline
                      points="68,180 68,262"
                      fill="none"
                      stroke="#a78bfa"
                      strokeWidth="2.5"
                      strokeDasharray="7,4"
                      strokeLinecap="round"
                      opacity="0.8"
                      className="fm-dash"
                    />
                    <polygon
                      points="60,260 68,272 76,260"
                      fill="#a78bfa"
                      opacity="0.8"
                    />
                    <text
                      x="82"
                      y="200"
                      fill="#a78bfa"
                      fontSize="7"
                      fontFamily="system-ui"
                      opacity="0.9"
                    >
                      3 Kitchen→Win.
                    </text>
                    <rect
                      x="8"
                      y="278"
                      width="120"
                      height="9"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.9"
                    />
                    <line
                      x1="12"
                      y1="282"
                      x2="20"
                      y2="282"
                      stroke="#34d399"
                      strokeWidth="2.5"
                    />
                    <text
                      x="24"
                      y="286"
                      fill="#34d399"
                      fontSize="7"
                      fontFamily="system-ui"
                      fontWeight="700"
                    >
                      1 Main Door (SAFEST)
                    </text>
                    <rect
                      x="8"
                      y="289"
                      width="120"
                      height="9"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.9"
                    />
                    <line
                      x1="12"
                      y1="293"
                      x2="20"
                      y2="293"
                      stroke="#60a5fa"
                      strokeWidth="2"
                    />
                    <text
                      x="24"
                      y="297"
                      fill="#60a5fa"
                      fontSize="7"
                      fontFamily="system-ui"
                    >
                      2 Dining→Back Door
                    </text>
                    <rect
                      x="8"
                      y="300"
                      width="120"
                      height="9"
                      rx="3"
                      fill="#080f1e"
                      opacity="0.9"
                    />
                    <line
                      x1="12"
                      y1="304"
                      x2="20"
                      y2="304"
                      stroke="#a78bfa"
                      strokeWidth="2"
                    />
                    <text
                      x="24"
                      y="308"
                      fill="#a78bfa"
                      fontSize="7"
                      fontFamily="system-ui"
                    >
                      3 Kitchen→Window
                    </text>
                  </g>
                )}

                {/* No active zone */}
                {!activeZone && (
                  <g>
                    <circle
                      cx="261"
                      cy="150"
                      r="5"
                      fill="#34d399"
                      opacity="0.4"
                    />
                    <circle cx="261" cy="150" r="3" fill="#34d399" />
                    <polyline
                      points="261,150 261,328"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="3.5"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                      className="fm-dash"
                    />
                    <polygon points="253,326 261,338 269,326" fill="#34d399" />
                    <circle
                      cx="261"
                      cy="334"
                      r="6"
                      fill="#34d399"
                      opacity="0.25"
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                <text
                  x="280"
                  y="335"
                  textAnchor="middle"
                  fill="#374151"
                  fontSize="6"
                  fontFamily="system-ui"
                >
                  Floor Plan — Recommended route highlighted
                </text>
              </svg>
            </div>

            {/* Dismiss */}
            {dismissCD > 0 ? (
              <div
                className="ep"
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: "#6b7280",
                  fontFamily: "monospace",
                  padding: 6,
                }}
              >
                {"Auto dismiss in " + dismissCD + "s..."}
              </div>
            ) : (
              <button
                onClick={() => setPhase("hidden")}
                style={{
                  width: "100%",
                  background: "#0f172a",
                  border: "2px solid " + c.border,
                  borderRadius: 10,
                  padding: "14px",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                UNDERSTOOD — DISMISS
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── ALARM PHASE ──
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes faFlash{0%,100%{background:rgba(0,0,0,0.9)}50%{background:rgba(140,0,0,0.95)}}
        @keyframes faPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes faBlink{0%,100%{opacity:1}50%{opacity:0.1}}
        @keyframes faIn{from{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}
        .fa-flash{animation:faFlash 0.7s infinite}
        .fa-box{animation:faPulse 0.8s infinite}
        .fa-blink{animation:faBlink 0.5s infinite}
        .fa-dot{animation:faBlink 0.6s infinite}
        .fa-in{animation:faIn 0.4s ease}
      `}</style>
      <div className="fa-flash" style={{ position: "absolute", inset: 0 }} />
      <div
        className="fa-box fa-in"
        style={{
          position: "relative",
          zIndex: 1,
          background: c.bg,
          border: "4px solid " + c.border,
          borderRadius: 20,
          padding: "36px 44px",
          maxWidth: 560,
          width: "92%",
          textAlign: "center",
          boxShadow: "0 0 80px " + c.glow + "88",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <div className="fa-blink" style={{ fontSize: 52 }}>
            {c.emoji}
          </div>
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: c.tc,
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "system-ui",
                lineHeight: 1.1,
              }}
            >
              {c.title}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: c.sc,
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "system-ui",
                lineHeight: 1.1,
              }}
            >
              {c.subtitle}
            </div>
          </div>
        </div>
        {activeZone && zd && (
          <div
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "2px solid " + c.border,
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 18,
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 28 }}>{zd.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 2,
                  }}
                >
                  🔥 Fire Location Detected
                </div>
                <div style={{ fontSize: 13, color: c.sc, fontWeight: 600 }}>
                  {zd.location}
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#fca5a5", marginBottom: 6 }}>
              {zd.sensors}
            </div>
            <div
              style={{
                background: "rgba(220,38,38,0.2)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                color: "#fde68a",
                fontWeight: 600,
              }}
            >
              ⚠️ {zd.advice}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#86efac",
                fontWeight: 600,
              }}
            >
              ✅ {zd.safeDir}
            </div>
          </div>
        )}
        <div
          style={{
            fontSize: 14,
            color: "#fecaca",
            marginBottom: 18,
            lineHeight: 1.7,
          }}
        >
          {c.desc}
          <br />
          <strong style={{ color: "#fff", fontSize: 15 }}>{c.action}</strong>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              height: 8,
              background: "rgba(0,0,0,0.4)",
              borderRadius: 4,
              overflow: "hidden",
              marginBottom: 6,
            }}
          >
            <div
              style={{
                height: "100%",
                background: c.border,
                borderRadius: 4,
                width: Math.round((countdown / 60) * 100) + "%",
                transition: "width 1s linear",
              }}
            />
          </div>
          <div style={{ fontSize: 12, color: c.sc, fontFamily: "monospace" }}>
            {"Escape route in " + countdown + "s"}
          </div>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(0,0,0,0.4)",
            border: "1px solid " + c.border,
            borderRadius: 20,
            padding: "6px 18px",
            fontSize: 13,
            color: c.sc,
            fontFamily: "monospace",
          }}
        >
          <span
            className="fa-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: c.dot,
              display: "inline-block",
            }}
          />
          {c.lbl}
        </div>
      </div>
    </div>
  );
};
