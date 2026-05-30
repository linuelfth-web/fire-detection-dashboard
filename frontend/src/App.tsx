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
  const TOKEN = "8946369351:AAHO2FJctf-okZni8jxq5hXgaRAIy7dwvls";
  const CHAT_ID = "6989652888";
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

export default function App() {
  const [zones, setZones] = useState(initialState);
  const [connected, setConnected] = useState(false);
  const prevAlert = useRef(false);

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

        // ── Telegram alert ──
        const gasAlert = ppm >= 700;
        const tempAlert = temperature >= 40;
        const anyAlert = flameDetected || gasAlert || tempAlert;

        if (anyAlert && !prevAlert.current) {
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
              `👉 <a href="https://fire-detection-dashboard-fnjr.vercel.app">OPEN DASHBOARD NOW</a>\n` +
              `━━━━━━━━━━━━━━━━━━━━\n\n` +
              `⚠️ <b>EVACUATE IMMEDIATELY!</b>\n` +
              `🚪 Follow the highlighted escape route on the dashboard!`,
          );
        }
        prevAlert.current = anyAlert;

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

  return <Dashboard zones={zones} connected={connected} />;
}
