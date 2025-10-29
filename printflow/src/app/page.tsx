'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function DocumentUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    setMessage('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setMessage('Por favor, selecciona un archivo primero.');
      return;
    }
    setMessage('Subiendo...');

    // La lógica de envío con FormData se mantiene igual
    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      // **IMPORTANTE:** Asegúrate de que esta URL sea la ruta de tu API de Next.js
      const response = await fetch('/api/upload', { 
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`¡Éxito! Archivo guardado. Nombre: ${data.fileName}`);
        setSelectedFile(null);
      } else {
        setMessage(`Error al subir: ${data.message || 'Fallo desconocido'}`);
      }
    } catch (error) {
      setMessage('Ocurrió un error inesperado al subir el archivo.');
    }
  };

  const isSubmitting = message === 'Subiendo...';
  const isError = message.startsWith('Error');
  const isSuccess = message.startsWith('¡Éxito');

  return (
    <div className="flex-container">
      <div className="card-container">
        <h1 className="main-title">📄 Subir Documento</h1>
        <p className="subtitle">Formatos aceptados: PDF, Word (.doc, .docx)</p>

        <form onSubmit={handleSubmit} className="form-layout">
          <input
            type="file"
            onChange={handleFileChange}
            required
            accept=".pdf, .doc, .docx" 
            className="file-input"
          />
          
          <button
            type="submit"
            disabled={!selectedFile || isSubmitting}
            // Clases puras basadas en el estado
            className={`submit-button ${!selectedFile || isSubmitting ? 'disabled' : 'active'}`}
          >
            {isSubmitting ? 'Procesando...' : 'Subir Documento'}
          </button>
        </form>

        {(selectedFile || message) && (
          <div className="message-container">
            {selectedFile && (
              <p className="selected-file-info">
                Archivo seleccionado: <strong>{selectedFile.name}</strong>
              </p>
            )}
            {message && (
              <p className={`status-msg ${isError ? 'error' : isSuccess ? 'success' : ''}`}>
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}