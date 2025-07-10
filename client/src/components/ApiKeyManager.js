import React, { useState, useEffect, useRef } from 'react';
import { FiKey, FiExternalLink, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import ApiKeyDiagnostics from './ApiKeyDiagnostics';

// Debug logging utility
const debugLog = (action, data = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        action,
        data,
        userAgent: navigator.userAgent,
        location: window.location.href,
        env: process.env.NODE_ENV
    };
    
    console.log(`[ApiKeyManager Debug] ${action}:`, logEntry);
    
    // Also store in sessionStorage for later retrieval
    try {
        const logs = JSON.parse(sessionStorage.getItem('apiKeyDebugLogs') || '[]');
        logs.push(logEntry);
        // Keep only last 50 logs
        if (logs.length > 50) logs.shift();
        sessionStorage.setItem('apiKeyDebugLogs', JSON.stringify(logs));
    } catch (e) {
        console.error('[ApiKeyManager Debug] Failed to store log:', e);
    }
};

// Fallback storage mechanism using sessionStorage and cookies
const FallbackStorage = {
    setItem: (key, value) => {
        try {
            // Try localStorage first
            if (localStorage) {
                localStorage.setItem(key, value);
                return true;
            }
        } catch (e) {
            debugLog('localStorage_failed', { error: e.message });
        }
        
        try {
            // Fallback to sessionStorage
            if (sessionStorage) {
                sessionStorage.setItem(key, value);
                debugLog('using_sessionStorage_fallback');
                return true;
            }
        } catch (e) {
            debugLog('sessionStorage_failed', { error: e.message });
        }
        
        try {
            // Last resort: cookies
            document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Strict`;
            debugLog('using_cookie_fallback');
            return true;
        } catch (e) {
            debugLog('cookie_failed', { error: e.message });
        }
        
        return false;
    },
    
    getItem: (key) => {
        try {
            // Try localStorage first
            if (localStorage) {
                const value = localStorage.getItem(key);
                if (value !== null) return value;
            }
        } catch (e) {
            debugLog('localStorage_read_failed', { error: e.message });
        }
        
        try {
            // Try sessionStorage
            if (sessionStorage) {
                const value = sessionStorage.getItem(key);
                if (value !== null) {
                    debugLog('retrieved_from_sessionStorage');
                    return value;
                }
            }
        } catch (e) {
            debugLog('sessionStorage_read_failed', { error: e.message });
        }
        
        try {
            // Try cookies
            const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
            if (match) {
                debugLog('retrieved_from_cookie');
                return decodeURIComponent(match[2]);
            }
        } catch (e) {
            debugLog('cookie_read_failed', { error: e.message });
        }
        
        return null;
    },
    
    removeItem: (key) => {
        try {
            if (localStorage) localStorage.removeItem(key);
        } catch (e) {}
        try {
            if (sessionStorage) sessionStorage.removeItem(key);
        } catch (e) {}
        try {
            document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
        } catch (e) {}
    }
};

const ApiKeyManager = ({ apiKey, onApiKeyChange }) => {
    const [inputKey, setInputKey] = useState('');
    const [isExpanded, setIsExpanded] = useState(!apiKey);
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [debugInfo, setDebugInfo] = useState({});
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    const [storageIssue, setStorageIssue] = useState(false);
    const typingTimeoutRef = useRef(null);
    const inputRef = useRef(null);
    const mountedRef = useRef(false);
    const pasteTimeoutRef = useRef(null);

    // Debug: Log component mount/unmount
    useEffect(() => {
        mountedRef.current = true;
        debugLog('component_mounted', { 
            initialApiKey: apiKey ? 'exists' : 'empty',
            localStorage: typeof Storage !== "undefined" ? 'available' : 'unavailable'
        });

        // Check browser capabilities
        const capabilities = {
            localStorage: typeof Storage !== "undefined" && localStorage,
            sessionStorage: typeof Storage !== "undefined" && sessionStorage,
            clipboard: navigator.clipboard ? 'available' : 'unavailable',
            userAgent: navigator.userAgent
        };
        debugLog('browser_capabilities', capabilities);
        setDebugInfo(capabilities);

        return () => {
            mountedRef.current = false;
            debugLog('component_unmounted');
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Debug: Log prop changes
    useEffect(() => {
        debugLog('apiKey_prop_changed', { 
            hasApiKey: !!apiKey,
            isUserTyping,
            inputKeyLength: inputKey.length
        });
    }, [apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        debugLog('effect_running', { 
            isUserTyping, 
            apiKeyExists: !!apiKey,
            inputKeyLength: inputKey.length,
            mountedRef: mountedRef.current
        });

        // Only update inputKey if apiKey changes and user is not actively typing
        if (!isUserTyping && mountedRef.current) {
            const newValue = apiKey || '';
            debugLog('updating_inputKey_from_prop', { 
                oldValue: inputKey.length,
                newValue: newValue.length 
            });
            setInputKey(newValue);
        }
        
        // Auto-collapse when API key is set
        if (apiKey && apiKey.trim() !== '') {
            setIsExpanded(false);
        } else if (!isUserTyping) {
            setIsExpanded(true);
        }
    }, [apiKey, isUserTyping]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSave = (e) => {
        debugLog('handleSave_triggered', { 
            eventType: e?.type,
            inputKeyLength: inputKey.length 
        });
        
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        if (!inputKey.trim()) {
            debugLog('save_failed_empty_key');
            toast.error('Please enter an API key');
            return;
        }
        
        if (!inputKey.startsWith('sk-or-v1-')) {
            debugLog('save_failed_invalid_format', { firstChars: inputKey.substring(0, 10) });
            toast.error('Invalid OpenRouter API key format. Should start with "sk-or-v1-"');
            return;
        }

        const trimmedKey = inputKey.trim();
        debugLog('attempting_save', { keyLength: trimmedKey.length });
        
        try {
            // Test localStorage multiple ways
            if (typeof Storage === "undefined") {
                throw new Error('Storage API not defined');
            }
            
            if (!localStorage) {
                throw new Error('localStorage object not available');
            }
            
            // Test localStorage operations
            const testKey = 'test_' + Date.now();
            localStorage.setItem(testKey, 'test');
            const testValue = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (testValue !== 'test') {
                throw new Error('localStorage test failed');
            }
            
            debugLog('localStorage_test_passed');
            
            // Save the actual key using fallback mechanism
            const saveResult = FallbackStorage.setItem('openrouter_api_key', trimmedKey);
            debugLog('storage_setItem_called', { success: saveResult });
            
            if (!saveResult) {
                throw new Error('All storage mechanisms failed');
            }
            
            // Verify the key was actually saved
            const savedKey = FallbackStorage.getItem('openrouter_api_key');
            debugLog('storage_getItem_result', {
                saved: !!savedKey,
                matches: savedKey === trimmedKey
            });
            
            if (savedKey === trimmedKey) {
                // Clear timeout and reset typing flag
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                setIsUserTyping(false);
                
                // Call the callback
                debugLog('calling_onApiKeyChange');
                onApiKeyChange(trimmedKey);
                
                toast.success('API key saved successfully!');
                debugLog('save_successful');
                
                // Auto-collapse after saving
                setTimeout(() => {
                    if (mountedRef.current) {
                        setIsExpanded(false);
                    }
                }, 1000);
            } else {
                throw new Error(`Failed to verify saved key. Expected: ${trimmedKey.length} chars, Got: ${savedKey ? savedKey.length : 0} chars`);
            }
        } catch (error) {
            debugLog('save_error', { 
                error: error.message,
                stack: error.stack,
                localStorage: typeof localStorage,
                storageAPI: typeof Storage
            });
            console.error('Error saving API key:', error);
            toast.error(`Failed to save API key: ${error.message}`);
        }
    };

    const handleClear = (e) => {
        debugLog('handleClear_triggered');
        
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        
        try {
            FallbackStorage.removeItem('openrouter_api_key');
            setInputKey('');
            onApiKeyChange('');
            
            // Clear timeout and reset typing flag
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            setIsUserTyping(false);
            setIsExpanded(true);
            
            debugLog('clear_successful');
            toast.success('API key cleared');
        } catch (error) {
            debugLog('clear_error', { error: error.message });
            console.error('Error clearing API key:', error);
            toast.error('Failed to clear API key');
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        debugLog('handleInputChange', { 
            eventType: e.type,
            valueLength: value.length,
            isUserTyping: true 
        });
        
        setInputKey(value);
        setIsUserTyping(true);
        
        // Clear any existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Set a new timeout to clear the typing flag
        typingTimeoutRef.current = setTimeout(() => {
            debugLog('typing_timeout_fired', { isUserTyping: false });
            setIsUserTyping(false);
        }, 2000); // Increased timeout for better debugging
    };

    // Enhanced paste event handler
    const handlePaste = (e) => {
        debugLog('paste_event', {
            clipboardDataAvailable: !!e.clipboardData,
            dataTypes: e.clipboardData ? [...e.clipboardData.types] : [],
            defaultPrevented: e.defaultPrevented,
            currentValue: inputKey.length
        });
        
        // Don't preventDefault - let the browser handle the paste naturally
        // But set typing flag immediately
        setIsUserTyping(true);
        
        try {
            const pastedText = e.clipboardData?.getData('text/plain') || '';
            debugLog('paste_content_received', {
                length: pastedText.length,
                startsWithExpected: pastedText.startsWith('sk-or-v1-')
            });
            
            // Clear any existing paste timeout
            if (pasteTimeoutRef.current) {
                clearTimeout(pasteTimeoutRef.current);
            }
            
            // Use a timeout to ensure the paste completes before we process
            pasteTimeoutRef.current = setTimeout(() => {
                debugLog('paste_timeout_fired', {
                    inputValueLength: inputRef.current?.value?.length || 0
                });
                
                // Double-check the input value after paste
                if (inputRef.current && inputRef.current.value) {
                    const currentValue = inputRef.current.value;
                    if (currentValue !== inputKey) {
                        debugLog('paste_value_mismatch_correcting', {
                            stateLength: inputKey.length,
                            domLength: currentValue.length
                        });
                        setInputKey(currentValue);
                    }
                }
                
                // Extended typing timeout for paste operations
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => {
                    setIsUserTyping(false);
                }, 3000); // Longer timeout for paste
            }, 100);
        } catch (error) {
            debugLog('paste_error', { error: error.message });
        }
    };

    // Add focus/blur handlers for debugging
    const handleFocus = () => {
        debugLog('input_focused');
    };

    const handleBlur = () => {
        debugLog('input_blurred', { 
            currentValue: inputKey.length,
            isUserTyping 
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow mb-6">
            {/* Debug Info Display (only in development or when there's an issue) */}
            {process.env.NODE_ENV === 'development' || debugInfo.error ? (
                <div className="p-2 bg-gray-100 dark:bg-gray-800 text-xs">
                    <details>
                        <summary className="cursor-pointer">Debug Info</summary>
                        <pre className="mt-2 overflow-auto">
                            {JSON.stringify({
                                ...debugInfo,
                                inputKeyLength: inputKey.length,
                                isUserTyping,
                                isExpanded,
                                hasApiKey: !!apiKey
                            }, null, 2)}
                        </pre>
                    </details>
                </div>
            ) : null}

            {/* Collapsible Header */}
            <button
                type="button"
                onClick={() => {
                    debugLog('header_clicked', { currentExpanded: isExpanded });
                    setIsExpanded(!isExpanded);
                }}
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
                    {/* Show diagnostics if there's a storage issue */}
                    {(storageIssue || showDiagnostics) && (
                        <div className="mt-3">
                            <ApiKeyDiagnostics
                                onDiagnosticsComplete={(results) => {
                                    const hasStorageIssue = results.some(r =>
                                        r.test.includes('localStorage') && r.status === 'fail'
                                    );
                                    setStorageIssue(hasStorageIssue);
                                }}
                            />
                        </div>
                    )}

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 mt-3">
                        Your API key is stored locally in your browser and never sent to our servers.
                    </p>

                    <form onSubmit={handleSave} className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="password"
                            value={inputKey}
                            onChange={handleInputChange}
                            onPaste={handlePaste}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder="sk-or-v1-..."
                            className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none transition-all font-mono text-sm"
                        />
                        
                        <button
                            type="submit"
                            onClick={(e) => {
                                debugLog('save_button_clicked');
                                handleSave(e);
                            }}
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

                    {/* Diagnostic toggle button */}
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
