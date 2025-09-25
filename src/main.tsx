import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb', textAlign: 'center' }}>
        J Turismo - Sistema de Reservas
      </h1>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '20px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#f9fafb'
      }}>
        <h2 style={{ color: '#374151', marginBottom: '16px' }}>
          Bem-vindo ao Sistema de Reservas
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Sistema funcionando corretamente! O build está gerando os arquivos JavaScript e CSS.
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Fazer Reserva
          </button>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Login Admin
          </button>
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);