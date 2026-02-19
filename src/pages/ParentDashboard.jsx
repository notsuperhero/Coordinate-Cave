import React from 'react';
import './ParentDashboard.css';

/**
 * ParentDashboard — Class Component showing child's progress.
 * Password-protected entry, displays stats from localStorage.
 */
class ParentDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            password: '',
            error: '',
            progress: null,
            difficulty: 'easy',
        };
    }

    componentDidMount() {
        this.loadProgress();
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('cc-progress');
            if (saved) {
                this.setState({ progress: JSON.parse(saved) });
            }
        } catch {
            this.setState({ progress: null });
        }
    }

    handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Simple password for demo purposes
        if (this.state.password === '1234') {
            this.setState({ isAuthenticated: true, error: '' });
        } else {
            this.setState({ error: 'Incorrect password. Try 1234.' });
        }
    };

    handleDifficultyChange = (difficulty) => {
        this.setState({ difficulty });
        try {
            const settings = JSON.parse(localStorage.getItem('cc-settings') || '{}');
            settings.difficulty = difficulty;
            localStorage.setItem('cc-settings', JSON.stringify(settings));
        } catch { /* ignore */ }
    };

    handleResetProgress = () => {
        if (window.confirm('This will reset all progress. Are you sure?')) {
            localStorage.removeItem('cc-progress');
            this.setState({ progress: null });
        }
    };

    renderPasswordScreen() {
        return (
            <div className="parent__auth">
                <div className="parent__auth-card">
                    <h2>👪 Parent Mode</h2>
                    <p>Enter the password to view your child's progress</p>
                    <form onSubmit={this.handlePasswordSubmit}>
                        <input
                            type="password"
                            className="parent__input"
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            placeholder="Enter password"
                            aria-label="Parent mode password"
                            autoFocus
                        />
                        {this.state.error && (
                            <p className="parent__error" role="alert">{this.state.error}</p>
                        )}
                        <button type="submit" className="btn btn--primary btn--large" aria-label="Enter parent mode">
                            🔑 Enter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    renderStatBar(label, value, max, color) {
        const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
        return (
            <div className="parent__stat-bar" key={label}>
                <div className="parent__stat-bar-header">
                    <span>{label}</span>
                    <span className="parent__stat-bar-value">{value}</span>
                </div>
                <div className="parent__stat-bar-track">
                    <div
                        className="parent__stat-bar-fill"
                        style={{ width: `${percentage}%`, background: color }}
                    />
                </div>
            </div>
        );
    }

    renderDashboard() {
        const p = this.state.progress || {
            totalGames: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            stars: 0,
            badges: [],
            levelsCompleted: [],
        };

        const accuracy = p.totalAnswers > 0 ? Math.round((p.correctAnswers / p.totalAnswers) * 100) : 0;

        return (
            <div className="parent__dashboard">
                <h1 className="parent__title">👪 Parent Dashboard</h1>
                <p className="parent__subtitle">Your child's learning journey</p>

                {/* Summary Cards */}
                <div className="parent__summary">
                    <div className="parent__summary-card">
                        <span className="parent__summary-icon">🎮</span>
                        <span className="parent__summary-value">{p.totalGames}</span>
                        <span className="parent__summary-label">Games Played</span>
                    </div>
                    <div className="parent__summary-card">
                        <span className="parent__summary-icon">🎯</span>
                        <span className="parent__summary-value">{accuracy}%</span>
                        <span className="parent__summary-label">Accuracy</span>
                    </div>
                    <div className="parent__summary-card">
                        <span className="parent__summary-icon">⭐</span>
                        <span className="parent__summary-value">{p.stars}</span>
                        <span className="parent__summary-label">Stars Earned</span>
                    </div>
                    <div className="parent__summary-card">
                        <span className="parent__summary-icon">🏔️</span>
                        <span className="parent__summary-value">{p.levelsCompleted.length}</span>
                        <span className="parent__summary-label">Levels Done</span>
                    </div>
                </div>

                {/* Chart-like bars */}
                <div className="parent__chart-card">
                    <h3>📊 Progress Overview</h3>
                    {this.renderStatBar('Correct Answers', p.correctAnswers, Math.max(p.totalAnswers, 1), '#B8E0D2')}
                    {this.renderStatBar('Stars Collected', p.stars, 50, '#FFF3B0')}
                    {this.renderStatBar('Levels Completed', p.levelsCompleted.length, 10, '#EAD7FF')}
                    {this.renderStatBar('Accuracy', accuracy, 100, '#A8DADC')}
                </div>

                {/* Badges */}
                {p.badges && p.badges.length > 0 && (
                    <div className="parent__chart-card">
                        <h3>🏆 Badges Earned</h3>
                        <div className="parent__badges">
                            {p.badges.map(badge => (
                                <div key={badge.id} className="parent__badge">
                                    <span className="parent__badge-icon">{badge.icon}</span>
                                    <span className="parent__badge-name">{badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Difficulty Adjustment */}
                <div className="parent__chart-card">
                    <h3>🎚️ Difficulty Adjustment</h3>
                    <div className="parent__difficulty" role="radiogroup" aria-label="Difficulty selection">
                        {['easy', 'medium', 'hard'].map(level => (
                            <button
                                key={level}
                                className={`settings__option ${this.state.difficulty === level ? 'settings__option--active' : ''}`}
                                onClick={() => this.handleDifficultyChange(level)}
                                role="radio"
                                aria-checked={this.state.difficulty === level}
                            >
                                {level === 'easy' ? '🌱 Easy' : level === 'medium' ? '🌿 Medium' : '🌳 Hard'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reset */}
                <div className="parent__reset">
                    <button
                        className="btn btn--ghost btn--small"
                        onClick={this.handleResetProgress}
                        aria-label="Reset all progress"
                    >
                        🗑️ Reset Progress
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="parent">
                {this.state.isAuthenticated ? this.renderDashboard() : this.renderPasswordScreen()}
            </div>
        );
    }
}

export default ParentDashboard;
