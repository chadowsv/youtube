import { AiOutlineMenu } from "react-icons/ai"
import { FaYoutube } from "react-icons/fa"
import { FaMagnifyingGlass } from "react-icons/fa6"
import { GrMicrophone } from "react-icons/gr"
import { IoAdd } from "react-icons/io5"
import { GoBell } from "react-icons/go"

const DEFAULT_PHOTO = 'https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/perfil/Wi3.jpg'

export default function Header({
  usuario, onLogin, onPerfil, onCrear, onHome, busqueda, onBusqueda
}) {
  return (
    <header className="flex justify-between items-center w-full h-[40px] mb-4">

      <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
        <button className="text-white p-2 rounded-full flex justify-center items-center w-[40px] h-[40px] hover:bg-mist-800">
          <AiOutlineMenu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1">
          <FaYoutube className="text-red-600 h-8 w-8" />
          <h3 className="text-white font-bold">YouTube</h3>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex items-center border border-mist-800 rounded-full overflow-hidden w-[500px] bg-mist-950">
          <input
            type="text"
            value={busqueda}
            onChange={e => onBusqueda(e.target.value)}
            placeholder="Buscar"
            className="flex-1 px-4 py-2 bg-transparent text-white focus:outline-none"
          />
          <button className="px-5 py-3 bg-mist-900 cursor-pointer">
            <FaMagnifyingGlass className="text-white h-4 w-4" />
          </button>
        </div>
        <button className="text-white bg-mist-900 w-[40px] h-[40px] flex items-center justify-center rounded-full hover:bg-mist-800 cursor-pointer">
          <GrMicrophone className="text-white h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-5 items-center">
        {usuario && (
          <div onClick={onCrear}
            className="flex items-center gap-2 border border-mist-800 rounded-full overflow-hidden px-3 py-2 bg-mist-950 cursor-pointer hover:bg-mist-900">
            <IoAdd className="h-5 w-5 text-white" />
            <h3 className="text-white font-medium text-sm pb-0.5">Crear</h3>
          </div>
        )}

        <button className="text-white p-2 rounded-full justify-center items-center w-[40px] h-[40px] hover:bg-mist-800 cursor-pointer">
          <GoBell className="w-5 h-5" />
        </button>

        {usuario ? (
          <button onClick={onPerfil}
            className="w-[40px] h-[40px] rounded-full overflow-hidden hover:opacity-80 cursor-pointer flex-shrink-0">
            <img
              src={usuario?.profile_picture_url || DEFAULT_PHOTO}
              alt={usuario?.username}
              className="w-full h-full object-cover"
            />
          </button>
        ) : (
          <button onClick={onLogin}
            className="border border-blue-500 text-blue-400 text-sm px-4 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
            Entrar
          </button>
        )}
      </div>
    </header>
  )
}