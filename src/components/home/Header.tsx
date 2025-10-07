"use client";


export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CE</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Clube Esportivo</h1>
            <p className="text-sm text-gray-600">Sistema de Gestão</p>
          </div>
        </div>

        {/* Avatar do perfil (opcional) */}
        {/* <Link href="/perfil" className="rounded-full border-2 border-gray-200">
          <span className="block h-10 w-10 rounded-full bg-gray-100 text-gray-700 grid place-items-center">U</span>
        </Link> */}
      </div>
    </header>
  );
}
