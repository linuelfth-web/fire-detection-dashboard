import React, { useEffect, useState } from "react";
import { SensorCard } from "./SensorCard";
import { EscapeRoute } from "./EscapeRoute";
import { FireAlert } from "./FireAlert";

function getLevel(dht: any, mq2: any, flame: any) {
  const dhtL =
    dht.temperature >= 40 || dht.humidity >= 95
      ? "danger"
      : dht.temperature >= 38 || dht.humidity >= 85
        ? "warning"
        : "normal";
  const mq2L =
    mq2.ppm >= 700 ? "danger" : mq2.ppm >= 400 ? "warning" : "normal";
  const tempWarn = dht.temperature >= 40;
  const hasAlert = flame.detected || dhtL === "danger" || mq2L === "danger";
  const hasWarn =
    !hasAlert && (dhtL === "warning" || mq2L === "warning" || tempWarn);
  return {
    dhtL,
    mq2L,
    flameL: flame.detected ? "danger" : "normal",
    hasAlert,
    hasWarn,
  };
}

function ZonePanel({ zoneName, icon, dht11, mq2, flame }: any) {
  const { dhtL, mq2L, flameL, hasAlert, hasWarn } = getLevel(dht11, mq2, flame);
  const bc = hasAlert ? "#b91c1c" : hasWarn ? "#92400e" : "#065f46";
  const bg = hasAlert ? "#3b0000" : hasWarn ? "#451a03" : "#064e3b";
  const fc = hasAlert ? "#f87171" : hasWarn ? "#fbbf24" : "#34d399";
  const label = hasAlert
    ? "🔴 Fire Alert"
    : hasWarn
      ? "⚠️ Elevated"
      : "✅ Secure";
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>
          {zoneName}
        </div>
        <div
          style={{ flex: 1, height: 1, background: "#1e3a52", marginLeft: 4 }}
        />
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 20,
            background: bg,
            color: fc,
            border: "1px solid " + bc,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </div>
      <div className="sensor-grid">
        <SensorCard
          title="Temp and Humidity"
          model="DHT11"
          channel="CH-01"
          icon="🌡️"
          alertLevel={dhtL}
          readings={[
            {
              label: "Temperature",
              value: dht11.temperature,
              unit: "°C",
              percent: Math.min(dht11.temperature, 100),
            },
            {
              label: "Humidity",
              value: dht11.humidity,
              unit: "%RH",
              percent: dht11.humidity,
            },
          ]}
          thresholdSummary={{
            warnAt: ">50°C",
            alertAt: ">70°C",
            range: "0-100°C",
          }}
        />
        <SensorCard
          title="Gas and Smoke"
          model="MQ-2"
          channel="CH-02"
          icon="💨"
          alertLevel={mq2L}
          readings={[
            {
              label: "Gas Conc.",
              value: mq2.ppm,
              unit: "ppm",
              percent: (mq2.ppm / 1000) * 100,
            },
            {
              label: "Voltage",
              value: mq2.analogVoltage.toFixed(2),
              unit: "V",
              percent: (mq2.analogVoltage / 5) * 100,
            },
          ]}
          thresholdSummary={{
            warnAt: ">400ppm",
            alertAt: ">700ppm",
            range: "0-1000",
          }}
        />
        <SensorCard
          title="Flame Sensor"
          model="IR-FLAME"
          channel="CH-03"
          icon="🔥"
          alertLevel={flameL}
          stateLabel={flame.detected ? "FIRE DETECTED" : "NOT DETECTED"}
          readings={[
            {
              label: "IR Intensity",
              value: flame.irIntensity,
              unit: "/1023",
              percent: (flame.irIntensity / 1023) * 100,
            },
          ]}
          thresholdSummary={{
            warnAt: ">600ADC",
            alertAt: "DO HIGH",
            range: "760nm",
          }}
        />
      </div>
    </div>
  );
}

