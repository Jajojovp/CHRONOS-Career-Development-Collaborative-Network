import { useState } from 'react';
import { Sparkles, MessageSquare, Compass, Coins, Zap, HelpCircle } from 'lucide-react';
import AuraAgent from './components/AuraAgent';
import SocialFeed from './components/SocialFeed';
import type { Post } from './components/SocialFeed';
import TaskBoard from './components/TaskBoard';
import CryptoWallet from './components/CryptoWallet';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'in' | 'out';
  timestamp: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'agent' | 'feed' | 'tasks' | 'wallet'>('agent');
  
  // App-wide Shared States
  const [credits, setCredits] = useState<number>(5);
  const [walletBalance, setWalletBalance] = useState<number>(150);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_init',
      title: 'Creación de Cuenta & Wallet',
      amount: 100,
      type: 'in',
      timestamp: 'Hace 2 horas'
    },
    {
      id: 'tx_onboard',
      title: 'Recompensa Onboarding Inicial',
      amount: 50,
      type: 'in',
      timestamp: 'Hace 1 hora'
    }
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'seed_post_1',
      author: {
        name: 'Sofía Romero',
        handle: '@sofia_dev',
        avatar: 'S'
      },
      content: '⚡ ¡Alineando la estrategia de APIs con Rust para soportar 10k RPS. El diseño modular y modularizar la lógica nos salvó de tener que reescribir la base de datos completa!',
      timestamp: 'Hace 45 min',
      likes: 124,
      reposts: 18,
      comments: 12,
      achievement: {
        title: 'Hito #2 Completado',
        desc: 'Diseño del MVP - Arquitectura Monolítica Modular',
        tokens: 50
      }
    },
    {
      id: 'seed_post_2',
      author: {
        name: 'Marcos Pérez',
        handle: '@marcos_product',
        avatar: 'M'
      },
      content: 'Ayer lanzamos la beta pública de nuestro SaaS en Product Hunt. Compartir los primeros 100 usuarios en mi feed me trajo un feedback brutal. ¡A seguir construyendo en público! 🚀 #BuildInPublic',
      timestamp: 'Hace 2 horas',
      likes: 89,
      reposts: 9,
      comments: 7
    },
    {
      id: 'seed_post_3',
      author: {
        name: 'Nora Crypto',
        handle: '@cryptonora',
        avatar: 'N'
      },
      content: 'Analizando la liquidez de tokens para el módulo de micro-pagos en Solana. El modelo colaborativo de créditos regenerables de DevLingo es un caso de uso espectacular para incentivos profesionales.',
      timestamp: 'Hace 4 horas',
      likes: 215,
      reposts: 42,
      comments: 31,
      achievement: {
        title: 'Hito #5 Completado',
        desc: 'Escalamiento e Integración Web3',
        tokens: 50
      }
    }
  ]);

  const addTransaction = (title: string, amount: number, type: 'in' | 'out') => {
    const newTx: Transaction = {
      id: Math.random().toString(),
      title,
      amount,
      type,
      timestamp: 'Hace unos instantes'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const addPost = (content: string, achievement?: { title: string; desc: string; tokens: number }) => {
    const newPost: Post = {
      id: Math.random().toString(),
      author: {
        name: 'Tú (Profesional)',
        handle: '@tu_usuario',
        avatar: 'T'
      },
      content,
      timestamp: 'Ahora mismo',
      likes: 0,
      reposts: 0,
      comments: 0,
      achievement
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const handleBuyCreditFromWidget = () => {
    if (walletBalance < 10) {
      alert('❌ Balance de $TALENT insuficiente. Comprar 1 crédito cuesta 10 $TALENT.');
      return;
    }
    if (credits >= 5) {
      alert('🔋 Tus créditos ya están al máximo (5/5).');
      return;
    }
    setWalletBalance(prev => prev - 10);
    setCredits(prev => prev + 1);
    addTransaction('Comprar 1 Crédito (Widget)', 10, 'out');
    alert('✅ Compra exitosa. 🔋 +1 Crédito añadido (Costo: 10 $TALENT).');
  };

  return (
    <div className="app-container">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-section">
          <Sparkles style={{ color: 'var(--accent-purple)' }} />
          <span className="logo-text">Chronos</span>
        </div>

        <nav className="nav-links">
          <button 
            className={`nav-item ${activeTab === 'agent' ? 'active' : ''}`}
            onClick={() => setActiveTab('agent')}
          >
            <Sparkles />
            <span>Mentor Chroni</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            <MessageSquare />
            <span>Red Chronos</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <Compass />
            <span>Misiones de Crédito</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            <Coins />
            <span>Billetera $TALENT</span>
          </button>
        </nav>

        <div className="user-profile-summary">
          <div className="user-avatar">T</div>
          <div className="user-info">
            <span className="user-name">Tú (Profesional)</span>
            <span className="user-handle">@tu_usuario</span>
          </div>
        </div>
      </aside>

      {/* MIDDLE CONTENT COLUMN */}
      <main className="main-content">
        <section className="feed-column">
          <div className="column-header">
            <span className="column-title">
              {activeTab === 'agent' && 'Mentor Chroni'}
              {activeTab === 'feed' && 'Red Chronos - Feed'}
              {activeTab === 'tasks' && 'Misiones Colaborativas'}
              {activeTab === 'wallet' && 'Billetera $TALENT'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="token-badge">
                <Coins size={12} />
                <span>{walletBalance} $TALENT</span>
              </span>
            </div>
          </div>

          {/* Dynamic tabs switching */}
          {activeTab === 'agent' && (
            <AuraAgent 
              credits={credits} 
              setCredits={setCredits} 
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              addPost={addPost}
              addTransaction={addTransaction}
            />
          )}

          {activeTab === 'feed' && (
            <SocialFeed 
              posts={posts}
              setPosts={setPosts}
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              addTransaction={addTransaction}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskBoard 
              credits={credits}
              setCredits={setCredits}
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              addTransaction={addTransaction}
            />
          )}

          {activeTab === 'wallet' && (
            <CryptoWallet 
              credits={credits}
              setCredits={setCredits}
              walletBalance={walletBalance}
              setWalletBalance={setWalletBalance}
              transactions={transactions}
              addTransaction={addTransaction}
            />
          )}
        </section>

        {/* RIGHT SIDEBAR PANEL */}
        <aside className="right-panel">
          {/* Credits Widget */}
          <div className="widget-card credits-widget">
            <h3 className="widget-title">
              <Zap size={16} style={{ color: 'var(--accent-cyan)' }} />
              Energía de Crédito
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Cada prueba de hito consume 1 crédito. Se regenera colaborando en la pestaña "Misiones de Crédito".
            </p>
            <div className="credits-battery">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`battery-cell ${idx < credits ? 'filled' : ''} ${credits === 1 && idx === 0 ? 'low' : ''}`}
                />
              ))}
            </div>
            <div className="credits-info">
              <span className="credits-count">{credits}/5 Créditos</span>
              <button 
                className="btn-wallet-action" 
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--accent-cyan-glow)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                disabled={credits >= 5}
                onClick={handleBuyCreditFromWidget}
              >
                Comprar (+1)
              </button>
            </div>
          </div>

          {/* Wallet Summary Widget */}
          <div className="widget-card wallet-widget">
            <h3 className="widget-title">
              <Coins size={16} style={{ color: 'var(--accent-purple)' }} />
              Token de Red
            </h3>
            <div className="wallet-balance-row">
              <div>
                <span className="wallet-label">Balance</span>
                <div className="wallet-amount" style={{ fontSize: '1.4rem' }}>{walletBalance} $TALENT</div>
              </div>
              <span className="token-badge" style={{ marginTop: '0.25rem' }}>$0.05 USD</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Usa tokens para comprar créditos, propinar a colegas o incentivar tus propias tareas de ayuda.
            </p>
            <button 
              className="btn-wallet-action" 
              style={{ width: '100%', gap: '0.35rem', background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              onClick={() => setActiveTab('wallet')}
            >
              Ir a Billetera
              <Coins size={12} />
            </button>
          </div>

          {/* Quick Info / Instructions Widget */}
          <div className="widget-card" style={{ border: '1px dashed var(--border-color)' }}>
            <h3 className="widget-title" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <HelpCircle size={14} />
              ¿Cómo funciona?
            </h3>
            <ol style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Habla con **Chroni** en el Chat para crear tu plan de proyecto interactivo.</li>
              <li>Inicia la **Prueba de Hito** (gasta 1 crédito).</li>
              <li>Avanza el hito, gana **$TALENT** y comparte tu logro en la **Red Chronos** en un clic.</li>
              <li>Si te quedas sin créditos, ayuda a un compañero en **Misiones de Crédito** para ganar +1 crédito.</li>
            </ol>
          </div>
        </aside>
      </main>
    </div>
  );
}
