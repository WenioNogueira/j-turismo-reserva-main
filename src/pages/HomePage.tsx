import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Logo da empresa */}
        <div className="flex justify-center mb-8">
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-primary"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M4 16C4 17.1 4.9 18 6 18H7C8.1 18 9 17.1 9 16V8C9 6.9 8.1 6 7 6H6C4.9 6 4 6.9 4 8V16ZM6 8H7V16H6V8Z" 
              fill="currentColor"
            />
            <path 
              d="M15 16C15 17.1 15.9 18 17 18H18C19.1 18 20 17.1 20 16V8C20 6.9 19.1 6 18 6H17C15.9 6 15 6.9 15 8V16ZM17 8H18V16H17V8Z" 
              fill="currentColor"
            />
            <path 
              d="M2 12H22V14H2V12Z" 
              fill="currentColor"
            />
            <path 
              d="M1 10H23V12H1V10Z" 
              fill="currentColor"
            />
            <circle 
              cx="6" 
              cy="19" 
              r="1.5" 
              fill="currentColor"
            />
            <circle 
              cx="18" 
              cy="19" 
              r="1.5" 
              fill="currentColor"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-primary mb-4">
          J Turismo
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Sistema de Reservas
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/admin" 
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Acessar Painel Administrativo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
