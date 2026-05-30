import React, { useEffect, useState, useRef } from "react";
import { Dashboard } from "./components/Dashboard";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC5Av9riKvhARDNRkUCX4I9XRAaZoX2ZnA",
  authDomain: "fire-detection-8ae6c.firebaseapp.com",
  databaseURL:
    "https://fire-detection-8ae6c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fire-detection-8ae6c",
  storageBucket: "fire-detection-8ae6c.firebasestorage.app",
  messagingSenderId: "354254671247",
  appId: "1:354254671247:web:970de5bc80c9bd2baacffa",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const initialState = {
  kitchen: {
    dht11: { temperature: 0, humidity: 0 },
    mq2: { ppm: 0, analogVoltage: 0 },
    flame: { detected: false, irIntensity: 0 },
  },
  bedroom: {
    dht11: { temperature: 0, humidity: 0 },
    mq2: { ppm: 0, analogVoltage: 0 },
    flame: { detected: false, irIntensity: 0 },
  },
};

const sendTelegramAlert = async (message: string) => {
  const TOKEN = "8946369351:AAF0bhgnH2BvqB0bEcCZzlq2ntqUgGz1Jcc";
  const CHAT_ID = "-5194093202";
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (e) {
    console.error("Telegram alert failed:", e);
  }
};

// Simulation presets
const SIM_KITCHEN = {
  kitchen: {
    dht11: { temperature: 74, humidity: 88 },
    mq2: { ppm: 820, analogVoltage: 4.0 },
    flame: { detected: true, irIntensity: 950 },
  },
  bedroom: initialState.bedroom,
};

const SIM_BEDROOM = {
  kitchen: initialState.kitchen,
  bedroom: {
    dht11: { temperature: 76, humidity: 90 },
    mq2: { ppm: 850, analogVoltage: 4.1 },
    flame: { detected: true, irIntensity: 950 },
  },
};

const SIM_BOTH = {
  kitchen: {
    dht11: { temperature: 74, humidity: 88 },
    mq2: { ppm: 820, analogVoltage: 4.0 },
    flame: { detected: true, irIntensity: 950 },
  },
  bedroom: {
    dht11: { temperature: 76, humidity: 90 },
    mq2: { ppm: 850, analogVoltage: 4.1 },
    flame: { detected: true, irIntensity: 950 },
  },
};

export default function App() {
  const [zones, setZones] = useState(initialState);
  const [connected, setConnected] = useState(false);
  const [simMode, setSimMode] = useState<null | "kitchen" | "bedroom" | "both">(
    null,
  );
  const prevAlert = useRef(false);
  const alertLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [alertLocked, setAlertLocked] = useState(false);

  useEffect(() => {
    const unsub = onValue(
      ref(db, "sensors/latest"),
      (snap) => {
        const d = snap.val();
        if (!d) return;
        setConnected(true);
        const flameDetected = d.flame === 0;
        const gasRaw = d.gas ?? 0;
        const ppm = Math.round((gasRaw / 1023) * 1000);
        const analogVoltage = parseFloat(((gasRaw / 1023) * 5).toFixed(2));
        const irIntensity = flameDetected ? 950 : 95;
        const temperature = d.temperature ?? 0;
        const humidity = d.humidity ?? 0;

        const gasAlert = ppm >= 700;
        const tempAlert = temperature >= 40;
        const anyAlert = flameDetected || gasAlert || tempAlert;

        if (anyAlert && !prevAlert.current) {
          setAlertLocked(true);
          if (alertLockTimer.current) clearTimeout(alertLockTimer.current);
          alertLockTimer.current = setTimeout(
            () => setAlertLocked(false),
            10000,
          );
          const zone = flameDetected
            ? "Kitchen"
            : gasAlert
              ? "Kitchen (Gas)"
              : "Kitchen (Temp)";
          sendTelegramAlert(
            `🚨 <b>FIRE ALERT — FireGuard OS</b>\n\n` +
              `🔥 Alert in <b>${zone}</b>\n` +
              `🌡 Temp: ${temperature}°C\n` +
              `💧 Humidity: ${humidity}%\n` +
              `💨 Gas: ${ppm}ppm\n` +
              `🔥 Flame: ${flameDetected ? "DETECTED" : "None"}\n\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `🗺️ <b>ESCAPE ROUTE MAP:</b>\n` +
              `👉 <a href="https://fire-detection-dashboard-fnjr.vercel.app#alert-${zone.replace(" ", "")}">OPEN DASHBOARD NOW</a>\n` +
              `━━━━━━━━━━━━━━━━━━━━\n\n` +
              `⚠️ <b>EVACUATE IMMEDIATELY!</b>\n` +
              `🚪 Follow the highlighted escape route on the dashboard!`,
          );
        }
        prevAlert.current = anyAlert || alertLocked;

        setZones((prev) => ({
          kitchen: {
            dht11: { temperature, humidity },
            mq2: { ppm, analogVoltage },
            flame: { detected: flameDetected, irIntensity },
          },
          bedroom: prev.bedroom,
        }));
      },
      (err) => {
        console.error("Firebase error:", err);
        setConnected(false);
      },
    );
    return () => unsub();
  }, []);

  const triggerSim = (mode: "kitchen" | "bedroom" | "both") => {
    setSimMode(mode);
    const simZone =
      mode === "kitchen" ? "Kitchen" : mode === "bedroom" ? "Bedroom" : "Both";
    window.location.hash = "#alert-" + simZone;
    sendTelegramAlert(
      `🧪 <b>SIMULATION — FireGuard OS</b>\n\n` +
        `🔥 Simulated fire in <b>${simZone}</b>\n` +
        `🌡 Critical temperature detected\n` +
        `💨 Dangerous gas levels\n` +
        `🔥 Flame sensor triggered\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🗺️ <b>ESCAPE ROUTE MAP:</b>\n` +
        `👉 <a href="https://fire-detection-dashboard-fnjr.vercel.app#alert-${simZone.replace(" ", "")}">OPEN DASHBOARD NOW</a>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `⚠️ <b>EVACUATE IMMEDIATELY!</b>\n` +
        `🚪 Follow the highlighted escape route on the dashboard!`,
    );
    setTimeout(() => setSimMode(null), 15000);
  };

  const simZones =
    simMode === "kitchen"
      ? SIM_KITCHEN
      : simMode === "bedroom"
        ? SIM_BEDROOM
        : simMode === "both"
          ? SIM_BOTH
          : null;

  const baseZones = alertLocked
    ? {
        ...zones,
        kitchen: {
          ...zones.kitchen,
          flame: {
            ...zones.kitchen.flame,
            detected: zones.kitchen.flame.detected || alertLocked,
          },
        },
      }
    : zones;

  const displayZones = simZones ?? baseZones;

  return (
    <Dashboard
      zones={displayZones}
      connected={connected}
      simMode={simMode}
      onSimKitchen={() => triggerSim("kitchen")}
      onSimBedroom={() => triggerSim("bedroom")}
      onSimBoth={() => triggerSim("both")}
      onSimClear={() => setSimMode(null)}
    />
  );
}
