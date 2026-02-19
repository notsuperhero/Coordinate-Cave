import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { GameProvider } from './context/GameContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import FocusManager from './components/FocusManager';
import './index.css';

// Lazy loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Learn = lazy(() => import('./pages/Learn'));
const Play = lazy(() => import('./pages/Play'));
const Settings = lazy(() => import('./pages/Settings'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));

function LoadingFallback() {
    return (
        <div className="loading-fallback" role="status" aria-label="Loading page">
            <div className="loading-fallback__spinner" aria-hidden="true">🦇</div>
            <p>Exploring the cave...</p>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <GameProvider>
                    <ErrorBoundary>
                        <Router>
                            <FocusManager />
                            <div className="app-container">
                                <Navbar />
                                <main id="main-content" className="app-main" tabIndex={-1}>
                                    <Suspense fallback={<LoadingFallback />}>
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/learn" element={<Learn />} />
                                            <Route path="/play" element={<Play />} />
                                            <Route path="/settings" element={<Settings />} />
                                            <Route path="/parent" element={<ParentDashboard />} />
                                        </Routes>
                                    </Suspense>
                                </main>
                            </div>
                        </Router>
                    </ErrorBoundary>
                </GameProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
}

export default App;
