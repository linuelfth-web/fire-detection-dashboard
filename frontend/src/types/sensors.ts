export type AlertLevel = 'normal' | 'warning' | 'danger';

export interface DHT11Reading {
  temperature: number;   // °C
  humidity: number;      // %RH
}

export interface MQ2Reading {
  ppm: number;           // gas concentration
  analogVoltage: number; // 0–5V
}

export interface FlameReading {
  detected: boolean;     // digital output HIGH = fire
  irIntensity: number;   // ADC value 0–1023
}

export interface SensorConfig {
  id: string;
  name: string;
  model: string;
  channel: string;
}

export interface Thresholds {
  warning: number;
  danger: number;
  max: number;
  unit: string;
}