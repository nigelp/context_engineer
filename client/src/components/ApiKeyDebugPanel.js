import React, { useState, useEffect } from 'react';
import { FiSettings, FiDownload, FiTrash2, FiRefreshCw } from 'react-icons/fi';

const ApiKeyDebugPanel = () => {
    const [debugLogs, setDebugLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(false);

    const loadLogs = () => {
        try {
            const logs = JSON.parse(sessionStorage.getItem('apiKeyDebugLogs') || '[]');
            setDebugLogs(logs);
        } catch (e) {
            console.error('Failed to load debug logs:', e);
        }
    };

    useEffect(() => {
        loadLogs();
        
        if (autoRefresh) {
            const interval = setInterval(loadLogs, 1000);
            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const clearLogs = () => {
        sessionStorage.removeItem('apiKeyDebugLogs');
        setDebugLogs([]);
    };

    const downloadLogs = () => {
        const logData = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            logs: debugLogs,
            localStorage: {
                available: typeof Storage !== "undefined" && localStorage,
                test: (() => {
                    try {
                        const testKey = 'test_' + Date.now();
                        localStorage.setItem(testKey, 'test');
                        const result = localStorage.getItem(testKey);
                        localStorage.removeItem(testKey);
                        return result === 'test';
                    } catch (e) {
                        return false;
                    }
                })(),
                apiKeyExists: (() => {
                    try {
                        return !!localStorage.getItem('openrouter_api_key');
                    } catch (e) {
                        return 'error: ' + e.message;
                    }
                })()
            }
        };

        const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-key-debug-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Keyboard shortcut to toggle debug panel
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ctrl+Shift+D to toggle debug panel
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                setIsVisible(v => !v);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 z-50"
                title="Show Debug Panel (Ctrl+Shift+D)"
            >
                <FiSettings size={20} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <FiSettings /> API Key Debug Panel
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`p-1 rounded ${autoRefresh ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}
                        title="Auto-refresh"
                    >
                        <FiRefreshCw size={16} className={autoRefresh ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={loadLogs}
                        className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        title="Refresh logs"
                    >
                        <FiRefreshCw size={16} />
                    </button>
                    <button
                        onClick={downloadLogs}
                        className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        title="Download logs"
                    >
                        <FiDownload size={16} />
                    </button>
                    <button
                        onClick={clearLogs}
                        className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                        title="Clear logs"
                    >
                        <FiTrash2 size={16} />
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 text-xs font-mono">
                {debugLogs.length === 0 ? (
                    <p className="text-gray-500">No debug logs yet. Try interacting with the API key input.</p>
                ) : (
                    <div className="space-y-2">
                        {debugLogs.map((log, index) => (
                            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                                <div className="text-gray-500">{log.timestamp}</div>
                                <div className="font-semibold text-blue-600 dark:text-blue-400">{log.action}</div>
                                {Object.keys(log.data).length > 0 && (
                                    <pre className="text-gray-700 dark:text-gray-300 overflow-x-auto">
                                        {JSON.stringify(log.data, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiKeyDebugPanel;