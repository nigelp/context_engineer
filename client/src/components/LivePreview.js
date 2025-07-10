
import React from 'react';
import { FiCopy, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const assembleContext = (context) => {
    let assembled = '';
    
    if (context.persona) {
        assembled += `Persona: ${context.persona}\n\n`;
    }
    
    if (context.initialPrompt) {
        assembled += `Initial Prompt: ${context.initialPrompt}\n\n`;
    }
    
    if (context.backgroundContext) {
        assembled += `Background Context:\n${context.backgroundContext}\n\n`;
    }
    
    if (context.examples && context.examples.length > 0) {
        assembled += "Examples:\n";
        context.examples.forEach((example, index) => {
            if (example.input || example.output) {
                assembled += `${index + 1}. Input: ${example.input}\n   Output: ${example.output}\n`;
            }
        });
        assembled += "\n";
    }
    
    if (context.outputFormat) {
        assembled += `Output Format: ${context.outputFormat}\n\n`;
    }
    
    if (context.rules && context.rules.length > 0) {
        assembled += "Rules to follow:\n";
        context.rules.forEach((rule, index) => {
            if (rule.trim()) {
                assembled += `${index + 1}. ${rule}\n`;
            }
        });
    }
    
    return assembled.trim() || 'Your engineered context will appear here in real-time.';
};

const LivePreview = ({ context, selectedModel, onSendToModel }) => {
    const assembledContext = assembleContext(context);
    
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(assembledContext);
            toast.success('Context copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy to clipboard');
        }
    };

    const handleSendToModel = () => {
        if (!context.persona && !context.initialPrompt) {
            toast.error('Please add at least a persona or initial prompt');
            return;
        }
        onSendToModel();
    };

    return (
        <div className="sticky top-24">
            <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                            title="Copy to clipboard"
                        >
                            <FiCopy size={14} />
                            Copy
                        </button>
                        <button
                            onClick={handleSendToModel}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-accent-aqua hover:bg-accent-aqua/80 text-white rounded transition-colors"
                            title="Send to model"
                        >
                            <FiSend size={14} />
                            Send
                        </button>
                    </div>
                </div>
                
                <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                    Model: <span className="font-medium">{selectedModel}</span>
                </div>
                
                <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto border border-gray-300 dark:border-gray-600">
                    {assembledContext}
                </pre>
            </div>
        </div>
    );
};

export default LivePreview;
