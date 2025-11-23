export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // 'mt-auto' es el truco para que si la página es corta, el footer baje al final
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Izquierda: Copyright */}
          <div className="text-sm text-gray-500 text-center md:text-left">
            <p>
              &copy; {currentYear}{" "}
              <span className="font-bold text-gray-700">
                Libro de Novedades
              </span>
              .
            </p>
            <p className="text-xs mt-1">Sistema de gestión interna.</p>
          </div>

          {/* Derecha: Enlaces y Versión */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            {/* Versión del Sistema (Muy útil en apps internas) */}
            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
