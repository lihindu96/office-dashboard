import React, { useState, useEffect } from 'react';

type Stat = {
  zone: string;
  picked_last_15_min: number;
  speed_lines_per_hour: number;
  remaining: number;
  eta_minutes: number | string;
};

type PickHistory = {
  zone: string;
  lines_picked: number;
  timestamp: number;
};

const PickDisplay: React.FC = () => {
  const [zone, setZone] = useState("A");
  const [stock, setStock] = useState<number>(300);
  const [linesPicked, setLinesPicked] = useState<number>(0);
  const [stats, setStats] = useState<Stat[]>([]);
  const [history, setHistory] = useState<PickHistory[]>([]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/picking/stats");
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch("/picking/history");
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const setZoneStock = async () => {
    await fetch("/picking/set_stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zone, stock }),
    });
    alert(`Stock for Zone ${zone} set to ${stock}`);
    fetchStats();
  };

  const updatePicked = async () => {
    await fetch("/picking/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zone, lines_picked: linesPicked }),
    });
    alert(`Updated Zone ${zone} with ${linesPicked} picked lines`);
    fetchStats();
    fetchHistory();
  };

  useEffect(() => {
    fetchStats();
    fetchHistory();
    const interval = setInterval(() => {
      fetchStats();
      fetchHistory();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pick Admin Panel</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-semibold">Zone:</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="border p-1 w-full"
          >
            <option value="A">Zone A</option>
            <option value="B">Zone B</option>
            <option value="S">Zone S</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Set Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(+e.target.value)}
            className="border p-1 w-full"
          />
          <button
            onClick={setZoneStock}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Set Stock
          </button>
        </div>

        <div>
          <label className="block font-semibold">Lines Picked:</label>
          <input
            type="number"
            value={linesPicked}
            onChange={(e) => setLinesPicked(+e.target.value)}
            className="border p-1 w-full"
          />
          <button
            onClick={updatePicked}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit Picked
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Zone Stats</h2>
      <table className="w-full border border-collapse text-sm mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Zone</th>
            <th className="border p-2">Picked (15m)</th>
            <th className="border p-2">Speed (lines/hour)</th>
            <th className="border p-2">Remaining</th>
            <th className="border p-2">ETA (min)</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, index) => (
            <tr key={index}>
              <td className="border p-2">{row.zone}</td>
              <td className="border p-2">{row.picked_last_15_min}</td>
              <td className="border p-2">{row.speed_lines_per_hour}</td>
              <td className="border p-2">{row.remaining}</td>
              <td className="border p-2">{row.eta_minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Pick History</h2>
      <table className="w-full border border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Zone</th>
            <th className="border p-2">Lines Picked</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr key={index}>
              <td className="border p-2">Zone {entry.zone}</td>
              <td className="border p-2">{entry.lines_picked}</td>
              <td className="border p-2">{formatTimestamp(entry.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PickDisplay;
