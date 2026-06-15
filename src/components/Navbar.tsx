import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Scissors, Menu, X, User, LogOut, Calendar, Clock, DollarSign, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  navigate: (to: string, params?: Record<string, string>) => void;
  goBack?: () => void;
}

export default function Navbar({ navigate, goBack }: NavbarProps) {
  const { user, perfil, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const isAdmin = perfil?.tipo_usuario === 'admin';
  const isBarbeiro = perfil?.tipo_usuario === 'barbeiro';

  function handleNav(page: string) {
    navigate(page);
    setMenuOpen(false);
  }

  async function handleLogout() {
    await logout();
    navigate('index');
    setMenuOpen(false);
  }

  function toggleTheme() {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  }

  const linkCliente = (
    <>
      <button className="nav-link" onClick={() => handleNav('servicos')}>Serviços</button>
      <button className="nav-link" onClick={() => handleNav('agendar')}>Agendar</button>
      <button className="nav-link" onClick={() => handleNav('historico')}>Meus Agendamentos</button>
      <button className="nav-link" onClick={() => handleNav('perfil')}>Perfil</button>
    </>
  );

  const linkBarbeiro = (
    <>
      <button className="nav-link" onClick={() => handleNav('barbeiro-dashboard')}>Meus Agendamentos</button>
      <button className="nav-link" onClick={() => handleNav('servicos')}>Serviços</button>
      <button className="nav-link" onClick={() => handleNav('perfil')}>Perfil</button>
    </>
  );

  const linkAdmin = (
    <>
      <button className="nav-link" onClick={() => handleNav('dashboard')}>Dashboard</button>
      <button className="nav-link" onClick={() => handleNav('servicos')}>Serviços</button>
      <button className="nav-link" onClick={() => handleNav('admin-agendamentos')}>Agendamentos</button>
      <button className="nav-link" onClick={() => handleNav('admin-barbeiros')}>Barbeiros</button>
      <button className="nav-link" onClick={() => handleNav('perfil')}>Perfil</button>
    </>
  );

  const linkPublico = (
    <>
      <button className="nav-link" onClick={() => handleNav('servicos')}>Serviços</button>
    </>
  );

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {goBack && (
              <button 
                className="btn btn-icon btn-secondary" 
                onClick={goBack}
                aria-label="Voltar"
                style={{ marginRight: '4px' }}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button className="navbar-brand" onClick={() => handleNav('index')}>
              <Scissors className="brand-icon" size={24} />
              BarberSync
            </button>
          </div>

          <div className="navbar-links">
            {!user && linkPublico}
            {user && isAdmin && linkAdmin}
            {user && isBarbeiro && linkBarbeiro}
            {user && !isAdmin && !isBarbeiro && linkCliente}

            {user ? (
              <>
                <div className="navbar-user">
                  <span>{perfil?.nome_usuario?.split(' ')[0] || 'Usuário'}</span>
                  <span className="user-badge">{isAdmin ? 'Admin' : isBarbeiro ? 'Barbeiro' : 'Cliente'}</span>
                </div>
                <button 
                  className="nav-link btn-icon" 
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? 'Modo claro' : 'Modo escuro'}
                  title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="nav-link btn-outline" onClick={handleLogout}>Sair</button>
              </>
            ) : (
              <>
                <button 
                  className="nav-link btn-icon" 
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? 'Modo claro' : 'Modo escuro'}
                  title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button className="nav-link btn-outline" onClick={() => handleNav('auth')}>Entrar</button>
              </>
            )}
          </div>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Menu</span>
          <button 
            className="btn btn-icon btn-secondary" 
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Modo claro' : 'Modo escuro'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        {!user && (
          <>
            <button className="nav-link" onClick={() => handleNav('servicos')}>Serviços</button>
            <button className="nav-link" onClick={() => handleNav('auth')}>Entrar / Cadastrar</button>
          </>
        )}
        {user && isAdmin && (
          <>
            <button className="nav-link" onClick={() => handleNav('dashboard')}>Dashboard</button>
            <button className="nav-link" onClick={() => handleNav('servicos')}>Serviços</button>
            <button className="nav-link" onClick={() => handleNav('admin-agendamentos')}>Agendamentos</button>
            <button className="nav-link" onClick={() => handleNav('admin-barbeiros')}>Barbeiros</button>
            <button className="nav-link" onClick={() => handleNav('perfil')}>Perfil</button>
          </>
        )}
        {user && !isAdmin && (
          <>
            <button className="nav-link" onClick={() => handleNav('servicos')}>Serviços</button>
            <button className="nav-link" onClick={() => handleNav('agendar')}>Agendar</button>
            <button className="nav-link" onClick={() => handleNav('historico')}>Meus Agendamentos</button>
            <button className="nav-link" onClick={() => handleNav('perfil')}>Perfil</button>
          </>
        )}
        {user && (
          <div className="navbar-user" style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', marginTop: 8 }}>
            <User size={16} style={{ marginRight: '8px' }} />
            <span>{perfil?.nome_usuario || 'Usuário'}</span>
            <span className="user-badge">{isAdmin ? 'Admin' : 'Cliente'}</span>
          </div>
        )}
        {user && (
          <button className="nav-link btn-outline" onClick={handleLogout} style={{ margin: '12px 16px' }}>
            <LogOut size={16} style={{ marginRight: '8px' }} />
            Sair
          </button>
        )}
      </div>
    </>
  );
}