export const Dashboard = ({ zones, connected }: any) => {
  const [clock, setClock] = useState("");
  const [uptime, setUptime] = useState("00:00:00");
  const [start] = useState(Date.now());

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString("en-GB"));
      const e = Math.floor((Date.now() - start) / 1000);
      setUptime(
        [Math.floor(e / 3600), Math.floor((e % 3600) / 60), e % 60]
          .map((n) => String(n).padStart(2, "0"))
          .join(":"),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [start]);

  const k = zones.kitchen,
    b = zones.bedroom;
  const kS = getLevel(k.dht11, k.mq2, k.flame);
  const bS = getLevel(b.dht11, b.mq2, b.flame);
  const gAlert = kS.hasAlert || bS.hasAlert;
  const gWarn = !gAlert && (kS.hasWarn || bS.hasWarn);
  const bBg = gAlert ? "#3b0000" : gWarn ? "#451a03" : "#0f2318";
  const bBorder = gAlert ? "#dc2626" : gWarn ? "#d97706" : "#059669";
  const bColor = gAlert ? "#f87171" : gWarn ? "#fbbf24" : "#34d399";
  const highTemp = Math.max(k.dht11.temperature, b.dht11.temperature) >= 40;
  const bText = gAlert
    ? "Fire Alert — Evacuate Immediately"
    : gWarn
      ? highTemp
        ? "Critical Temperature Detected — Stand By"
        : "Elevated Readings — Stand By"
      : "All Zones Secure";
  const bSub = gAlert
    ? "Critical threshold breached"
    : gWarn
      ? highTemp
        ? `Temperature at ${Math.max(k.dht11.temperature, b.dht11.temperature)}°C — monitor closely`
        : "One or more sensors above threshold"
      : "All sensors nominal across all zones";

  const flameDetected = k.flame.detected || b.flame.detected;
  const flameZone = k.flame.detected
    ? "Kitchen"
    : b.flame.detected
      ? "Bedroom"
      : "";
  const maxGas = Math.max(k.mq2.ppm, b.mq2.ppm);
  const maxTemp = Math.max(k.dht11.temperature, b.dht11.temperature);
  const gasZone =
    k.mq2.ppm >= 700 ? "Kitchen" : b.mq2.ppm >= 700 ? "Bedroom" : "";
  const tempZone =
    k.dht11.temperature >= 40
      ? "Kitchen"
      : b.dht11.temperature >= 40
        ? "Bedroom"
        : "";

  const escapeZone = k.flame.detected ? "bedroom" : "kitchen";

  return (
    <div
      className="dashboard-layout"
      style={{
        background: "#111827",
        color: "#e2e8f0",
        fontFamily: "system-ui,sans-serif",
      }}
    >
      <FireAlert
        flameDetected={flameDetected}
        gasLevel={maxGas}
        temperature={maxTemp}
        flameZone={flameZone}
        gasZone={gasZone}
        tempZone={tempZone}
      />

      <div
        style={{
          background: "#1a2332",
          borderBottom: "2px solid #1e3a52",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 700,
            fontSize: 16,
            color: "#f1f5f9",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: "#dc2626",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🔥
          </div>
          FireGuard OS
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: connected ? "#10b981" : "#6b7280",
                display: "inline-block",
              }}
            />
            <span
              style={{
                color: connected ? "#34d399" : "#9ca3af",
                fontWeight: 600,
              }}
            >
              {connected ? "Connected" : "Offline"}
            </span>
          </span>
          <span style={{ fontFamily: "monospace" }}>{clock}</span>
          <span>2 Zones · 6 Sensors</span>
          <span style={{ fontFamily: "monospace", color: "#374151" }}>
            {uptime}
          </span>
        </div>
      </div>

      <div className="main-grid">
        <div className="left-panel">
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "2px solid " + bBorder,
              background: bBg,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>
                {gAlert ? "🚨" : gWarn ? "⚠️" : "🛡️"}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: bColor,
                    lineHeight: 1.3,
                  }}
                >
                  {bText}
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                  {bSub}
                </div>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#6b7280",
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                Building A<br />
                Node-01
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
            <EscapeRoute
              hasAlert={gAlert}
              hasWarn={gWarn}
              flameZone={flameZone}
              kitchenTemp={k.dht11.temperature}
              kitchenGas={k.mq2.ppm}
              kitchenFlame={k.flame.detected}
              bedroomTemp={b.dht11.temperature}
              bedroomGas={b.mq2.ppm}
              bedroomFlame={b.flame.detected}
              kitchenHum={k.dht11.humidity}
              bedroomHum={b.dht11.humidity}
            />
          </div>
        </div>

        <div className="right-panel">
          <ZonePanel
            zoneName="Kitchen Area"
            icon="🍳"
            dht11={k.dht11}
            mq2={k.mq2}
            flame={k.flame}
          />
          <div style={{ height: 1, background: "#1e3a52" }} />
          <ZonePanel
            zoneName="Bedroom Area"
            icon="🛏️"
            dht11={b.dht11}
            mq2={b.mq2}
            flame={b.flame}
          />
          <div
            style={{
              marginTop: "auto",
              paddingTop: 8,
              borderTop: "1px solid #1e3a52",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 6,
              fontSize: 11,
              color: "#374151",
            }}
          >
            <span>Firmware v2.1.4 · MQTT/JSON · 2s</span>
            <span>© FireGuard Systems</span>
          </div>
        </div>
      </div>
    </div>
  );
};
