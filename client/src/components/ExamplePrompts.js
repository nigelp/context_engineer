import React, { useState, useRef, useEffect } from 'react';

const ExamplePrompts = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const prompts = {
    "Coding": {
      "name": "Python Function Expert",
      "persona": "An expert in Python and data structures, specializing in writing clean, efficient, and well-documented code.",
      "initialPrompt": "Create a Python function to find the second largest number in a list of integers.",
      "backgroundContext": "The function will be part of a utility library for a high-performance data analysis application. It must be robust, handle all edge cases, and be highly performant.",
      "examples": [
        { "input": "[10, 5, 8, 20]", "output": "10" },
        { "input": "[5, 5, 5, 5]", "output": "None" }
      ],
      "outputFormat": "Provide only the Python code for the function, including a comprehensive docstring explaining its purpose, parameters, return value, and any exceptions raised. The code should be formatted according to PEP 8 standards.",
      "rules": [
        "The function must not use any built-in sorting functions (e.g., `sorted()`, `list.sort()`).",
        "The solution must have a time complexity of O(n).",
        "It must handle lists with fewer than two unique elements by returning `None`.",
        "The implementation should be a single function that takes a list of integers as input."
      ]
    },
    "Financial": {
      "name": "Financial Analyst Expert",
      "persona": "A certified financial analyst with 15 years of experience in portfolio risk assessment for retail clients.",
      "initialPrompt": "Analyze the risk profile of the provided stock portfolio and provide recommendations.",
      "backgroundContext": "The analysis is for a risk-averse client nearing retirement. The primary goal is capital preservation, with a secondary goal of modest growth. The client has a low tolerance for volatility.",
      "examples": [
        { "input": "Portfolio: 70% Tech Stocks (e.g., NVDA, META), 30% Bonds", "output": "High concentration in the volatile tech sector. Significant market risk. Recommend diversifying into healthcare and consumer staples." }
      ],
      "outputFormat": "Start with a one-paragraph summary of the overall risk. Follow this with a bulleted list of key risk factors. Conclude with a numbered list of actionable recommendations to mitigate these risks. The tone should be professional, clear, and reassuring.",
      "rules": [
        "Prioritize risk mitigation over aggressive growth opportunities.",
        "All recommendations must be clearly justified with respect to the client's risk profile.",
        "Use plain language and avoid jargon where possible.",
        "Conclude with an overall risk rating: Low, Medium, or High."
      ]
    },
    "Creative Writing": {
      "name": "Creative Writing Expert",
      "persona": "An expert writer, specializing in humor and satire.",
      "initialPrompt": "Write a short story about ducks.",
      "backgroundContext": "The story will be entered into a humor competition. The judges appreciate witty, character-driven narratives.",
      "examples": [
        { "input": "Jack the duck was not a happy chappie.", "output": "His beak was the wrong color, his tail drooped, and all the pigeons were making fun of him." }
      ],
      "outputFormat": "Write in a funny, simple way. The story should have a clear beginning, middle, and end, with a title.",
      "rules": [
        "Use only British English.",
        "Avoid cliches.",
        "Think like Douglas Adams or Terry Pratchett."
      ]
    }
  };

  const handleSelect = (prompt) => {
    onSelect(prompts[prompt]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          Example Prompts
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black dark:ring-slate-700 ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {Object.keys(prompts).map((prompt) => (
              <button
                key={prompt}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                role="menuitem"
                onClick={() => handleSelect(prompt)}
              >
                {prompts[prompt].name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamplePrompts;
