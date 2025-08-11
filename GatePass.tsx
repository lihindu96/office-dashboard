import React, { useState } from 'react';

interface GatePassData {
  supplier_name: string;
  po_number: string;
  driver_name: string;
  lorry_number: string;
  item_quantity: number;
  bay_number: string;
  arrival_time: string;
  departure_time?: string;
  security_signature?: string;
  receiver_signature?: string;
}

const GatePass: React.FC = () => {
  const [form, setForm] = useState<GatePassData>({
    supplier_name: '',
    po_number: '',
    driver_name: '',
    lorry_number: '',
    item_quantity: 0,
    bay_number: '',
    arrival_time: new Date().toISOString().slice(0, 16), // current date/time
    departure_time: '',
    security_signature: '',
    receiver_signature: '',
  });

  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'item_quantity' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setResponse(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/gatepass/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Unknown error');
      }
      const data = await res.json();
      setResponse(`Success! Gate Pass ID: ${data.id}`);
      setForm({
        supplier_name: '',
        po_number: '',
        driver_name: '',
        lorry_number: '',
        item_quantity: 0,
        bay_number: '',
        arrival_time: new Date().toISOString().slice(0, 16),
        departure_time: '',
        security_signature: '',
        receiver_signature: '',
      });
    } catch (e: any) {
      setError(`Error submitting gate pass: ${e.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h2>Gate Pass Form</h2>
      <form>
        {[
          ['Supplier Name', 'supplier_name'],
          ['PO Number', 'po_number'],
          ['Driver Name', 'driver_name'],
          ['Lorry Number', 'lorry_number'],
          ['Bay Number', 'bay_number'],
          ['Security Signature', 'security_signature'],
          ['Receiver Signature', 'receiver_signature'],
        ].map(([label, name]) => (
          <div key={name}>
            <label>{label}:</label>
            <input type="text" name={name} value={(form as any)[name]} onChange={handleChange} />
          </div>
        ))}

        <div>
          <label>Item Quantity:</label>
          <input
            type="number"
            name="item_quantity"
            value={form.item_quantity}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Arrival Time:</label>
          <input
            type="datetime-local"
            name="arrival_time"
            value={form.arrival_time}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Departure Time:</label>
          <input
            type="datetime-local"
            name="departure_time"
            value={form.departure_time}
            onChange={handleChange}
          />
        </div>

        <button type="button" onClick={handleSubmit} style={{ marginTop: '10px' }}>
          Submit Gate Pass
        </button>
      </form>

      {response && <p style={{ color: 'green' }}>{response}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default GatePass;
