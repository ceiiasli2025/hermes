import { useEffect, useRef } from "react";

interface WaveformCanvasProps {
  color: string
  frequency: number
  amplitude: number
  time: number
  waveType: "ecg" | "spo2" | "bp" | "etco2"
  systolic?: number
  diastolic?: number
  speed?: number
}

export default function WaveformCanvas({
  color,
  frequency,
  amplitude,
  time,
  waveType,
  systolic = 120,
  diastolic = 80,
  speed = 1
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.fillStyle = "#151618"
    ctx.fillRect(0, 0, width, height)

    // Draw waveform
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    const samples = width
    for (let i = 0; i < samples; i++) {
      const x = i
      const t = (time + (i / samples) * 10) * frequency
      let y = height / 2

      switch (waveType) {
        case "ecg":
          // ECG waveform with QRS complex
          const ecgPhase = t % 1
          if (ecgPhase < 0.1) {
            y += Math.sin(ecgPhase * Math.PI * 10) * amplitude * height * 0.1
          } else if (ecgPhase < 0.15) {
            y -= Math.sin((ecgPhase - 0.1) * Math.PI * 20) * amplitude * height * 0.3
          } else if (ecgPhase < 0.25) {
            y += Math.sin((ecgPhase - 0.15) * Math.PI * 10) * amplitude * height * 0.8
          } else if (ecgPhase < 0.35) {
            y -= Math.sin((ecgPhase - 0.25) * Math.PI * 10) * amplitude * height * 0.4
          } else if (ecgPhase < 0.55) {
            y += Math.sin((ecgPhase - 0.35) * Math.PI * 5) * amplitude * height * 0.2
          }
          break

        case "spo2":
          // Pulse oximetry waveform
          const pulsePhase = t % 1
          if (pulsePhase < 0.3) {
            y -= Math.sin((pulsePhase * Math.PI) / 0.3) * amplitude * height * 0.4
          } else if (pulsePhase < 0.6) {
            y -= Math.sin(((pulsePhase - 0.3) * Math.PI) / 0.3) * amplitude * height * 0.2
          }
          break

        case "bp":
          // Blood pressure waveform
          const bpPhase = t % 1
          const systolicNorm = (systolic - 80) / 120
          const diastolicNorm = (diastolic - 40) / 80

          if (bpPhase < 0.3) {
            const rise = Math.sin((bpPhase * Math.PI) / 0.3)
            y -= rise * amplitude * height * 0.3 * systolicNorm
          } else if (bpPhase < 0.5) {
            y -= amplitude * height * 0.3 * systolicNorm * Math.exp(-(bpPhase - 0.3) * 10)
          } else {
            y -= amplitude * height * 0.1 * diastolicNorm
          }
          break

        case "etco2":
          // Capnography waveform with smooth rounded transitions
          const co2Phase = t % 1
          if (co2Phase < 0.15) {
            // Smooth curved rise at start of expiration
            const risePhase = co2Phase / 0.15
            // Use a smooth S-curve for gradual rise
            const smoothRise = 0.5 * (1 + Math.tanh(4 * (risePhase - 0.5)))
            y -= amplitude * height * 0.4 * smoothRise
          } else if (co2Phase < 0.65) {
            // Plateau phase (ETCO2 level) - completely flat
            y -= amplitude * height * 0.4
          } else if (co2Phase < 0.8) {
            // Smooth curved drop back to baseline
            const dropPhase = (co2Phase - 0.65) / 0.15
            // Use smooth S-curve for gradual descent
            const smoothDrop = 0.5 * (1 - Math.tanh(4 * (dropPhase - 0.5)))
            y -= amplitude * height * 0.4 * smoothDrop
          }
          // Baseline for the rest of the cycle (inspiration) - stays at center
          break
      }

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Draw scanning line
    const scanX = (time * 50 * speed) % width
    ctx.strokeStyle = '#151618'
    ctx.globalAlpha = 1
    ctx.lineWidth = 24
    ctx.beginPath()
    ctx.moveTo(scanX, 0)
    ctx.lineTo(scanX, height)
    ctx.stroke()
    ctx.globalAlpha = 1
  }, [color, frequency, amplitude, time, waveType, systolic, diastolic])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={120}
      className="w-full h-24 lg:h-32"
      style={{ imageRendering: "pixelated" }}
    />
  )
}