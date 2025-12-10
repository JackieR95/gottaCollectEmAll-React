/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

// Imports React state hook and HTTP client
import { useState } from 'react';
import axios from 'axios';

// Modal to create new custom Pokemon sets
function CreateSetModal({ isOpen, onClose, onSetCreated }) {
  //
  const [setName, setSetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create new set and add to database
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!setName.trim()) {
      setError('Set name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/sets`, {
        name: setName,
        setId: 'custom',
      });

      onSetCreated(response.data);
      setSetName('');
      onClose();
    } catch (err) {
      setError('Error creating set: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Close modal and reset state
  const handleClose = () => {
    setSetName('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;


  // Modal overlay and form for creating a new set
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minWidth: '300px',
        border: '3px solid #2c2c2c',
      }}>
        <h2 className="pixel-text" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Create New Set
        </h2>

        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="setName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Set Name
            </label>
            <input
              type="text"
              id="setName"
              value={setName}
              onChange={(e) => setSetName(e.target.value)}
              placeholder="Enter set name..."
              style={{
                width: '100%',
                padding: '0.5rem',
                fontSize: '1rem',
                border: '2px solid #2c2c2c',
                boxSizing: 'border-box',
              }}
              autoFocus
            />
          </div>

          {error && (
            <div style={{ color: '#d32f2f', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: 'pointer',
                backgroundColor: '#f0f0f0',
                border: '2px solid #2c2c2c',
                borderRadius: '4px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                backgroundColor: loading ? '#ccc' : '#ee3e41',
                color: 'white',
                border: '2px solid #2c2c2c',
                borderRadius: '4px',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSetModal;
