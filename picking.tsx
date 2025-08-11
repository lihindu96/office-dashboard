import React, { useEffect, useState } from 'react';

interface PickingData {
  zone: string;
  lines_completed: number;
  total_lines: number;
  timestamp: string;
}

const Picking: React.FC = () => {
  const [data, setData] = useState<PickingData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/picking/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch picking data");
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message));
  }, []);

  const estimateETA = (entry: PickingData): string => {
    const { lines_completed, total_lines } = entry;
    if (lines_completed === 0) return "N/A";

    const progressRatio = lines_completed / total_lines;
    const estimatedMinutes = (1 / progressRatio - 1) * 15; // assuming update every 15 minutes
    return `${Math.ceil(estimatedMinutes)} min remaining`;
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Picking Dashboard</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Zone</th>
            <th>Completed</th>
            <th>Total</th>
            <th>Progress</th>
            <th>Estimated Time Left</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.zone}</td>
              <td>{entry.lines_completed}</td>
              <td>{entry.total_lines}</td>
              <td>{((entry.lines_completed / entry.total_lines) * 100).toFixed(1)}%</td>
              <td>{estimateETA(entry)}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Picking;
