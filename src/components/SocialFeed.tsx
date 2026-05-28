import React, { useState } from 'react';
import { MessageCircle, Repeat2, Heart, Award, Coins, Image, BarChart2, Smile } from 'lucide-react';

export interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  comments: number;
  likedByUser?: boolean;
  repostedByUser?: boolean;
  achievement?: {
    title: string;
    desc: string;
    tokens: number;
  };
}

interface SocialFeedProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  addTransaction: (title: string, amount: number, type: 'in' | 'out') => void;
}

export default function SocialFeed({
  posts,
  setPosts,
  walletBalance,
  setWalletBalance,
  addTransaction
}: SocialFeedProps) {
  const [newPostText, setNewPostText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'achievements' | 'my-posts'>('all');

  const handleCreatePost = () => {
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: Math.random().toString(),
      author: {
        name: 'Tú (Profesional)',
        handle: '@tu_usuario',
        avatar: 'T'
      },
      content: newPostText,
      timestamp: 'Ahora mismo',
      likes: 0,
      reposts: 0,
      comments: 0
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
  };

  const handleLike = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likedByUser: liked,
            likes: liked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const handleRepost = (id: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const reposted = !p.repostedByUser;
          return {
            ...p,
            repostedByUser: reposted,
            reposts: reposted ? p.reposts + 1 : p.reposts - 1
          };
        }
        return p;
      })
    );
  };

  // Tip an author of a post with $TALENT tokens
  const handleTip = (id: string, authorHandle: string) => {
    if (authorHandle === '@tu_usuario') {
      alert('¡No puedes darte propina a ti mismo!');
      return;
    }

    const tipAmount = 10;
    if (walletBalance < tipAmount) {
      alert('❌ Balance de $TALENT insuficiente para dar propina.');
      return;
    }

    // Deduct tokens
    setWalletBalance(prev => prev - tipAmount);
    addTransaction(`Propina enviada a ${authorHandle}`, tipAmount, 'out');

    // Update post like count and maybe show tip feedback
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            likes: p.likes + 1 // Tipping counts as a super-like!
          };
        }
        return p;
      })
    );

    alert(`✅ Enviaste una propina de ${tipAmount} $TALENT a ${authorHandle}. ¡Gran colaboración profesional!`);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'achievements') {
      return !!post.achievement;
    }
    if (activeTab === 'my-posts') {
      return post.author.handle === '@tu_usuario';
    }
    return true;
  });

  return (
    <div className="social-feed">
      {/* Create Post Area */}
      <div className="feed-creator">
        <div className="user-avatar" style={{ flexShrink: 0 }}>T</div>
        <div className="feed-creator-input-container">
          <textarea
            className="feed-creator-textarea"
            placeholder="¿Qué avances u objetivos profesionales quieres compartir hoy? #BuildInPublic..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
          />
          <div className="feed-creator-actions">
            <div className="feed-creator-tools">
              <button className="feed-creator-tool-btn"><Image size={18} /></button>
              <button className="feed-creator-tool-btn"><BarChart2 size={18} /></button>
              <button className="feed-creator-tool-btn"><Smile size={18} /></button>
            </div>
            <button
              className="btn-post"
              disabled={!newPostText.trim()}
              onClick={handleCreatePost}
            >
              Publicar en Feed
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="feed-tabs">
        <div
          className={`feed-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Para ti
        </div>
        <div
          className={`feed-tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Hitos de Carrera
        </div>
        <div
          className={`feed-tab ${activeTab === 'my-posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-posts')}
        >
          Mis Avances
        </div>
      </div>

      {/* Post List */}
      <div className="feed-list">
        {filteredPosts.length === 0 ? (
          <div style={{ padding: '3rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            No hay publicaciones en esta pestaña todavía.
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <div
                className="user-avatar"
                style={{
                  background: post.author.avatar.length === 1 
                    ? undefined 
                    : `url(${post.author.avatar}) center/cover no-repeat`
                }}
              >
                {post.author.avatar.length === 1 ? post.author.avatar : ''}
              </div>
              <div className="post-body">
                <div className="post-meta">
                  <span className="post-author-name">{post.author.name}</span>
                  <span className="post-author-handle">{post.author.handle}</span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span className="post-time">{post.timestamp}</span>
                </div>
                <div className="post-content">{post.content}</div>

                {/* Render embedded Achievement Card if exists */}
                {post.achievement && (
                  <div className="achievement-embed">
                    <div className="achievement-icon">
                      <Award size={20} />
                    </div>
                    <div className="achievement-details">
                      <div className="achievement-title">{post.achievement.title}</div>
                      <div className="achievement-desc">{post.achievement.desc}</div>
                    </div>
                    <div className="achievement-token-earned">
                      <Coins size={14} />
                      <span>+{post.achievement.tokens} $TALENT</span>
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="post-actions">
                  <button className="post-action-btn btn-comment">
                    <MessageCircle />
                    <span>{post.comments}</span>
                  </button>
                  <button 
                    className={`post-action-btn btn-repost ${post.repostedByUser ? 'reposted' : ''}`}
                    onClick={() => handleRepost(post.id)}
                  >
                    <Repeat2 />
                    <span>{post.reposts}</span>
                  </button>
                  <button 
                    className={`post-action-btn btn-like ${post.likedByUser ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart style={{ fill: post.likedByUser ? 'var(--accent-red)' : 'none' }} />
                    <span>{post.likes}</span>
                  </button>
                  
                  {post.author.handle !== '@tu_usuario' && (
                    <button 
                      className="post-action-btn" 
                      style={{ color: 'var(--accent-green)', fontWeight: 600 }}
                      onClick={() => handleTip(post.id, post.author.handle)}
                    >
                      <Coins size={15} style={{ color: 'var(--accent-green)' }} />
                      <span>Propina</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
