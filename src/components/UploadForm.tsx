import { useState } from 'react';
import { toast } from 'react-toastify';
import { createClient } from '@supabase/supabase-js';

// Inicializa el cliente Supabase
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

export function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Función para manejar el cambio del archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Función para manejar la subida del archivo
  const handleFileUpload = async () => {
    if (!file) {
      toast.error('No File Selected');
      return;
    }

    setIsUploading(true);

    try {
      // Crear una referencia al archivo en Supabase Storage
      const { error } = await supabase.storage
        .from('your-bucket-name') // Nombre de tu bucket
        .upload(`uploads/${file.name}`, file);

      if (error) {
        throw new Error(error.message); // Lanzar el error de forma explícita
      }

      toast.success('File Upload Successful');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message); // Mostrar el mensaje del error
      } else {
        toast.error('An unknown error occurred.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
          Select a file to upload
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleFileUpload}
        disabled={isUploading || !file}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
}
