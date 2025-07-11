import React, { useState, useEffect } from 'react';
import { FiKey, FiExternalLink, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ApiKeyDiagnostics from './ApiKeyDiagnostics';

const ApiKeyManager = ({ apiKey, onApiKeyChange }) => {
    const [inputKey, setInputKey] = useState(apiKey || '');
    const [isExpanded, setIsExpanded] = useState(!apiKey);
    const [showDiagnostics, setShowDiagnostics] = useState(false);

    useEffect(() => {
        setInputKey(apiKey || '');
        if (apiKey) {
            setIsExpanded(false);
        }
    }, [apiKey]);

    const handleSave = (e) => {
        e.preventDefault();
        if (!inputKey.trim().startsWith('sk-or-v1-')) {
            toast.error('Invalid OpenRouter API key format.');
            return;
        }
        const trimmedKey = inputKey.trim();
        onApiKeyChange(trimmedKey);
        toast.success('API key saved!');
        setIsExpanded(false);
    };

    const handleClear = (e) => {
        e.preventDefault();
        onApiKeyChange('');
        setInputKey('');
        toast.success('API key cleared.');
        setIsExpanded(true);
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow mb-6">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors rounded-lg"
            >
                <div className="flex items-center gap-2">
                    <FiKey className="text-accent-aqua" size={18} />
                    <h3 className="text-lg font-semibold">OpenRouter API Key</h3>
                    {apiKey && (
                        <div className="flex items-center gap-1 text-green-500">
                            <FiCheck size={16} />
                            <span className="text-sm">Configured</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="https://openrouter.ai/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-aqua hover:text-accent-aqua/80 transition-colors"
                        title="Get your API key from OpenRouter"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FiExternalLink size={14} />
                    </a>
                    {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </div>
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                     {showDiagnostics && (
                        <div className="mt-3">
                           <ApiKeyDiagnostics />
                        </div>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 mt-3">
                        Your API key is stored locally in your browser.
                    </p>
                    <form onSubmit={handleSave} className="flex gap-2">
                        <input
                            type="password"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            placeholder="sk-or-v1-..."
                            className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none transition-all font-mono text-sm"
                        />
                        <button
                            type="submit"
                            className="px-4 py-3 bg-accent-aqua hover:bg-accent-aqua/80 text-white rounded-lg transition-colors font-medium"
                        >
                            Save
                        </button>
                        {apiKey && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                    <div className="mt-3 text-center">
                        <button
                            type="button"
                            onClick={() => setShowDiagnostics(!showDiagnostics)}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            {showDiagnostics ? 'Hide' : 'Show'} Storage Diagnostics
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApiKeyManager;
