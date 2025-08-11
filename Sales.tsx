import React, { useEffect, useState } from 'react';
import '../App.css'; // Assuming you have some basic CSS

interface BackendMessage {
  message: string;
}

interface SaleData {
  item: string;
  quantity: number;
  price: number;
  // Add other fields relevant to your sales data
}

interface CreatedSaleResponse {
  id: string;
  status: string;
  data: SaleData;
}

function Sales() {
  const [backendMessage, setBackendMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newSaleItem, setNewSaleItem] = useState('');
  const [newSaleQuantity, setNewSaleQuantity] = useState(1);
  const [newSalePrice, setNewSalePrice] = useState(0.0);
  const [createdSaleResponse, setCreatedSaleResponse] = useState<CreatedSaleResponse | null>(null);

  // --- Fetch initial message from backend ---
  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: BackendMessage) => {
        setBackendMessage(data.message);
      })
      .catch(e => {
        console.error("Failed to fetch from backend:", e);
        setError(`Failed to fetch: ${e.message}`);
      });
  }, []);

  // --- Handle creating a new sale ---
  const handleCreateSale = async () => {
    setError(null);
    setCreatedSaleResponse(null);

    const saleData: SaleData = {
      item: newSaleItem,
      quantity: newSaleQuantity,
      price: newSalePrice,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/sales/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Detail: ${errorData.detail}`);
      }

      const data: CreatedSaleResponse = await response.json();
      setCreatedSaleResponse(data);
      // Clear form fields
      setNewSaleItem('');
      setNewSaleQuantity(1);
      setNewSalePrice(0.0);

    } catch (e: any) {
      console.error("Failed to create sale:", e);
      setError(`Failed to create sale: ${e.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>POS System Frontend</h1>

        {/* Backend Status */}
        <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2>Backend Status</h2>
          {backendMessage ? (
            <p>Message from Backend: <strong>{backendMessage}</strong></p>
          ) : (
            <p>Loading message from backend...</p>
          )}
          {error && (
            <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>
          )}
        </div>

        {/* Create Sale Form */}
        <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2>Create New Sale</h2>
          <div>
            <label>
              Item:
              <input
                type="text"
                value={newSaleItem}
                onChange={(e) => setNewSaleItem(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Quantity:
              <input
                type="number"
                value={isNaN(newSaleQuantity) ? '' : newSaleQuantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setNewSaleQuantity(isNaN(val) ? 0 : val);
                }}
              />

            </label>
          </div>
          <div>
            <label>
              Price:
              <input
                type="number"
                step="0.01"
                value={isNaN(newSalePrice) ? '' : newSalePrice}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setNewSalePrice(isNaN(val) ? 0 : val);
                }}
              />


            </label>
          </div>
          <button onClick={handleCreateSale} style={{ marginTop: '10px' }}>
            Submit Sale
          </button>

          {createdSaleResponse && (
            <div style={{ marginTop: '15px', color: 'green' }}>
              <p>Sale Created Successfully!</p>
              <p>ID: {createdSaleResponse.id}</p>
              <p>Status: {createdSaleResponse.status}</p>
              <p>Data: {JSON.stringify(createdSaleResponse.data)}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Sales;