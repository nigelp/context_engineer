import React, { useEffect, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ApiKeyDiagnostics = ({ onDiagnosticsComplete }) => {
    const [diagnostics, setDiagnostics] = useState({
        loading: true,
        results: []
    });

    useEffect(() => {
        const runDiagnostics = async () => {
            const results = [];

            // Test 1: localStorage availability
            try {
                if (typeof Storage === "undefined") {
                    throw new Error('Storage API not defined');
                }
                if (!localStorage) {
                    throw new Error('localStorage not available');
                }
                results.push({
                    test: 'localStorage availability',
                    status: 'pass',
                    details: 'localStorage is available'
                });
            } catch (e) {
                results.push({
                    test: 'localStorage availability',
                    status: 'fail',
                    details: e.message
                });
            }

            // Test 2: localStorage operations
            try {
                const testKey = 'diagnostic_test_' + Date.now();
                const testValue = 'test_value_' + Math.random();
                localStorage.setItem(testKey, testValue);
                const retrieved = localStorage.getItem(testKey);
                localStorage.removeItem(testKey);
                
                if (retrieved !== testValue) {
                    throw new Error('Value mismatch');
                }
                
                results.push({
                    test: 'localStorage read/write',
                    status: 'pass',
                    details: 'Can read and write to localStorage'
                });
            } catch (e) {
                results.push({
                    test: 'localStorage read/write',
                    status: 'fail',
                    details: `Failed: ${e.message}`
                });
            }

            // Test 3: Check for existing API key
            try {
                const existingKey = localStorage.getItem('openrouter_api_key');
                results.push({
                    test: 'Existing API key',
                    status: existingKey ? 'info' : 'warning',
                    details: existingKey ? `Found key (${existingKey.length} chars)` : 'No existing key found'
                });
            } catch (e) {
                results.push({
                    test: 'Existing API key',
                    status: 'fail',
                    details: `Error checking: ${e.message}`
                });
            }

            // Test 4: Check for Service Worker
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                results.push({
                    test: 'Service Worker',
                    status: registrations.length > 0 ? 'info' : 'pass',
                    details: registrations.length > 0 
                        ? `${registrations.length} service worker(s) registered` 
                        : 'No service workers'
                });
            }

            // Test 5: Check clipboard API
            try {
                if (!navigator.clipboard) {
                    throw new Error('Clipboard API not available');
                }
                results.push({
                    test: 'Clipboard API',
                    status: 'pass',
                    details: 'Clipboard API is available'
                });
            } catch (e) {
                results.push({
                    test: 'Clipboard API',
                    status: 'warning',
                    details: `Limited: ${e.message}`
                });
            }

            // Test 6: Check for Content Security Policy
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta) {
                results.push({
                    test: 'Content Security Policy',
                    status: 'warning',
                    details: `CSP found: ${cspMeta.content.substring(0, 50)}...`
                });
            } else {
                results.push({
                    test: 'Content Security Policy',
                    status: 'pass',
                    details: 'No restrictive CSP meta tag found'
                });
            }

            // Test 7: Check browser info
            results.push({
                test: 'Browser Info',
                status: 'info',
                details: `${navigator.userAgent.substring(0, 50)}...`
            });

            // Test 8: Check for third-party cookie blocking
            try {
                document.cookie = "test_cookie=1; SameSite=Lax";
                const cookieEnabled = document.cookie.includes("test_cookie");
                document.cookie = "test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                
                results.push({
                    test: 'Cookies/Storage',
                    status: cookieEnabled ? 'pass' : 'warning',
                    details: cookieEnabled ? 'Cookies enabled' : 'Cookies might be blocked'
                });
            } catch (e) {
                results.push({
                    test: 'Cookies/Storage',
                    status: 'warning',
                    details: 'Could not test cookie access'
                });
            }

            // Test 9: Check React environment
            results.push({
                test: 'Environment',
                status: 'info',
                details: `NODE_ENV: ${process.env.NODE_ENV}`
            });

            setDiagnostics({
                loading: false,
                results
            });

            if (onDiagnosticsComplete) {
                onDiagnosticsComplete(results);
            }
        };

        runDiagnostics();
    }, [onDiagnosticsComplete]);

    if (diagnostics.loading) {
        return (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm">Running diagnostics...</p>
            </div>
        );
    }

    const hasFailures = diagnostics.results.some(r => r.status === 'fail');
    const hasWarnings = diagnostics.results.some(r => r.status === 'warning');

    return (
        <div className={`p-4 rounded-lg ${
            hasFailures ? 'bg-red-50 dark:bg-red-900/20' : 
            hasWarnings ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
            'bg-green-50 dark:bg-green-900/20'
        }`}>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
                {hasFailures ? <FiXCircle className="text-red-500" /> : 
                 hasWarnings ? <FiAlertTriangle className="text-yellow-500" /> : 
                 <FiCheckCircle className="text-green-500" />}
                Storage Diagnostics
            </h4>
            
            <div className="space-y-2 text-sm">
                {diagnostics.results.map((result, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <span className={`mt-0.5 ${
                            result.status === 'pass' ? 'text-green-500' : 
                            result.status === 'fail' ? 'text-red-500' : 
                            result.status === 'warning' ? 'text-yellow-500' : 
                            'text-blue-500'
                        }`}>
                            {result.status === 'pass' ? '✓' : 
                             result.status === 'fail' ? '✗' : 
                             result.status === 'warning' ? '⚠' : 
                             'ℹ'}
                        </span>
                        <div className="flex-1">
                            <span className="font-medium">{result.test}:</span>{' '}
                            <span className="text-gray-600 dark:text-gray-400">{result.details}</span>
                        </div>
                    </div>
                ))}
            </div>

            {hasFailures && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded">
                    <p className="text-sm text-red-800 dark:text-red-200">
                        <strong>Critical issues detected!</strong> localStorage access appears to be blocked. 
                        This might be due to browser privacy settings, incognito mode, or third-party cookie blocking.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ApiKeyDiagnostics;