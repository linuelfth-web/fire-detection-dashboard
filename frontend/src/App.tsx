import React, { useEffect, useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'

const firebaseConfig = {
  apiKey:            'AIzaSyC5Av9riKvhARDNRkUCX4I9XRAaZoX2ZnA',
  authDomain:        'fire-detection-8ae6c.firebaseapp.com',
  databaseURL:       'https://fire-detection-8ae6c-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId:         'fire-detection-8ae6c',
  storageBucket:     'fire-detection-8ae6c.firebasestorage.app',
  messagingSenderId: '354254671247',
  appId:             '1:354254671247:web:970de5bc80c9bd2baacffa',
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getDatabase(firebaseApp)

const initialState = {
  kitchen: {
    dht11: { temperature: 0, humidity: 0 },
    mq2:   { ppm: 0, analogVoltage: 0 },
    flame: { detected: false, irIntensity: 0 },
  },
  bedroom: {
    dht11: { temperature: 0, humidity: 0 },
    mq2:   { ppm: 0, analogVoltage: 0 },
    flame: { detected: false, irIntensity: 0 },
  },
}

export default function App() {
  const [zones, setZones]         = useState(initialState)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const unsub = onValue(ref(db, 'sensors/latest'), (snap) => {
      const d = snap.val()
      if (!d) return

      setConnected(true)

      const flameDetected = d.flame === 0           // LOW = fire
      const gasRaw        = d.gas ?? 0
      const ppm           = Math.round((gasRaw / 1023) * 1000)
      const analogVoltage = parseFloat(((gasRaw / 1023) * 5).toFixed(2))
      const irIntensity   = flameDetected ? 950 : 95

      setZones(prev => ({
        kitchen: {
          dht11: {
            temperature: d.temperature ?? prev.kitchen.dht11.temperature,
            humidity:    d.humidity    ?? prev.kitchen.dht11.humidity,
          },
          mq2:   { ppm, analogVoltage },
          flame: { detected: flameDetected, irIntensity },
        },
        bedroom: prev.bedroom,
      }))
    }, (err) => {
      console.error('Firebase error:', err)
      setConnected(false)
    })

    return () => unsub()
  }, [])

  return <Dashboard zones={zones} connected={connected} />
}
