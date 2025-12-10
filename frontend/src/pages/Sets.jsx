/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

// Imports React hooks, routing, HTTP client, and set creation modal component
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CreateSetModal from '../components/CreateSetModal';

// Display Pokemon TCG sets and user custom sets
function Sets({ sets }) {
  const [userSets, setUserSets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserSets();
  }, []);

  // Fetch custom user-created sets from database
  const fetchUserSets = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/sets`);
      const customSets = response.data.filter(set => set.name !== 'Collection');
      setUserSets(customSets);
    } catch (error) {
      console.error('Error fetching user sets:', error);
    }
  };

  // Add newly created set to list
  const handleSetCreated = (newSet) => {
    setUserSets([...userSets, newSet]);
  };

  // Renders the page for sets using html code made for React, handles the Pokemon tcg sets and user created sets/ user creating sets
  return (
    <div className="container mt-5">

      {/* Pokémon Sets Section */}
      <div className="mb-5">
        <h1 className="text-center pixel-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Pokémon Sets</h1>
        <hr style={{ border: 'none', borderTop: '3px solid #000', margin: '1rem 0 2rem 0' }} />

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {sets.map(set => (
            <div key={set.id} style={{ textAlign: 'center', flex: '0 0 18%', minWidth: '150px' }}>
              <Link to={`/sets/${set.id}`} style={{ textDecoration: 'none' }}>
                <img src={set.image} alt={set.name} style={{ maxWidth: '150px', height: '150px', objectFit: 'contain', cursor: 'pointer', marginBottom: '0.5rem' }} />
              </Link>
              <p className="pixel-text" style={{ color: 'rgb(231, 210, 202)', margin: '0.5rem 0' }}>{set.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Sets Section */}
      <div className="mb-5">
        <h2 className="text-center pixel-text" style={{ marginBottom: '1rem' }}>My Sets</h2>
        <hr style={{ border: 'none', borderTop: '3px solid #000', margin: '1rem 0 2rem 0' }} />

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', backgroundColor: '#ee3e41', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            + Add Set
          </button>
        </div>

        {userSets.length > 0 && (
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {userSets.map(set => (
              <Link key={set.id} to={`/sets/${set.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ textAlign: 'center', flex: '0 0 18%', minWidth: '150px' }}>
                  <div style={{
                    width: '150px',
                    height: '150px',
                    backgroundColor: 'white',
                    border: '2px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                  }}>
                    <p className="pixel-text" style={{ color: '#333333', margin: '0', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                      {set.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Modal for creating a new set */}
      <CreateSetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSetCreated={handleSetCreated}
      />
    </div>
  );
}
export default Sets;