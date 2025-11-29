import { useEffect, useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { UserRow } from "../components/admin/UserRow";
import type { IDeleteUser } from "../types/user.interfaces";
import toast from "react-hot-toast";
import { TextInputModal } from "../components/layout/TextInputModal";
import { Link } from "react-router-dom";

const AdminUserPage = () => {
  const { traerUsuarios, loading, usuarios, borrarUsuario } = useUsers();
  const [textInputModal, setTextInputModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    traerUsuarios();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Cargando usuarios...</div>;
  }
  // funcion de borrar usuario
  const handleDeleteUser = async (id: string) => {
    setUserToDelete(id);
    setTextInputModal(true);
  };

  const handleConfirmDelete = async (textoMotivo: string) => {
    if (!textoMotivo.trim()) {
      toast.error("Debes ingresar un motivo");
      return;
    }

    const reqEliminado: IDeleteUser = {
      id_usuario: userToDelete!,
      motivo: textoMotivo,
    };

    await borrarUsuario(reqEliminado);
    traerUsuarios();
    setUserToDelete(null);
    setTextInputModal(false);
  };

  const handleEditUser = (id: string) => {
    console.log("Navegar a editar:", id);
    // proximo manejo a editar
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Usuarios Registrados
        </h1>
        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          to="/admin/registrar-usuario"
        >
          + Nuevo Usuario
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre Completo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              {/* Nueva cabecera Estado */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteUser}
                  onEdit={handleEditUser}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <TextInputModal
        open={textInputModal}
        title="Eliminar usuario"
        message="Ingrese motivo para eliminar usuario"
        placeholder="Motivo..."
        onCancel={() => {
          setUserToDelete(null);
          setTextInputModal(false);
        }}
        onConfirm={handleConfirmDelete}
      />
      ;
    </>
  );
};

export default AdminUserPage;
