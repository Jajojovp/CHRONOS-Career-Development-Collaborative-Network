import React, { useState } from 'react';
import { Coins, ArrowUpDown, ShieldCheck, Zap, History, Copy, Check } from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'in' | 'out';
  timestamp: string;
}

interface CryptoWalletProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  transactions: Transaction[];
  addTransaction: (title: string, amount: number, type: 'in' | 'out') => void;
}

export default function CryptoWallet({
  credits,
  setCredits,
  walletBalance,
  setWalletBalance,
  transactions,
  addTransaction
}: CryptoWalletProps) {
  const [copied, setCopied] = useState(false);
  const [swapAmount, setSwapAmount] = useState('10');
  const [swapTarget, setSwapTarget] = useState('USD');
  const [stakedBalance, setStakedBalance] = useState(50);
  const [stakeInput, setStakeInput] = useState('20');
  const tokenPrice = 0.05; // $0.05 USD per $TALENT

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('0x7A9D...9F21');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    const amt = parseFloat(swapAmount);
    if (isNaN(amt) || amt <= 0) return;

    if (walletBalance < amt) {
      alert('❌ Balance de $TALENT insuficiente para el intercambio.');
      return;
    }

    const receiveAmt = swapTarget === 'USD' ? (amt * tokenPrice).toFixed(2) : (amt * 0.0003).toFixed(5);
    const receiveSymbol = swapTarget === 'USD' ? '$' : 'SOL';

    setWalletBalance(prev => prev - amt);
    addTransaction(`Intercambio swap: ${amt} $TALENT -> ${swapTarget}`, amt, 'out');
    
    alert(`✅ Intercambio ejecutado con éxito.\n\nCambiaste: ${amt} $TALENT\nRecibiste: ${receiveSymbol} ${receiveAmt}`);
  };

  const handleStake = () => {
    const amt = parseInt(stakeInput);
    if (isNaN(amt) || amt <= 0) return;

    if (walletBalance < amt) {
      alert('❌ Balance de $TALENT insuficiente para hacer staking.');
      return;
    }

    setWalletBalance(prev => prev - amt);
    setStakedBalance(prev => prev + amt);
    addTransaction(`Staking bloqueado: ${amt} $TALENT`, amt, 'out');
    setStakeInput('');

    alert(`✅ Staking exitoso. Bloqueaste ${amt} $TALENT en el pool de rendimiento (12% APY).`);
  };

  const handleUnstake = () => {
    if (stakedBalance <= 0) return;
    const amt = stakedBalance;
    setStakedBalance(0);
    setWalletBalance(prev => prev + amt);
    addTransaction(`Retirar Staking: ${amt} $TALENT`, amt, 'in');

    alert(`✅ Retiraste con éxito ${amt} $TALENT de la bóveda de staking.`);
  };

  const handleBuyCredit = () => {
    if (walletBalance < 10) {
      alert('❌ Balance de $TALENT insuficiente. Comprar 1 crédito cuesta 10 $TALENT.');
      return;
    }
    if (credits >= 5) {
      alert('🔋 Tus créditos ya están completos (5/5).');
      return;
    }

    setWalletBalance(prev => prev - 10);
    setCredits(prev => prev + 1);
    addTransaction('Comprar 1 Crédito (Billetera)', 10, 'out');

    alert('✅ Compra exitosa. 🔋 +1 Crédito añadido (Costo: 10 $TALENT).');
  };

  // Mock chart prices over 7 days
  const chartDays = [
    { label: 'Lun', val: 32, price: '$0.042' },
    { label: 'Mar', val: 55, price: '$0.045' },
    { label: 'Mié', val: 24, price: '$0.041' },
    { label: 'Jue', val: 78, price: '$0.047' },
    { label: 'Vie', val: 90, price: '$0.049' },
    { label: 'Sáb', val: 120, price: '$0.052' },
    { label: 'Dom', val: 105, price: '$0.050' },
  ];

  return (
    <div className="crypto-wallet-view">
      <div className="task-board-header" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="column-title">Billetera Web3 $TALENT</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Gestiona tus tokens ganados y tus compras del ecosistema.
          </p>
        </div>
      </div>

      {/* Wallet Overview Panel */}
      <div className="wallet-overview-card">
        <div className="wallet-overview-left">
          <div className="wallet-label">Balance de Wallet</div>
          <div className="wallet-amount">{walletBalance} $TALENT</div>
          <div className="wallet-amount-usd">≈ ${(walletBalance * tokenPrice).toFixed(2)} USD</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
            <span className="wallet-overview-address">0x7A9D...9F21</span>
            <button
              onClick={handleCopyAddress}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              {copied ? <Check size={12} style={{ color: 'var(--accent-green)' }} /> : <Copy size={12} />}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className="btn-create-task" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'var(--accent-cyan)' }}
            onClick={handleBuyCredit}
          >
            <Zap size={14} style={{ fill: 'currentColor' }} />
            Comprar Crédito (10 $TALENT)
          </button>
          <div style={{ display: 'flex', gap: '0.25rem', fontSize: '0.75rem', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <span>Créditos: </span>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{credits}/5</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="wallet-chart-card">
        <div className="chart-header">
          <div className="chart-token-info">
            <Coins style={{ color: 'var(--accent-purple)' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Precio del Token $TALENT</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Historial de 7 días</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="chart-price">$0.050 USD</div>
            <span className="chart-change positive">+19.04%</span>
          </div>
        </div>
        
        {/* Dynamic bar simulation */}
        <div className="chart-canvas-sim">
          {chartDays.map((day, idx) => (
            <div
              key={idx}
              className="chart-bar-sim"
              style={{ height: `${day.val}%` }}
              data-price={day.price}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', padding: '0 0.5rem' }}>
          {chartDays.map((day, idx) => <span key={idx}>{day.label}</span>)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Token Swap Box */}
        <div className="swap-card">
          <h3 className="widget-title" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            <ArrowUpDown size={16} style={{ color: 'var(--accent-cyan)' }} />
            Intercambiar Tokens (Swap)
          </h3>
          <div className="swap-input-group">
            <input
              type="number"
              className="swap-input"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
            />
            <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>$TALENT</span>
          </div>
          <div className="swap-divider">
            <div className="swap-divider-btn">
              <ArrowUpDown size={14} />
            </div>
          </div>
          <div className="swap-input-group">
            <div className="swap-input" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', padding: '0.2rem 0' }}>
              {swapTarget === 'USD' 
                ? `$${(parseFloat(swapAmount || '0') * tokenPrice).toFixed(2)}` 
                : `${(parseFloat(swapAmount || '0') * 0.0003).toFixed(5)}`}
            </div>
            <select 
              className="swap-select"
              value={swapTarget}
              onChange={(e) => setSwapTarget(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="SOL">Solana (SOL)</option>
            </select>
          </div>
          <button className="btn-swap-execute" onClick={handleSwap}>
            Confirmar Swap
          </button>
        </div>

        {/* Staking Box */}
        <div className="swap-card" style={{ background: 'var(--bg-card)' }}>
          <h3 className="widget-title" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--accent-purple)' }} />
            Bóveda de Staking (12% APY)
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Tokens Bloqueados:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--accent-purple)' }}>{stakedBalance} $TALENT</span>
          </div>
          <div className="swap-input-group" style={{ padding: '0.5rem 0.75rem' }}>
            <input
              type="number"
              className="swap-input"
              style={{ fontSize: '1.1rem' }}
              placeholder="Monto a bloquear..."
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
            />
            <button 
              className="btn-wallet-action" 
              style={{ padding: '0.25rem 0.5rem', background: 'rgba(139,92,246,0.15)', borderColor: 'var(--accent-purple)' }}
              onClick={handleStake}
            >
              Stakear
            </button>
          </div>
          <button 
            className="btn-swap-execute" 
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.5rem' }}
            disabled={stakedBalance <= 0}
            onClick={handleUnstake}
          >
            Retirar Staking (Unstake)
          </button>
        </div>
      </div>

      {/* Ledger History */}
      <div className="ledger-card">
        <h3 className="widget-title" style={{ fontSize: '0.95rem' }}>
          <History size={16} />
          Historial de Transacciones
        </h3>
        <div className="ledger-list">
          {transactions.map(tx => (
            <div key={tx.id} className="ledger-item">
              <div className="ledger-item-left">
                <div className={`ledger-type-icon ${tx.type}`}>
                  {tx.type === 'in' ? '↙' : '↗'}
                </div>
                <div>
                  <div className="ledger-item-title">{tx.title}</div>
                  <div className="ledger-item-time">{tx.timestamp}</div>
                </div>
              </div>
              <div className={`ledger-amount ${tx.type}`}>
                {tx.type === 'in' ? '+' : '-'}{tx.amount} $TALENT
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
