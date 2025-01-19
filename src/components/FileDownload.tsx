import { useState } from 'react';
import process from 'process';

const FileDownload = ({ file }: { file: any }) => {
  const [extension, setExtension] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleDownloadClick = () => {
    // Muestra el input para que el usuario ingrese la extensión
    setIsInputVisible(true);
  };

  const handleDownload = () => {
    if (extension) {
      // Genera la URL de descarga con la extensión proporcionada por el usuario
      const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-files/${file.file_url}`;

      // Añadir la extensión proporcionada por el usuario a la URL del archivo
      const downloadUrl = fileUrl.replace(/(\.[^.]+)$/, `.${extension}`);

      // Crear un enlace de descarga y forzar la descarga con el nombre de archivo con la extensión personalizada
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${file.name.split('.')[0]}.${extension}`; // Usar la extensión proporcionada
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Por favor, ingresa una extensión válida.');
    }
  };

  return (
    <div>
      <div className="bg-neutral-700 p-4 rounded-lg">
        <h3 className="text-lg font-semibold">{file.name}</h3>
        <p className="text-sm text-gray-400">{file.description}</p>
        <p className="text-sm text-gray-500">{new Date(file.created_at).toLocaleString()}</p>
        
        <button 
          className="text-blue-500 hover:underline" 
          onClick={handleDownloadClick}
        >
          Descargar archivo
        </button>

        {isInputVisible && (
          <div className="mt-2">
            <label className="block text-gray-400">Ingresa la extensión del archivo</label>
            <input
              type="text"
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              className="w-full p-2 rounded bg-neutral-600 text-gray-100"
              placeholder="ej. pdf, jpg, txt"
            />
            <button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Descargar con extensión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDownload;
