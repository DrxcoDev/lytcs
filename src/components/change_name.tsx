import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ChangeFullName: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFullNameChange = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Obtener la sesión actual
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session.session) {
        throw new Error("No estás autenticado.");
      }

      const userId = session.session.user.id;

      // Actualizar el campo full_name
      const { error } = await supabase
        .from("profiles") // Asegúrate de que tu tabla se llama 'profiles'
        .update({ full_name: fullName })
        .eq("id", userId);

      if (error) {
        throw new Error(error.message);
      }

      setMessage("¡Nombre actualizado exitosamente!");
    } catch (error: any) {
      setMessage(error.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Cambiar Nombre Completo</h2>
      <input
        type="text"
        placeholder="Nuevo nombre completo"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <button onClick={handleFullNameChange} disabled={loading || !fullName}>
        {loading ? "Cambiando..." : "Cambiar Nombre"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangeFullName;
