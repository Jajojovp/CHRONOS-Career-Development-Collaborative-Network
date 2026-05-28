import React, { useState } from 'react';
import { PlusCircle, Award, Zap, Coins, X, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: {
    name: string;
    avatar: string;
  };
  rewardCredits: number;
  rewardTokens: number;
  status: 'active' | 'completed';
  solution?: string;
}

interface TaskBoardProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  addTransaction: (title: string, amount: number, type: 'in' | 'out') => void;
}

export default function TaskBoard({
  credits,
  setCredits,
  walletBalance,
  setWalletBalance,
  addTransaction
}: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task_1',
      title: 'Feedback sobre Copia de Landing Page SaaS',
      description: 'He redactado el lema de mi SaaS de analítica: "Métricas en tiempo real para diseñadores perezosos". Necesito una crítica constructiva u otra propuesta más profesional.',
      category: 'Copywriting / Marketing',
      creator: { name: 'lucas_growth', avatar: 'L' },
      rewardCredits: 1,
      rewardTokens: 15,
      status: 'active'
    },
    {
      id: 'task_2',
      title: 'Revisión de Query SQL lento en Postgres',
      description: 'Una consulta con JOIN en 3 tablas tarda más de 2 segundos. ¿Qué índices debo crear en tablas de ordenes y usuarios para mejorar velocidad?',
      category: 'Bases de Datos',
      creator: { name: 'sofia_dev', avatar: 'S' },
      rewardCredits: 1,
      rewardTokens: 25,
      status: 'active'
    },
    {
      id: 'task_3',
      title: 'Ideas de colores para app de Salud Mental',
      description: 'Estoy diseñando una app de bienestar y meditación. ¿Qué combinación de colores (paleta HSL) transmite más paz y calma a los usuarios?',
      category: 'Diseño UI/UX',
      creator: { name: 'marcos_product', avatar: 'M' },
      rewardCredits: 1,
      rewardTokens: 10,
      status: 'active'
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSolveModalOpen, setIsSolveModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Create Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCat, setTaskCat] = useState('Desarrollo General');
  const [taskTokenReward, setTaskTokenReward] = useState(15);

  // Solve Task Form State
  const [solutionText, setSolutionText] = useState('');

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDesc.trim()) return;

    if (walletBalance < taskTokenReward) {
      alert(`❌ Balance de $TALENT insuficiente. Para publicar esta tarea necesitas al menos ${taskTokenReward} $TALENT.`);
      return;
    }

    // Deduct tokens from wallet
    setWalletBalance(prev => prev - taskTokenReward);
    addTransaction(`Publicar tarea: ${taskTitle}`, taskTokenReward, 'out');

    const newTask: Task = {
      id: Math.random().toString(),
      title: taskTitle,
      description: taskDesc,
      category: taskCat,
      creator: {
        name: 'tú_profesional',
        avatar: 'T'
      },
      rewardCredits: 1,
      rewardTokens: taskTokenReward,
      status: 'active'
    };

    setTasks(prev => [newTask, ...prev]);
    setIsCreateModalOpen(false);

    // Reset Form
    setTaskTitle('');
    setTaskDesc('');
    setTaskCat('Desarrollo General');
    setTaskTokenReward(15);

    alert('✅ Tarea de colaboración creada. Se ha deducido el incentivo en $TALENT. Tus compañeros profesionales te ayudarán pronto.');
  };

  const handleOpenSolve = (task: Task) => {
    if (credits >= 5) {
      alert('🔋 Tus créditos ya están al máximo (5/5). ¡Gasta créditos en Aura antes de realizar tareas para otros!');
      return;
    }
    setSelectedTask(task);
    setSolutionText('');
    setIsSolveModalOpen(true);
  };

  const handleSolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionText.trim() || !selectedTask) return;

    // Regenerate 1 Credit and earn reward tokens
    setCredits(prev => Math.min(5, prev + 1));
    setWalletBalance(prev => prev + selectedTask.rewardTokens);
    addTransaction(
      `Resolver Tarea: "${selectedTask.title}"`,
      selectedTask.rewardTokens,
      'in'
    );

    // Mark task as solved locally
    setTasks(prev =>
      prev.map(t => {
        if (t.id === selectedTask.id) {
          return { ...t, status: 'completed', solution: solutionText };
        }
        return t;
      })
    );

    setIsSolveModalOpen(false);
    setSelectedTask(null);

    alert(`🎉 ¡Tarea Completada! Recibiste:\n\n🔋 +1 Crédito Regenerado (Balance actual: ${Math.min(5, credits + 1)}/5)\n🪙 +${selectedTask.rewardTokens} $TALENT Tokens`);
  };

  return (
    <div className="task-board">
      <div className="task-board-header">
        <div>
          <h2 className="column-title">Colaboración de Créditos</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Ayuda a otros a resolver problemas reales para regenerar tus créditos de tareas.
          </p>
        </div>
        <button className="btn-create-task" onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle size={16} />
          Crear Tarea (-$TALENT)
        </button>
      </div>

      <div className="tasks-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-item-card">
            <div className="task-card-top">
              <div className="task-creator-info">
                <div className="task-creator-avatar">{task.creator.avatar}</div>
                <div className="task-creator-name">@{task.creator.name}</div>
              </div>
              <div className="task-rewards">
                <span className="reward-badge credit">
                  <Zap size={10} style={{ fill: 'currentColor', marginRight: '2px' }} />
                  +{task.rewardCredits} Crédito
                </span>
                <span className="reward-badge token">
                  <Coins size={10} style={{ marginRight: '2px' }} />
                  +{task.rewardTokens} $TALENT
                </span>
              </div>
            </div>

            <div>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-desc">{task.description}</p>
            </div>

            {task.solution && (
              <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid var(--accent-green)', padding: '0.5rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>Tu solución: </span>
                <span style={{ color: 'var(--text-secondary)' }}>"{task.solution}"</span>
              </div>
            )}

            <div className="task-card-footer">
              <span className="task-category">{task.category}</span>
              {task.status === 'active' ? (
                <button
                  className="btn-action-task"
                  onClick={() => handleOpenSolve(task)}
                >
                  Resolver Tarea
                </button>
              ) : (
                <button className="btn-action-task completed" disabled>
                  Resuelta
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CREATE TASK */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle style={{ color: 'var(--accent-purple)' }} />
                Publicar Ayuda Profesional
              </h3>
              <button className="modal-close" onClick={() => setIsCreateModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTaskSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Título de la Tarea</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Revisión de landing page, feedback de logo..."
                  className="chat-input"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.6rem 0.8rem' }}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Descripción del Desafío</label>
                <textarea
                  required
                  placeholder="Describe detalladamente el problema y lo que esperas que resuelvan..."
                  className="feed-creator-textarea"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.6rem 0.8rem', minHeight: '100px' }}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Categoría</label>
                  <select
                    className="swap-select"
                    style={{ width: '100%', padding: '0.6rem' }}
                    value={taskCat}
                    onChange={(e) => setTaskCat(e.target.value)}
                  >
                    <option value="Desarrollo General">Programación</option>
                    <option value="Diseño UI/UX">Diseño UI/UX</option>
                    <option value="Copywriting / Marketing">Marketing</option>
                    <option value="Bases de Datos">Bases de Datos</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Incentivo ($TALENT)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    required
                    className="chat-input"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.6rem 0.8rem' }}
                    value={taskTokenReward}
                    onChange={(e) => setTaskTokenReward(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-purple-glow)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--accent-purple)', marginTop: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>Esta acción retendrá {taskTokenReward} $TALENT de tu wallet para incentivar la solución.</span>
              </div>
              <button type="submit" className="btn-swap-execute" style={{ marginTop: '0.5rem' }}>
                Publicar Tarea (-{taskTokenReward} $TALENT)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SOLVE TASK */}
      {isSolveModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award style={{ color: 'var(--accent-cyan)' }} />
                Resolver Tarea de Colaboración
              </h3>
              <button className="modal-close" onClick={() => setIsSolveModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tarea de @{selectedTask.creator.name}</div>
              <h4 style={{ fontSize: '0.95rem', margin: '0.25rem 0' }}>{selectedTask.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedTask.description}</p>
            </div>
            <form onSubmit={handleSolveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Tu Solución / Consejo Profesional</label>
                <textarea
                  required
                  placeholder="Escribe tu asesoría, recomendación técnica o respuesta detallada..."
                  className="feed-creator-textarea"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.6rem 0.8rem', minHeight: '120px' }}
                  value={solutionText}
                  onChange={(e) => setSolutionText(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', background: 'var(--accent-cyan-glow)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>Recompensas al Enviar:</span>
                <span style={{ fontWeight: 'bold' }}>🔋 +1 Crédito & 🪙 +{selectedTask.rewardTokens} $TALENT</span>
              </div>
              <button type="submit" className="btn-swap-execute" style={{ background: 'var(--accent-cyan)' }}>
                Enviar Solución
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
