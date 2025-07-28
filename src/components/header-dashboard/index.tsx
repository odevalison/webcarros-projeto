import { Link } from 'react-router-dom'
import supabase from '../../services/supabase'
import { FiLogOut } from 'react-icons/fi'

export function HeaderDashboard() {
  const handleLogOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className='bg-red mb-9 flex h-11 w-full items-center gap-6 rounded-lg px-5 font-medium text-white'>
      <Link to='/dashboard'>Dashboard</Link>
      <Link to='/dashboard/new'>Novo carro</Link>

      <button onClick={handleLogOut} className='ml-auto cursor-pointer'>
        <FiLogOut size={20} />
      </button>
    </header>
  )
}
