import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { FiSun, FiMoon, FiLoader, FiCopy } from 'react-icons/fi';
import axios from 'axios';
import ContextBuilder from './components/ContextBuilder';
import LivePreview from './components/LivePreview';
import ModelSelector from './components/ModelSelector';
import ApiKeyManager from './components/ApiKeyManager';
import { storage } from './utils/storage'; // Import storage utility

function App() {
  const [theme, setTheme] = useState('dark');
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const [apiKey, setApiKey] = useState('');
  const [context, setContext] = useState({
    persona: '',
    initialPrompt: '',
    backgroundContext: '',
    examples: [],
    outputFormat: '',
    rules: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  // Storage initialization check effect
  useEffect(() => {
    try {
      const testKey = '__storage_test__';
      storage.setItem(testKey, testKey);
      if (storage.getItem(testKey) !== testKey) {
        console.warn('Storage availability test failed. API key might not be saved.');
        toast.error('Your browser storage seems to be disabled. API key cannot be saved.', { duration: 6000 });
      }
      storage.removeItem(testKey);
    } catch (e) {
      console.error('Storage initialization check failed:', e);
      toast.error('Could not access browser storage. API key cannot be saved.', { duration: 6000 });
    }
  }, []);

  // Load API Key from storage on initial render
  useEffect(() => {
    const savedApiKey = storage.getItem('openrouter_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (newApiKey) => {
    if (newApiKey) {
      storage.setItem('openrouter_api_key', newApiKey);
    } else {
      storage.removeItem('openrouter_api_key');
    }
    setApiKey(newApiKey);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSendToModel = async () => {
    if (!apiKey) {
      toast.error('Please enter your OpenRouter API key first');
      return;
    }

    if (!context.persona && !context.initialPrompt) {
      toast.error('Please add at least a persona or initial prompt');
      return;
    }

    setIsLoading(true);
    setResponse(null);

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
      
      return assembled.trim();
    };

    try {
      const assembledPrompt = assembleContext(context);
      
      const result = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: selectedModel,
        messages: [
          { role: 'user', content: assembledPrompt }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Context Engineer'
        }
      });

      setResponse(result.data);
      toast.success('Response received successfully!');
    } catch (error) {
      console.error('Error sending to model:', error);
      const errorMessage = error.response?.data?.error?.message ||
                          error.response?.data?.error ||
                          'Failed to get response from model';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponseToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Response copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className={`${theme} font-sans bg-slate-50 dark:bg-slate-900 text-gray-800 dark:text-slate-100 min-h-screen`}>
      <Toaster position="top-right" />
      
      <header className="bg-slate-light/80 dark:bg-slate-dark/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-aqua to-blue-300 bg-clip-text">
            Context Engineer
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-7xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Build Your Perfect AI Context</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Engineer precise prompts by defining personas, examples, and constraints for optimal AI responses.
          </p>
        </div>

        <ApiKeyManager
          apiKey={apiKey}
          onApiKeyChange={handleApiKeyChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
            <ContextBuilder
              context={context}
              onChange={setContext}
            />
          </div>

          <div className="lg:col-span-1">
            <LivePreview
              context={context}
              selectedModel={selectedModel}
              onSendToModel={handleSendToModel}
            />
          </div>
        </div>

        {isLoading && (
          <div className="mt-6 bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow text-center">
            <FiLoader className="animate-spin mx-auto mb-2" size={24} />
            <p>Generating response...</p>
          </div>
        )}

        {response && (
          <div className="mt-6 bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">AI Response</h3>
              <button
                onClick={() => copyResponseToClipboard(response.choices?.[0]?.message?.content || '')}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                title="Copy response to clipboard"
              >
                <FiCopy size={14} />
                Copy
              </button>
            </div>
            <div className="space-y-4">
              {response.choices?.map((choice, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative">
                  <button
                    onClick={() => copyResponseToClipboard(choice.message?.content || '')}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Copy this response"
                  >
                    <FiCopy size={14} />
                  </button>
                  <pre className="whitespace-pre-wrap text-sm pr-8">
                    {choice.message?.content || 'No content received'}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
     </main>

     <footer className="bg-slate-800 dark:bg-slate-900 border-t border-slate-700 dark:border-slate-800 mt-12">
       <div className="container mx-auto px-4" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
         <div className="text-center text-slate-400 dark:text-slate-500">
           <div className="mb-8">
             <h3 className="text-lg font-semibold text-slate-300 dark:text-slate-400 mb-2">
               Context Engineer
             </h3>
             <p className="text-sm">
               Build precise AI prompts with structured context engineering
             </p>
           </div>
           <div className="text-xs opacity-75">
             <p>Hover over any ℹ️ icon above for detailed guidance and examples</p>
           </div>
         </div>
       </div>
       <div className="bg-slate-900 dark:bg-slate-950 py-4">
         <div className="container mx-auto px-4 text-center text-xs text-slate-500">
           © 2025 Context Engineer. Engineered for optimal AI interactions. <br /> Inspired by Andrej Karpathy and this repo - https://github.com/davidkimai/Context-Engineering
         </div>
       </div>
     </footer>
   </div>
  );
}

export default App;
