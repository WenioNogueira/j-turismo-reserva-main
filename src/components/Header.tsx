import { Link, useLocation } from 'react-router-dom'
import { Bus, Home, Calendar, Settings } from 'lucide-react'

const Header = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/reservas', label: 'Reservas', icon: Calendar },
    { path: '/admin', label: 'Admin', icon: Settings },
  ]

  return (
    <header className="gradient-header shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bus className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">J Turismo</h1>
          </div>
          
          <nav className="flex space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === path
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
