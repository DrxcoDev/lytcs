import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
// import styled from 'styled-components';
import ButtonAdd from '@/components/ButtonAdd';
import process from 'process';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'settings' | 'login') => void;
}

const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [user, setUser] = useState<any>(null);
  // const [isVisible, setIsVisible] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  

  // Form data
  const [fileName, setFileName] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Estado para los archivos
  const [files, setFiles] = useState<any[]>([]);
  const [fileExtension, setFileExtension] = useState('');  // Nuevo estado para la extensión

  // function welcome() {
  //   setIsVisible(false);
  // }

  useEffect(() => {
    const getUser = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      if (session?.session?.user) {
        setUser(session.session.user); // Corregido para acceder correctamente a 'user'
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      // @ts-ignore
      if (listener && listener.subscription && typeof listener.subscription.unsubscribe === 'function') {
        listener.subscription.unsubscribe(); // Corregido para acceder correctamente a 'unsubscribe'
      }
    };
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('user_id', user.id); // Filtra por el ID del usuario

        if (error) {
          console.error('Error fetching files:', error);
          return;
        }
        setFiles(data || []);
      }
    };

    fetchFiles(); // Llamada correcta a fetchFiles
  }, [user]); // Se vuelve a ejecutar cuando el usuario cambia

  const handleFileUpload = async () => {
    if (!file || !fileName || !fileDescription) {
      alert('Por favor, completa todos los campos y selecciona un archivo.');
      return;
    }

    // Validaciones adicionales
    const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf']; // Tipos permitidos
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Solo se permiten imágenes (PNG/JPEG) y PDFs.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // Máximo 5MB
      alert('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
      return;
    }

    try {
      setIsUploading(true);

      const filePath = `files/${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('user-files')
        .upload(filePath, file);

      if (storageError) {
        console.error('Error uploading file:', storageError);
        alert('Hubo un problema al subir el archivo.');
        setIsUploading(false);
        return;
      }

      const { error: dbError } = await supabase.from('files').insert([{
        name: fileName,
        description: fileDescription,
        file_url: storageData?.path || '',
        user_id: user.id // Asocia el archivo con el usuario
      }]);

      if (dbError) {
        console.error('Error saving to database:', dbError);
        alert('Hubo un problema al guardar los datos.');
        setIsUploading(false);
        return;
      }

      alert('Archivo subido exitosamente.');
      setFileName('');
      setFileDescription('');
      setFile(null);
      setShowForm(false);

      // Llamamos a fetchFiles después de cargar un archivo
      const { data, error } = await supabase.from('files').select('*').eq('user_id', user.id);
      if (error) {
        console.error('Error fetching files:', error);
        return;
      }
      setFiles(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Hubo un error inesperado.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const extension = fileExtension ? `.${fileExtension}` : '';  // Si hay extensión, la añadimos
    const downloadUrl = fileUrl + extension;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName + extension;  // Nombre del archivo con la extensión añadida
    link.click();
  };

  return (
    <div className="flex bg-neutral-700 w-screen min-h-screen">
      <NavigationMenu onNavigate={onNavigate} user={user} />
      <div className="p-6 flex-grow text-gray-100 bg-neutral-800 m-2 rounded-lg sm:px-auto">
        <h1 className="text-2xl font-bold">
          Welcome {user?.user_metadata?.full_name || 'User'}
        </h1>

        {/* {isVisible && (
          <StyledWrapper className="mt-5" onClick={welcome}>
            <div className="notification">
              <div className="notiglow" />
              <div className="notiborderglow" />
              <div className="notititle">Welcome To Lytcs</div>
            </div>
          </StyledWrapper>
        )} */}

        <div className="pt-5">
          <ButtonAdd onClick={() => setShowForm(true)} />
        </div>

        {showForm && (
          <div className="mt-5 bg-neutral-700 p-4 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Subir Archivo</h2>
            <div className="mb-4">
              <label className="block mb-2">Nombre del archivo</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2 rounded bg-neutral-600 text-gray-100"
                placeholder="Introduce el nombre del archivo"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Descripción</label>
              <textarea
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                className="w-full p-2 rounded bg-neutral-600 text-gray-100"
                placeholder="Introduce la descripción del archivo"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Archivo</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 rounded bg-neutral-600 text-gray-100"
              />
            </div>
            <button
              onClick={handleFileUpload}
              disabled={isUploading || !(file && fileName && fileDescription)}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isUploading || !(file && fileName && fileDescription) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Subiendo...' : 'Subir'}
            </button>
            {/* Botón para cerrar el formulario */}
            <button
              onClick={() => setShowForm(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mx-5"
            >
              x
            </button>
          </div>
        )}


        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Archivos Subidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.length > 0 ? (
              files.map((file: any) => {
                // Aquí generamos la URL pública del archivo almacenado
                const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/user-files/${file.file_url}`;
                
                return (
                  <div key={file.id} className="bg-neutral-700 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">{file.name}</h3>
                    <p className="text-sm text-gray-400">{file.description}</p>
                    <p className="text-sm text-gray-500">{new Date(file.created_at).toLocaleString()}</p>
                    <div className="mb-2">
                      <label className="block mb-2">Extensión (opcional)</label>
                      <input
                        type="text"
                        value={fileExtension}
                        onChange={(e) => setFileExtension(e.target.value)}
                        className="w-full p-2 rounded bg-neutral-600 text-gray-100"
                        placeholder="Introduce la extensión"
                      />
                    </div>
                    <button
                      onClick={() => handleDownload(fileUrl, file.name)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Descargar
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No has subido archivos aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// const StyledWrapper = styled.div`
//   .notification {
//     background: var(--primary-background);
//     color: white;
//     border-radius: 8px;
//     padding: 16px;
//     font-size: 14px;
//     display: flex;
//     justify-content: space-between;
//     cursor: pointer;
//   }

//   .notiglow {
//     position: absolute;
//     z-index: -1;
//     background: linear-gradient(120deg, #ffafbd, #ffc3a0);
//     width: 100%;
//     height: 100%;
//     border-radius: 8px;
//     animation: glow 2s linear infinite;
//   }

//   .notiborderglow {
//     position: absolute;
//     z-index: -2;
//     background: #ffafbd;
//     width: 100%;
//     height: 100%;
//     border-radius: 8px;
    
//   }

//   .notititle {
//     font-weight: bold;
//   }

  
  
// `;
