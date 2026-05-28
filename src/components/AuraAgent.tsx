import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, BookOpen, Award, Share2, Compass } from 'lucide-react';

interface Milestone {
  id: number;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  question: string;
  options: string[];
  answerIndex: number;
  analysis: string;
}

interface Project {
  title: string;
  category: string;
  milestones: Milestone[];
  currentStep: number;
}

interface Message {
  id: string;
  sender: 'aura' | 'user';
  text: string;
  timestamp: Date;
  roadmap?: Milestone[];
  challenge?: {
    stepId: number;
    question: string;
    options: string[];
    answerIndex: number;
    analysis: string;
  };
  shareablePost?: {
    content: string;
    achievement: {
      title: string;
      desc: string;
      tokens: number;
    };
  };
}

interface AuraAgentProps {
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  addPost: (content: string, achievement?: { title: string; desc: string; tokens: number }) => void;
  addTransaction: (title: string, amount: number, type: 'in' | 'out') => void;
}

export default function AuraAgent({
  credits,
  setCredits,
  walletBalance: _walletBalance,
  setWalletBalance,
  addPost,
  addTransaction
}: AuraAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'aura',
      text: '¡Hola! Soy Chroni, tu mentor personal de carrera. 🦖\n\n¿Cuál es tu próximo gran objetivo o proyecto profesional? Cuéntame tu idea y te ayudaré a trazar un plan de acción paso a paso, tal como en Duolingo, pero adaptado a tu desarrollo.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [userObjective, setUserObjective] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0); // 0: Enter goal, 1: Detail Q1, 2: Detail Q2, 3: Roadmap generated
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeChallengeStepId, setActiveChallengeStepId] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [_, setLastGeneratedPost] = useState<{ content: string; title: string; desc: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addAuraMessage = (text: string, extra?: Partial<Message>) => {
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'aura',
        text,
        timestamp: new Date(),
        ...extra
      }
    ]);
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    if (!textToSend) setInputValue('');

    // User message
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'user',
        text,
        timestamp: new Date()
      }
    ]);

    // Aura Processing logic
    setTimeout(() => {
      if (onboardingStep === 0) {
        setUserObjective(text);
        setOnboardingStep(1);
        addAuraMessage(`Excelente objetivo: "${text}".\n\nPara personalizar tu ruta, dime: ¿Cuál es tu nivel actual de experiencia en esta área y cuál es el mayor desafío técnico o profesional que enfrentas hoy?`);
      } else if (onboardingStep === 1) {
        setOnboardingStep(2);
        addAuraMessage(`Entendido. Segunda pregunta: ¿A qué público objetivo o industria está dirigido tu proyecto, o qué tipo de rol profesional buscas obtener?`);
      } else if (onboardingStep === 2) {
        setOnboardingStep(3);
        // Generate Roadmap
        const roadmap = generateMockRoadmap(userObjective);
        setActiveProject({
          title: userObjective,
          category: 'Desarrollo Profesional',
          milestones: roadmap,
          currentStep: 0
        });

        addAuraMessage(
          `¡Perfecto! He recopilado toda la información necesaria. He diseñado un roadmap de 5 pasos realista e interactivo para tu proyecto: **"${userObjective}"**.\n\nCada paso completado gastará **1 crédito**, pero te otorgará **$TALENT** tokens y te generará un análisis profesional automático que podrás compartir en tu red social.`,
          { roadmap }
        );
      } else {
        // Conversation after roadmap is set
        addAuraMessage(`¡Excelente! Estamos listos para comenzar. Para iniciar el primer paso, haz clic en **"Prueba (1 cdt)"** en el roadmap de arriba. ¡Demuestra tus habilidades!`);
      }
    }, 1000);
  };

  const generateMockRoadmap = (_goal: string): Milestone[] => {
    return [
      {
        id: 1,
        title: 'Fase de Conceptualización e Investigación',
        description: 'Definir el core de tu propuesta de valor y analizar soluciones competitivas en el mercado.',
        status: 'active',
        question: '¿Cuál es la mejor manera de validar rápidamente tu idea de negocio con usuarios reales sin gastar capital de desarrollo?',
        options: [
          'Escribir un documento de requerimientos detallado de 50 páginas.',
          'Crear una Landing Page simple con lista de espera y medir la tasa de conversión de clics.',
          'Registrar inmediatamente la marca y patentes en tu oficina local.',
          'Desarrollar el producto completo durante 6 meses en sigilo.'
        ],
        answerIndex: 1,
        analysis: '¡Validación de mercado completada! La validación temprana mediante una landing page recopila datos conductuales reales de los usuarios (conversión/clicks) en lugar de opiniones hipotéticas. Esto ahorra valiosos recursos de desarrollo.',
      },
      {
        id: 2,
        title: 'Diseño del MVP (Mínimo Producto Viable)',
        description: 'Esquematizar las funcionalidades críticas e indispensables para resolver el problema principal.',
        status: 'locked',
        question: 'Al diseñar la arquitectura técnica para tu MVP, ¿qué principio de ingeniería deberías priorizar?',
        options: [
          'Implementar microservicios con Kubernetes y multi-cloud desde el primer día.',
          'Desarrollar una arquitectura monolítica modular simple para iterar rápido.',
          'Copiar exactamente el stack tecnológico de Netflix.',
          'No usar ninguna base de datos y guardar todo en archivos de texto.'
        ],
        answerIndex: 1,
        analysis: '¡Arquitectura de MVP definida! La modularidad monolítica te permite acelerar los ciclos de iteración tecnológica sin incurrir en la sobrecarga operativa y complejidad de redes que conllevan los microservicios en etapas tempranas.',
      },
      {
        id: 3,
        title: 'Estrategia de Lanzamiento e Interacción',
        description: 'Construir tu red de distribución inicial y afinar el embudo de onboarding de usuarios.',
        status: 'locked',
        question: '¿Cuál es el canal de crecimiento orgánico más sostenible a largo plazo para tu perfil profesional / proyecto?',
        options: [
          'Pagar anuncios masivos en televisión.',
          'Compartir de forma transparente tu proceso de construcción (Build in Public) y análisis en redes sociales.',
          'Enviar correos electrónicos masivos no solicitados (spam).',
          'Esperar a que la prensa te descubra de forma aleatoria.'
        ],
        answerIndex: 1,
        analysis: '¡Estrategia de crecimiento validada! Construir en público (Build in Public) fomenta la confianza, crea una comunidad leal de early adopters y consolida tu autoridad profesional al documentar tus aprendizajes reales paso a paso.',
      },
      {
        id: 4,
        title: 'Modelo de Monetización y Sostenibilidad',
        description: 'Establecer precios, flujos de ingresos y el valor del token en la economía interna.',
        status: 'locked',
        question: 'Si planeas lanzar un modelo freemium, ¿cómo determinas qué características son de pago (Premium)?',
        options: [
          'Hacer que toda la aplicación sea de pago después de 1 día.',
          'Mantener gratuitas las funciones básicas y cobrar por integraciones avanzadas, automatizaciones o límites de volumen.',
          'Dejar todo gratis para siempre y esperar donaciones voluntarias.',
          'Cobrar por el registro del usuario y por iniciar sesión.'
        ],
        answerIndex: 1,
        analysis: '¡Modelo económico estructurado! El modelo freemium con barreras basadas en uso o integraciones avanzadas minimiza la fricción inicial de entrada mientras monetiza el valor real a escala y con usuarios profesionales.',
      },
      {
        id: 5,
        title: 'Escalamiento e Integración Web3',
        description: 'Definir el tokenomics final y preparar la migración hacia una red descentralizada descentralizada.',
        status: 'locked',
        question: '¿Cómo beneficia la Web3 a un ecosistema colaborativo de aprendizaje profesional como este?',
        options: [
          'Permite la especulación de precios sin ningún producto real.',
          'Alinea los incentivos distribuyendo valor directamente a los contribuyentes que resuelven tareas mediante tokens transferibles.',
          'Reemplaza por completo todas las bases de datos tradicionales por blockchains lentas.',
          'Obliga a los usuarios a pagar tarifas altas de gas por cada me gusta.'
        ],
        answerIndex: 1,
        analysis: '¡Visión Web3 consolidada! Los tokens de criptomonedas alinean los incentivos de la comunidad permitiendo recompensas directas y líquidas por tareas colaborativas, descentralizando el valor de la red en favor de quienes aportan valor real.',
      }
    ];
  };

  const handleStartChallenge = (stepId: number) => {
    if (credits <= 0) {
      addAuraMessage('❌ No tienes suficientes créditos. Los desafíos de hito requieren 1 crédito. Puedes ganar un crédito completando tareas para otros en el "Tablero de Tareas" o comprando créditos en tu Billetera.');
      return;
    }

    setCredits(prev => prev - 1);
    setActiveChallengeStepId(stepId);
    setSelectedOption(null);

    const step = activeProject?.milestones.find(m => m.id === stepId);
    if (step) {
      addAuraMessage(`📝 Iniciando Desafío: **"${step.title}"** (Se consumió 1 crédito). Responde la siguiente pregunta de evaluación profesional para avanzar:`, {
        challenge: {
          stepId,
          question: step.question,
          options: step.options,
          answerIndex: step.answerIndex,
          analysis: step.analysis
        }
      });
    }
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = (stepId: number, selected: number, challenge: any) => {
    if (selected === null) return;
    setActiveChallengeStepId(null);

    const isCorrect = selected === challenge.answerIndex;
    const tokenReward = isCorrect ? 50 : 20;

    setTimeout(() => {
      // Update Project Roadmap State
      if (activeProject) {
        const updatedMilestones = activeProject.milestones.map(m => {
          if (m.id === stepId) {
            return { ...m, status: 'completed' as const };
          }
          if (m.id === stepId + 1) {
            return { ...m, status: 'active' as const };
          }
          return m;
        });

        const nextStepIdx = activeProject.currentStep + 1;
        setActiveProject({
          ...activeProject,
          milestones: updatedMilestones,
          currentStep: nextStepIdx
        });

        // Add tokens and transactions
        setWalletBalance(prev => prev + tokenReward);
        addTransaction(
          `Completar Desafío Hito #${stepId}`,
          tokenReward,
          'in'
        );

        // Generate analytic X post
        const content = `🔥 ¡Acabo de completar el Hito #${stepId} en mi proyecto de desarrollo profesional "${activeProject.title}" guiado por mi mentor Chroni 🦖 en CHRONOS!\n\n💡 Análisis: ${challenge.analysis}\n\n🏆 Recompensa: +${tokenReward} $TALENT tokens. #BuildInPublic #Chronos #CareerGrowth`;
        
        setLastGeneratedPost({
          content,
          title: activeProject.milestones.find(m => m.id === stepId)?.title || 'Hito Completado',
          desc: `Completado exitosamente con ${tokenReward} $TALENT ganados.`,
        });

        const feedbackText = isCorrect 
          ? `🎉 **¡Respuesta Correcta!** ¡Excelente trabajo analítico!\n\nRecompensa: **+${tokenReward} $TALENT** tokens.\n\nHe generado una publicación analítica con tu avance. ¿Quieres compartirla en tu feed social?`
          : `⚠️ **Respuesta incorrecta, pero completaste el paso.** La respuesta correcta era: "${challenge.options[challenge.answerIndex]}".\n\nRecompensa de consolación: **+${tokenReward} $TALENT** tokens.\n\nHe generado una publicación analítica con tu avance para compartir en tu feed social.`;

        addAuraMessage(feedbackText, {
          shareablePost: {
            content,
            achievement: {
              title: `Hito #${stepId} Completado`,
              desc: activeProject.milestones.find(m => m.id === stepId)?.title || '',
              tokens: tokenReward
            }
          }
        });
      }
    }, 800);
  };

  const handleSharePost = (post: any) => {
    addPost(post.content, post.achievement);
    setLastGeneratedPost(null);
    addAuraMessage('✅ ¡Avance compartido con éxito en tu red social Chronos! Tu comunidad puede ver tus logros y análisis profesional en tiempo real.');
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {onboardingStep < 3 && (
          <div className="mascot-onboarding-card animate-fade-in">
            <img src="/mascot.png" alt="Chroni" className="mascot-image-large" />
            <span className="mascot-name-badge">🦖 Chroni Mentor</span>
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Establece tu Objetivo de Carrera</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Escribe tu meta profesional en el chat de abajo para que Chroni diseñe tu mapa de ruta interactivo de 5 pasos.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            <div className="chat-bubble-meta">
              {msg.sender === 'aura' ? (
                <>
                  <span>🦖 Chroni (Mentor)</span>
                </>
              ) : (
                <span>Tú</span>
              )}
            </div>
            
            <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>

            {/* Render Roadmap inside bubble */}
            {msg.roadmap && (
              <div className="roadmap-container animate-fade-in">
                <div className="roadmap-title">
                  <Compass size={16} />
                  <span>Tu Ruta de Proyecto Paso a Paso</span>
                </div>
                {msg.roadmap.map(step => (
                  <div key={step.id} className={`roadmap-step ${step.status}`}>
                    <div className="step-indicator">
                      {step.status === 'completed' ? '✓' : step.id}
                    </div>
                    <div className="step-details">
                      <div className="step-name">{step.title}</div>
                      <div className="step-desc">{step.description}</div>
                    </div>
                    {step.status === 'active' && (
                      <button
                        className="btn-wallet-action"
                        style={{ marginLeft: 'auto', background: 'rgba(6,182,212,0.15)', borderColor: 'rgba(6,182,212,0.3)', color: 'var(--accent-cyan)' }}
                        onClick={() => handleStartChallenge(step.id)}
                      >
                        <Zap size={12} />
                        Prueba (1 cdt)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Render Challenge interactive card */}
            {msg.challenge && activeChallengeStepId === msg.challenge.stepId && (
              <div className="milestone-challenge-card">
                <div className="challenge-header">
                  <BookOpen size={14} />
                  <span>Evaluación Profesional Hito #{msg.challenge.stepId}</span>
                </div>
                <div className="challenge-question">{msg.challenge.question}</div>
                <div className="challenge-options">
                  {msg.challenge.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      className={`challenge-option ${selectedOption === oIdx ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(oIdx)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  className="challenge-submit-btn"
                  disabled={selectedOption === null}
                  onClick={() => handleSubmitAnswer(msg.challenge!.stepId, selectedOption!, msg.challenge)}
                >
                  Confirmar Respuesta
                </button>
              </div>
            )}

            {/* Render shareable post interface */}
            {msg.shareablePost && (
              <div className="achievement-embed" style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '2px solid var(--accent-purple)', paddingLeft: '0.5rem' }}>
                    "{msg.shareablePost.content.substring(0, 100)}..."
                  </div>
                  <button
                    className="btn-create-task"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', width: 'fit-content', gap: '0.35rem' }}
                    onClick={() => handleSharePost(msg.shareablePost)}
                  >
                    <Share2 size={12} />
                    Compartir en Red Social X
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Roadmap Tracker floating at the bottom if project is active */}
      {activeProject && (
        <div className="widget-card" style={{ margin: '0 1.5rem 1rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Roadmap Activo</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{activeProject.title}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {activeProject.milestones.map(m => (
              <div
                key={m.id}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: m.status === 'completed' ? 'var(--accent-green)' : m.status === 'active' ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                  boxShadow: 'none',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="chat-input-wrapper"
        >
          <input
            type="text"
            className="chat-input"
            placeholder={
              onboardingStep === 0 
                ? 'Ej. Crear una app SaaS de finanzas personales, lanzar canal de UI/UX...' 
                : 'Escribe tu respuesta para Aura...'
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!inputValue.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
