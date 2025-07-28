import { useContext } from 'react'
import { FiLogIn, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/logo.svg'
import { AuthContext } from '../../context/auth-context'

export function Header() {
  const { isSigned, loadingAuth } = useContext(AuthContext)

  return (
    <header className='sticky top-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-b-zinc-500 bg-white p-4 shadow'>
      <Link to='/'>
        <img src={logoImg} alt='Logo da DevCarros' />
      </Link>

      {!loadingAuth && isSigned && (
        <Link to='dashboard'>
          <div className='flex size-10 items-center justify-center rounded-full border border-black'>
            <FiUser size={24} color='#000' />
          </div>
        </Link>
      )}

      {!loadingAuth && !isSigned && (
        <Link to='login'>
          <FiLogIn size={24} color='#000' />
        </Link>
      )}
    </header>
  )
}
