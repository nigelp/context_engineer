import React, { useState, useEffect } from 'react';
import { FiKey, FiExternalLink, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ApiKeyManager = ({ apiKey, onApiKeyChange }) => {
    const [inputKey, setInputKey] = useState('');
    const [isExpanded, setIsExpanded] = useState(!apiKey); // Auto-collapse if API key exists

    useEffect(() => {
        // Only update inputKey if it's different from current value to prevent clearing
        if (inputKey !== (apiKey || '')) {
            setInputKey(apiKey || '');
        }
        
        // Auto-collapse when API key is set
        if (apiKey && apiKey.trim() !== '') {
            setIsExpanded(false);
        } else {
            setIsExpanded(true);
        }
    }, [apiKey]); // Only depend on apiKey prop

    const handleSave = (e) => {
        e.preventDefault(); // Prevent form submission
        
        if (!inputKey.trim()) {
            toast.error('Please enter an API key');
            return;
        }
        
        if (!inputKey.startsWith('sk-or-v1-')) {
            toast.error('Invalid OpenRouter API key format. Should start with "sk-or-v1-"');
            return;
        }

        const trimmedKey = inputKey.trim();
        
        try {
            // Verify localStorage is available
            if (typeof Storage !== "undefined" && localStorage) {
                localStorage.setItem('openrouter_api_key', trimmedKey);
                
                // Verify the key was actually saved
                const savedKey = localStorage.getItem('openrouter_api_key');
                if (savedKey === trimmedKey) {
                    onApiKeyChange(trimmedKey);
                    toast.success('API key saved successfully!');
                    // Auto-collapse after saving
                    setTimeout(() => setIsExpanded(false), 1000);
                } else {
                    throw new Error('Failed to verify saved key');
                }
            } else {
                throw new Error('localStorage not available');
            }
        } catch (error) {
            console.error('Error saving API key:', error);
            toast.error('Failed to save API key. Please try again.');
        }
    };

    const handleClear = (e) => {
        e.preventDefault(); // Prevent form submission
        
        try {
            if (typeof Storage !== "undefined" && localStorage) {
                localStorage.removeItem('openrouter_api_key');
                setInputKey('');
                onApiKeyChange('');
                setIsExpanded(true); // Expand when cleared so user can enter new key
                toast.success('API key cleared');
            } else {
                throw new Error('localStorage not available');
            }
        } catch (error) {
            console.error('Error clearing API key:', error);
            toast.error('Failed to clear API key');
        }
    };

    const handleInputChange = (e) => {
        setInputKey(e.target.value);
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow mb-6">
            {/* Collapsible Header */}
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

            {/* Expandable Content */}
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 mt-3">
                        Your API key is stored locally in your browser and never sent to our servers.
                    </p>

                    <form onSubmit={handleSave} className="flex gap-2">
                        <input
                            type="password"
                            value={inputKey}
                            onChange={handleInputChange}
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

                    {!apiKey && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                <strong>Need an API key?</strong> Get one free at{' '}
                                <a
                                    href="https://openrouter.ai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:no-underline"
                                >
                                    OpenRouter.ai
                                </a>
                                {' '}to start using AI models.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApiKeyManager;
