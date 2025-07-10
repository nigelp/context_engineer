
import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiInfo } from 'react-icons/fi';

const Tooltip = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help"
            >
                {children}
            </div>
            {isVisible && (
                <div className="absolute z-50 w-96 lg:w-[1100px] p-4 bg-white dark:bg-slate-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg text-sm top-6 left-6 lg:left-0 lg:transform lg:-translate-x-0">
                    <div className="whitespace-pre-line text-gray-700 dark:text-gray-200 lg:columns-2 lg:gap-6">
                        {content}
                    </div>
                    <div className="absolute -top-2 left-6 lg:left-12 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300 dark:border-b-gray-600"></div>
                </div>
            )}
        </div>
    );
};

const Section = ({ title, tooltip, children }) => (
    <div className="bg-white dark:bg-slate-800/50 p-4 rounded-lg shadow mb-4">
        <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {tooltip && (
                <div className="ml-2 text-gray-400 hover:text-accent-aqua dark:hover:text-accent-aqua transition-colors">
                    <Tooltip content={tooltip}>
                        <FiInfo size={16} />
                    </Tooltip>
                </div>
            )}
        </div>
        {children}
    </div>
);

const ContextBuilder = ({ context, onChange }) => {
    const [examples, setExamples] = useState(context.examples || []);
    const [rules, setRules] = useState(context.rules || []);

    const updateContext = (field, value) => {
        onChange({ ...context, [field]: value });
    };

    const addExample = () => {
        const newExamples = [...examples, { input: '', output: '' }];
        setExamples(newExamples);
        updateContext('examples', newExamples);
    };

    const removeExample = (index) => {
        const newExamples = examples.filter((_, i) => i !== index);
        setExamples(newExamples);
        updateContext('examples', newExamples);
    };

    const updateExample = (index, field, value) => {
        const newExamples = [...examples];
        newExamples[index][field] = value;
        setExamples(newExamples);
        updateContext('examples', newExamples);
    };

    const addRule = () => {
        const newRules = [...rules, ''];
        setRules(newRules);
        updateContext('rules', newRules);
    };

    const removeRule = (index) => {
        const newRules = rules.filter((_, i) => i !== index);
        setRules(newRules);
        updateContext('rules', newRules);
    };

    const updateRule = (index, value) => {
        const newRules = [...rules];
        newRules[index] = value;
        setRules(newRules);
        updateContext('rules', newRules);
    };

    return (
        <div className="space-y-4">
            <Section title="Persona" tooltip={`Define the specific role, expertise level, and character the AI should embody when responding to your prompts.

🎯 PURPOSE: Sets the AI's identity and expertise level
🔑 KEY ELEMENTS: Role, experience level, specialization, tone

📝 EXAMPLES:
• "You are a senior software engineer with 15 years of experience in Python and machine learning"
• "Act as a professional copywriter specializing in marketing emails for SaaS companies"
• "You are a patient elementary school teacher explaining complex topics to 8-year-olds"
• "Respond as a experienced financial advisor who specializes in retirement planning"

💡 TIPS:
- Be specific about expertise level (junior, senior, expert, etc.)
- Include relevant specializations or domains
- Consider the tone you want (professional, casual, patient, etc.)
- Think about the perspective that would be most helpful for your task`}>
                <p className="text-sm text-gray-500 mb-2">Define the role or persona the AI should adopt.</p>
                <input
                    type="text"
                    value={context.persona || ''}
                    onChange={(e) => updateContext('persona', e.target.value)}
                    placeholder="e.g., An expert Python developer with 10 years of experience"
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none transition-all"
                />
            </Section>

            <Section title="Initial Prompt" tooltip={`The core task, question, or request you want the AI to accomplish. This is the heart of your prompt.

🎯 PURPOSE: Clearly defines what you want the AI to do
🔑 KEY ELEMENTS: Clear objective, specific action, desired outcome

📝 EXAMPLES:
• "Write a Python function that efficiently finds all prime numbers up to a given limit"
• "Create a marketing email for our new product launch targeting small business owners"
• "Explain quantum computing concepts in simple terms for a high school audience"
• "Review this code and suggest performance optimizations"
• "Generate 5 creative blog post ideas about sustainable living"

💡 TIPS:
- Start with action words (write, create, explain, analyze, etc.)
- Be specific about what you want (don't just say "help me")
- Include the format if relevant (function, email, explanation, etc.)
- Specify the target audience when appropriate
- Avoid vague requests like "make it better"`}>
                <p className="text-sm text-gray-500 mb-2">The main task or question for the AI.</p>
                <textarea
                    value={context.initialPrompt || ''}
                    onChange={(e) => updateContext('initialPrompt', e.target.value)}
                    placeholder="e.g., Write a function that finds prime numbers efficiently"
                    rows="4"
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none transition-all"
                />
            </Section>

            <Section title="Background Context" tooltip={`Provide additional context, constraints, or situational information that will help the AI understand the broader picture.

🎯 PURPOSE: Gives the AI important contextual information for better responses
🔑 KEY ELEMENTS: Constraints, environment, requirements, limitations, goals

📝 EXAMPLES:
• "This code will run on embedded systems with limited memory (512MB max)"
• "Our target audience is non-technical business owners who are new to digital marketing"
• "The solution must comply with GDPR regulations and handle European user data"
• "This is for a startup with a limited budget, so focus on cost-effective solutions"
• "The presentation will be given to C-level executives in a 15-minute time slot"

💡 TIPS:
- Include technical constraints (performance, memory, compatibility)
- Mention business constraints (budget, timeline, compliance)
- Specify the environment or context where this will be used
- Add any relevant background that might influence the approach
- Consider mentioning what you've already tried or what hasn't worked`}>
                <p className="text-sm text-gray-500 mb-2">Provide additional background information or constraints.</p>
                <textarea
                    value={context.backgroundContext || ''}
                    onChange={(e) => updateContext('backgroundContext', e.target.value)}
                    placeholder="e.g., This will be used in a high-performance application that processes millions of numbers"
                    rows="3"
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none transition-all"
                />
            </Section>

            <Section title="Examples" tooltip={`Provide specific input/output pairs that demonstrate the exact style, format, and quality you expect from the AI.

🎯 PURPOSE: Shows the AI exactly what good responses look like through concrete examples
🔑 KEY ELEMENTS: Input scenario, expected output, style demonstration

📝 EXAMPLES:

For Code Generation:
• Input: "Sort a list of numbers"
• Output: "def sort_numbers(numbers): return sorted(numbers)"

For Writing:
• Input: "Benefits of exercise"
• Output: "Regular exercise improves cardiovascular health, boosts mental clarity, and increases energy levels throughout the day."

For Data Analysis:
• Input: "Analyze this sales data: Q1: $50k, Q2: $75k, Q3: $60k"
• Output: "Sales peaked in Q2 with 50% growth, followed by a 20% decline in Q3. Overall trend shows 20% year-over-year growth."

💡 TIPS:
- Include 2-3 examples for best results
- Make examples representative of your actual use case
- Show the exact format and style you want
- Include edge cases or variations if relevant
- Keep examples concise but complete`}>
                <p className="text-sm text-gray-500 mb-2">Add examples to guide the AI's responses.</p>
                {examples.map((example, index) => (
                    <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-3">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Example {index + 1}</span>
                            <button
                                onClick={() => removeExample(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={example.input}
                                onChange={(e) => updateExample(index, 'input', e.target.value)}
                                placeholder="Input example"
                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none"
                            />
                            <input
                                type="text"
                                value={example.output}
                                onChange={(e) => updateExample(index, 'output', e.target.value)}
                                placeholder="Expected output"
                                className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none"
                            />
                        </div>
                    </div>
                ))}
                <button
                    onClick={addExample}
                    className="flex items-center gap-2 text-accent-aqua hover:text-accent-aqua/80 transition-colors"
                >
                    <FiPlus size={16} />
                    Add Example
                </button>
            </Section>

            <Section title="Output Format" tooltip={`Specify the exact structure, style, and format you want the AI's response to follow.

🎯 PURPOSE: Controls how the AI presents and organizes its response
🔑 KEY ELEMENTS: Structure, style, length, format specifications

📝 EXAMPLES:

For Code:
• "Provide the complete function with docstrings, type hints, and inline comments explaining the logic"
• "Return only the code block without explanations"
• "Include the solution plus 3 test cases"

For Writing:
• "Write in a professional tone with bullet points for key features"
• "Use a conversational style with short paragraphs (2-3 sentences each)"
• "Format as a formal business proposal with executive summary, details, and conclusion"

For Analysis:
• "Present findings as: 1) Key insights, 2) Supporting data, 3) Recommendations"
• "Use tables for numerical data and bullet points for qualitative findings"

💡 TIPS:
- Specify length requirements (brief, detailed, 300 words, etc.)
- Mention preferred structure (headings, bullet points, numbered lists)
- Include style preferences (formal, casual, technical, simple)
- Request specific elements (examples, citations, code comments)
- Be clear about what to include/exclude`}>
                <p className="text-sm text-gray-500 mb-2">Specify the desired output format.</p>
                <textarea
                    value={context.outputFormat || ''}
                    onChange={(e) => updateContext('outputFormat', e.target.value)}
                    placeholder="e.g., Provide the code with comments and a brief explanation"
                    rows="2"
                    className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none transition-all"
                />
            </Section>

            <Section title="Rules" tooltip={`Define specific rules, constraints, or boundaries that the AI must follow when generating its response.

🎯 PURPOSE: Sets clear boundaries and requirements the AI must respect
🔑 KEY ELEMENTS: Constraints, requirements, limitations, do's and don'ts

📝 EXAMPLES:

Technical Rules:
• "Use only Python standard library functions (no external packages)"
• "Code must be compatible with Python 3.8+"
• "Maximum response length: 500 words"
• "All functions must include error handling"

Style Rules:
• "Write in active voice, avoid passive constructions"
• "Use simple vocabulary suitable for beginners"
• "Include at least one real-world example for each concept"
• "Avoid technical jargon, explain terms when necessary"

Content Rules:
• "Focus only on open-source solutions"
• "Do not include any personal information or identifiers"
• "Provide sources for any statistics or claims"
• "Stay within the scope of web development topics"

Format Rules:
• "Start each section with a clear heading"
• "Use numbered lists for step-by-step instructions"
• "Bold important terms on first mention"

💡 TIPS:
- Be specific and measurable when possible
- Include both positive rules (do this) and negative rules (don't do this)
- Consider technical, style, content, and format constraints
- Think about common mistakes you want to avoid
- Rules help ensure consistency across multiple requests`}>
                <p className="text-sm text-gray-500 mb-2">Add specific rules or constraints the AI should follow.</p>
                {rules.map((rule, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={rule}
                            onChange={(e) => updateRule(index, e.target.value)}
                            placeholder="e.g., Use only built-in Python libraries"
                            className="flex-1 p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-accent-aqua focus:outline-none"
                        />
                        <button
                            onClick={() => removeRule(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={addRule}
                    className="flex items-center gap-2 text-accent-aqua hover:text-accent-aqua/80 transition-colors"
                >
                    <FiPlus size={16} />
                    Add Rule
                </button>
            </Section>
        </div>
    );
};

export default ContextBuilder;
