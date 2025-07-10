import React, { useState } from 'react';
import { FiChevronDown, FiStar } from 'react-icons/fi';

const ModelSelector = ({ selectedModel, onModelChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const modelsByProvider = {
        'Anthropic': [
            { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Most capable, balanced performance', popular: true },
            { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', description: 'Fastest Claude model', popular: true },
            { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', description: 'Highest intelligence, complex reasoning' },
            { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced speed and capability' },
            { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast and efficient' },
        ],
        'OpenAI': [
            { id: 'openai/o1-pro', name: 'o1-pro', description: 'Advanced reasoning model', popular: true },
            { id: 'openai/o1-mini', name: 'o1-mini', description: 'Efficient reasoning model', popular: true },
            { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'Latest multimodal model' },
            { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and cost-effective' },
            { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High performance, large context' },
            { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
        ],
        'Google': [
            { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Latest Gemini model', popular: true },
            { id: 'google/gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash', description: 'Fast multimodal model', popular: true },
            { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', description: 'Advanced reasoning and analysis' },
            { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', description: 'Fast and efficient' },
            { id: 'google/gemma-2-9b-it', name: 'Gemma 2 9B', description: 'Open model from Google', free: true },
        ],
        'DeepSeek': [
            { id: 'deepseek/deepseek-r1', name: 'DeepSeek R1', description: 'Latest reasoning model', popular: true },
            { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', description: 'Advanced conversational AI' },
            { id: 'deepseek/deepseek-coder', name: 'DeepSeek Coder', description: 'Specialized coding model' },
            { id: 'deepseek/deepseek-v3', name: 'DeepSeek V3', description: 'High-performance model' },
        ],
        'Qwen': [
            { id: 'qwen/qwq-32b-preview', name: 'QWQ-32B Preview', description: 'Advanced reasoning preview', popular: true },
            { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', description: 'Large instruction model' },
            { id: 'qwen/qwen-2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B', description: 'Specialized coding model' },
            { id: 'qwen/qwen-2.5-14b-instruct', name: 'Qwen 2.5 14B', description: 'Efficient instruction model' },
        ],
        'Meta': [
            { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', description: 'Latest Llama model', popular: true },
            { id: 'meta-llama/llama-3.1-405b-instruct', name: 'Llama 3.1 405B', description: 'Largest open model' },
            { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', description: 'High performance open model' },
            { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', description: 'Efficient open model', free: true },
        ],
        'Mistral': [
            { id: 'mistralai/mistral-large-2407', name: 'Mistral Large 2407', description: 'Latest flagship model', popular: true },
            { id: 'mistralai/mixtral-8x7b-instruct', name: 'Mixtral 8x7B', description: 'Mixture of experts model' },
            { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', description: 'Efficient and capable', free: true },
        ],
        'Free Models': [
            { id: 'microsoft/phi-3-mini-4k-instruct', name: 'Phi-3 Mini 4K', description: 'Small efficient model', free: true },
            { id: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo', name: 'Nous Hermes 2 Mixtral', description: 'Fine-tuned for conversations', free: true },
            { id: 'openchat/openchat-7b', name: 'OpenChat 7B', description: 'Open conversational model', free: true },
            { id: 'huggingfaceh4/zephyr-7b-beta', name: 'Zephyr 7B Beta', description: 'Helpful assistant model', free: true },
            { id: 'cognitivecomputations/dolphin-2.6-mixtral-8x7b', name: 'Dolphin 2.6 Mixtral', description: 'Uncensored model', free: true },
        ],
        'Other': [
            { id: '01-ai/yi-lightning', name: 'Yi Lightning', description: 'Ultra-fast Chinese model', popular: true },
            { id: 'cohere/command-r-plus', name: 'Command R+', description: 'Advanced reasoning and RAG' },
            { id: 'perplexity/llama-3.1-sonar-large-128k-online', name: 'Sonar Large Online', description: 'Web-connected model' },
        ]
    };

    // Flatten models for easy lookup
    const allModels = Object.entries(modelsByProvider).flatMap(([provider, models]) =>
        models.map(model => ({ ...model, provider }))
    );

    const selectedModelData = allModels.find(model => model.id === selectedModel) || allModels[0];

    return (
        <div className="relative">
            <label className="block text-sm font-medium mb-2">Select AI Model</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 rounded-lg bg-white dark:bg-slate-800/50 border border-gray-300 dark:border-gray-600 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-medium">{selectedModelData.name}</span>
                            {selectedModelData.popular && <FiStar size={12} className="text-accent-aqua" />}
                            {selectedModelData.free && (
                                <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded font-medium">
                                    FREE
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">{selectedModelData.provider}</div>
                    </div>
                </div>
                <FiChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                        {Object.entries(modelsByProvider).map(([provider, models]) => (
                            <div key={provider}>
                                {/* Provider Header */}
                                <div className="px-3 py-2 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {provider}
                                </div>
                                
                                {/* Provider Models */}
                                {models.map((model) => (
                                    <button
                                        key={model.id}
                                        onClick={() => {
                                            onModelChange(model.id);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                                            selectedModel === model.id ? 'bg-accent-aqua/10 text-accent-aqua' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium">{model.name}</span>
                                                    {model.popular && <FiStar size={12} className="text-accent-aqua" />}
                                                    {model.free && (
                                                        <span className="bg-green-500 text-white text-xs px-1 py-0.5 rounded font-medium">
                                                            FREE
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5">{model.description}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ModelSelector;
