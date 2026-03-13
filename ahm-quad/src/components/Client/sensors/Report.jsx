import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, LineElement, PointElement,
  LinearScale, CategoryScale, Tooltip, Filler
} from 'chart.js'
import { usePost } from '../../../hooks/usehttp'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)

const avg = arr => arr.reduce((a, b) => a + parseFloat(b), 0) / arr.length
const fmt = (v, d = 2) => parseFloat(v).toFixed(d)
const fmtTime = ts => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

// Dynamic y-axis with padding
const getRange = (arr, pad = 0.1) => {
  const nums = arr.map(parseFloat).filter(n => !isNaN(n))
  const min = Math.min(...nums)
  const max = Math.max(...nums)
  const margin = (max - min) * pad || 1
  return { min: parseFloat((min - margin).toFixed(2)), max: parseFloat((max + margin).toFixed(2)) }
}

const StatCard = ({ label, value, unit }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-xl font-medium text-gray-900">{value}</p>
    <p className="text-xs text-gray-400 mt-0.5">{unit}</p>
  </div>
)

const chartOpts = (min, max) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
  scales: {
    x: { ticks: { autoSkip: true, maxTicksLimit: 8, font: { size: 10 }, color: '#9ca3af' }, grid: { color: '#f3f4f6' } },
    y: { min, max, ticks: { font: { size: 10 }, color: '#9ca3af' }, grid: { color: '#f3f4f6' } }
  },
  elements: { point: { radius: 0, hitRadius: 8 }, line: { borderWidth: 1.5, tension: 0.3 } }
})

const mkDataset = (label, data, color) => ({
  label, data: data.map(parseFloat), borderColor: color, backgroundColor: 'transparent'
})

const Legend = ({ items }) => (
  <div className="flex flex-wrap gap-3 mb-2">
    {items.map(([label, color]) => (
      <span key={label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
        {label}
      </span>
    ))}
  </div>
)

const Report = ({ onClose, sensorId }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { postRequest } = usePost()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await postRequest(`/company/getlatestcsvrows/${sensorId}`)
        setData(response)         // ← response directly, not response.data
      } catch (err) {
        setError('Failed to fetch sensor data.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [sensorId])

  // Support both response shapes: { data: { data: {...} } } or { data: {...} }
  const d = data?.data?.data ?? data?.data ?? null
  const labels = d?.timestamp?.map(fmtTime) ?? []
  const n = labels.length

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl border border-gray-100 w-[92vw] max-w-4xl max-h-[92vh] overflow-y-auto p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Sensor Report — {sensorId}</h2>
            {d && (
              <p className="text-sm text-gray-400 mt-0.5">
                {n} readings · {fmtTime(d.timestamp[0])} – {fmtTime(d.timestamp[n - 1])}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 border border-gray-200 rounded-lg px-4 py-1.5 hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-gray-400">
            <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin" />
            <span className="text-sm">Fetching sensor data...</span>
          </div>
        )}

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {d && (() => {
          const tempRange  = getRange([...d.temperature_one, ...d.temperature_two])
          const vibXRange  = getRange(d.vibration_x)
          const vibYRange  = getRange(d.vibration_y)
          const vibZRange  = getRange(d.vibration_z)
          const vibRange   = {
            min: Math.min(vibXRange.min, vibYRange.min, vibZRange.min),
            max: Math.max(vibXRange.max, vibYRange.max, vibZRange.max)
          }
          const magRange   = getRange([...d.magnetic_flux_x, ...d.magnetic_flux_y, ...d.magnetic_flux_z])
          const micRange   = getRange([...d.microphone_one, ...d.microphone_two])

          return <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2.5">
              <StatCard label="Temp 1 avg"  value={fmt(avg(d.temperature_one), 1)} unit="°C" />
              <StatCard label="Temp 2 avg"  value={fmt(avg(d.temperature_two), 1)} unit="°C" />
              <StatCard label="Vib X avg"   value={fmt(avg(d.vibration_x))}        unit="mm/s" />
              <StatCard label="Vib Y avg"   value={fmt(avg(d.vibration_y))}        unit="mm/s" />
              <StatCard label="Vib Z avg"   value={fmt(avg(d.vibration_z))}        unit="mm/s" />
              <StatCard label="Mic 1 avg"   value={fmt(avg(d.microphone_one), 1)}  unit="dB" />
              <StatCard label="Mic 2 avg"   value={fmt(avg(d.microphone_two), 1)}  unit="dB" />
              <StatCard label="Data points" value={n}                              unit="records" />
            </div>

            <hr className="border-gray-100" />

            {/* Temperature */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Temperature</p>
              <Legend items={[['Sensor 1', '#378ADD'], ['Sensor 2', '#D85A30']]} />
              <div className="h-52">
                <Line
                  data={{ labels, datasets: [mkDataset('Temp 1', d.temperature_one, '#378ADD'), mkDataset('Temp 2', d.temperature_two, '#D85A30')] }}
                  options={chartOpts(tempRange.min, tempRange.max)}
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Vibration */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Vibration</p>
              <Legend items={[['X-axis', '#378ADD'], ['Y-axis', '#1D9E75'], ['Z-axis', '#D85A30']]} />
              <div className="h-52">
                <Line
                  data={{ labels, datasets: [mkDataset('X', d.vibration_x, '#378ADD'), mkDataset('Y', d.vibration_y, '#1D9E75'), mkDataset('Z', d.vibration_z, '#D85A30')] }}
                  options={chartOpts(vibRange.min, vibRange.max)}
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Magnetic flux + Microphone */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Magnetic flux</p>
                <Legend items={[['X', '#378ADD'], ['Y', '#1D9E75'], ['Z', '#D85A30']]} />
                <div className="h-48">
                  <Line
                    data={{ labels, datasets: [mkDataset('X', d.magnetic_flux_x, '#378ADD'), mkDataset('Y', d.magnetic_flux_y, '#1D9E75'), mkDataset('Z', d.magnetic_flux_z, '#D85A30')] }}
                    options={chartOpts(magRange.min, magRange.max)}
                  />
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-2">Microphone</p>
                <Legend items={[['Mic 1', '#7F77DD'], ['Mic 2', '#BA7517']]} />
                <div className="h-48">
                  <Line
                    data={{ labels, datasets: [mkDataset('Mic 1', d.microphone_one, '#7F77DD'), mkDataset('Mic 2', d.microphone_two, '#BA7517')] }}
                    options={chartOpts(micRange.min, micRange.max)}
                  />
                </div>
              </div>
            </div>
          </>
        })()}

      </div>
    </div>
  )
}

export default Report