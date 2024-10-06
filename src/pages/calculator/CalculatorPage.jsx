import React, { useState, useEffect } from 'react';
import { evaluate, derivative, simplify, parse } from 'mathjs';
import { ChevronDownIcon, BackspaceIcon, TrashIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import Latex from 'react-latex';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadSection from '../../components/common/UploadSection';

//Fix the advanced buttons functioanlity, improve design and add ocr and llms to manage complex math problems

const CalculatorPage = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [steps, setSteps] = useState([]);
    const [mode, setMode] = useState('Calculator');
    const [buttonSet, setButtonSet] = useState('Basic');
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize MathJax
        if (window.MathJax) {
            window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
        }
    }, [result, steps]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSolve = async () => {
        setLoading(true);
        try {
            if (mode === 'Calculator') {
                if (isComplexOperation(input)) {
                    await solveWithCohere(input);
                } else {
                    const result = evaluate(input);
                    setResult(result.toString());
                    setInput(result.toString());
                    generateSteps(input, result);
                }
            } else {
                await solveWithCohere(input);
            }
        } catch (error) {
            toast.error('An error occurred while solving the problem.');
            setResult('Error');
            setSteps([]);
        }
        setLoading(false);
    };

    const isComplexOperation = (input) => {
        // Define criteria for complex operations
        const complexPatterns = [
            /derivative/i,
            /integral/i,
            /limit/i,
            /solve/i,
            /equation/i,
            /system/i,
            /matrix/i,
            /vector/i,
            /\b(sin|cos|tan|log|ln)\b/i
        ];
        return complexPatterns.some(pattern => pattern.test(input));
    };

    const solveWithCohere = async (input) => {
        try {
            const apiKey = import.meta.env.VITE_COHERE_API_KEY;
            if (!apiKey) {
                throw new Error('Cohere API key is not set');
            }

            const response = await axios.post('https://api.cohere.ai/v1/generate', {
                model: 'command-xlarge-nightly',
                prompt: `Solve this math problem step by step: ${input}`,
                max_tokens: 300,
                temperature: 0.3,
                k: 0,
                stop_sequences: [],
                return_likelihoods: 'NONE'
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                }
            });

            const solution = response.data.generations[0].text;
            const lines = solution.split('\n').filter(line => line.trim() !== '');
            setResult(lines[lines.length - 1]);
            setSteps(lines);
        } catch (error) {
            console.error('Error processing with Cohere:', error);
            throw error;
        }
    };

    const generateSteps = (input, finalResult) => {
        const steps = [];
        try {
            const expr = parse(input);
            steps.push(`Original expression: ${expr.toString()}`);

            if (expr.type === 'OperatorNode') {
                const simplified = simplify(expr);
                if (simplified.toString() !== expr.toString()) {
                    steps.push(`Simplified: ${simplified.toString()}`);
                }

                if (expr.op === '^' && expr.args[1].type === 'ConstantNode') {
                    const base = expr.args[0].toString();
                    const exponent = expr.args[1].value;
                    for (let i = 2; i <= exponent; i++) {
                        steps.push(`Step ${i - 1}: ${base}^${i} = ${evaluate(`${base}^${i}`)}`);
                    }
                }
            } else if (expr.type === 'FunctionNode') {
                if (expr.name === 'derivative') {
                    const derivativeResult = derivative(expr.args[0], expr.args[1]);
                    steps.push(`Derivative: ${derivativeResult.toString()}`);
                }
            }

            steps.push(`Final result: ${finalResult}`);
        } catch (error) {
            console.error('Error generating steps:', error);
        }
        setSteps(steps);
    };

    const basicButtons = [
        '7', '8', '9', '+', '4', '5', '6', '-',
        '1', '2', '3', '*', '0', '.', '/', '='
    ];

    const functionButtons = [
        { label: 'sin(', icon: 'sin' },
        { label: 'cos(', icon: 'cos' },
        { label: 'tan(', icon: 'tan' },
        { label: 'ln(', icon: 'ln' },
        { label: 'log(', icon: 'log' },
        { label: 'e^(', icon: 'e^' },
        { label: 'pi', icon: 'π' },
        { label: 'sqrt(', icon: '√' },
        { label: 'cbrt(', icon: '∛' },
        { label: '^2', icon: 'x²' },
        { label: '^(', icon: 'x^' },
        { label: 'abs(', icon: '|x|' },
        { label: '(', icon: '(' },
        { label: ')', icon: ')' },
        { label: 'mod', icon: 'mod' },
        { label: '!', icon: '!' },
    ];

    const abcButtons = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z',
    ];

    const equationButtons = [
        '>', '<', '<=', '>=', '!=',
    ];

    const getButtonSet = () => {
        switch (buttonSet) {
            case 'Functions':
                return functionButtons;
            case 'ABC':
                return abcButtons;
            case 'Equations':
                return equationButtons;
            default:
                return [];
        }
    };

    const toggleDropdown = (set) => {
        if (buttonSet === set) {
            setShowDropdown(!showDropdown);
        } else {
            setButtonSet(set);
            setShowDropdown(true);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await axios.post(process.env.REACT_APP_OCR_API_ENDPOINT, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                setInput(response.data.text);
            } catch (error) {
                toast.error('Error uploading file');
            }
        }
    };

    const handleButtonClick = (value) => {
        if (value === '=') {
            handleSolve();
        } else if (value === 'sqrt(') {
            setInput(prevInput => `sqrt(${prevInput})`);
        } else if (value === 'pi') {
            setInput(prevInput => `${prevInput}*${Math.PI}`);
        } else if (value === 'e^(') {
            setInput(prevInput => `e^(${prevInput})`);
        } else if (value === '^2') {
            setInput(prevInput => `(${prevInput})^2`);
        } else if (value === 'mod') {
            setInput(prevInput => `${prevInput} % `);
        } else if (value === '!') {
            setInput(prevInput => `${prevInput}!`);
        } else {
            setInput(prevInput => prevInput + value);
        }
    };

    const handleClear = () => {
        setInput('');
        setResult('');
        setSteps([]);
    };

    const handleBackspace = () => {
        setInput(prevInput => prevInput.slice(0, -1));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full mt-24 max-w-4xl">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Zgjidhje.AI</h1>
                <p className="text-gray-600 mb-8 text-center">Instant, step-by-step solutions for any question or subject, exactly when you need them.</p>

                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="flex justify-end mb-4">
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            onClick={handleClear}
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-4">
                        <button
                            className={`px-4 py-2 rounded-full mb-2 sm:mb-0 ${mode === 'Calculator' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                            onClick={() => setMode('Calculator')}
                        >
                            Calculator
                        </button>
                        <button
                            className={`px-4 py-2 rounded-full mb-2 sm:mb-0 ${mode === 'Word problem' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                            onClick={() => setMode('Word problem')}
                        >
                            Word problem
                        </button>
                    </div>

                    {mode === 'Calculator' ? (
                        <>
                            <div className="flex flex-wrap justify-center space-x-2 mb-4">
                                <button
                                    className={`px-3 py-1 rounded mb-2 ${buttonSet === 'Basic' ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
                                    onClick={() => setButtonSet('Basic')}
                                >
                                    Basic
                                </button>
                                {['Functions', 'ABC', 'Equations'].map((set) => (
                                    <button
                                        key={set}
                                        className={`px-3 py-1 rounded flex items-center mb-2 ${buttonSet === set ? 'bg-pink-500 text-white' : 'bg-gray-200'}`}
                                        onClick={() => toggleDropdown(set)}
                                    >
                                        {set}
                                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                                    </button>
                                ))}
                            </div>

                            <div className="mb-4 flex">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter your math expression"
                                />
                                <button
                                    className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                                    onClick={handleBackspace}
                                >
                                    <BackspaceIcon className="h-5 w-5" />
                                </button>
                            </div>

                            {showDropdown && (
                                <div className="grid grid-cols-4 sm:grid-cols-10 sm:gap-1 gap-2 mb-4">
                                    {getButtonSet().map((btn, index) => (
                                        <button
                                            key={index}
                                            className={`bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-1 w-20 rounded ${buttonSet === 'ABC' ? 'font-serif' : ''}`}
                                            onClick={() => handleButtonClick(typeof btn === 'object' ? btn.label : btn)}
                                        >
                                            {typeof btn === 'object' ? (
                                                <span className="font-serif">{btn.icon}</span>
                                            ) : btn}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-4 gap-2">
                                {basicButtons.map((btn, index) => (
                                    <button
                                        key={index}
                                        className={`font-semibold py-2 px-4 rounded ${['+', '-', '*', '/', '='].includes(btn)
                                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                            }`}
                                        onClick={() => handleButtonClick(btn)}
                                    >
                                        {btn}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded w-full"
                                onClick={handleSolve}
                                disabled={loading}
                            >
                                {loading ? 'Solving...' : 'Solve'}
                            </button>
                        </>
                    ) : (
                        <div className="mt-4">
                            <UploadSection onFileUpload={handleFileUpload} />
                            <button
                                className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded w-full"
                                onClick={handleSolve}
                                disabled={loading}
                            >
                                {loading ? 'Solving...' : 'Solve'}
                            </button>
                        </div>
                    )}

                    {result && (
                        <div className="mt-6">
                            <h2 className="text-xl font-bold mb-2">Result:</h2>
                            <Latex>{`${result}`}</Latex>
                        </div>
                    )}

                    {steps.length > 0 && (
                        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Solution Steps</h2>
                            <ol className="space-y-4">
                                {steps.map((step, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                                            {index + 1}
                                        </span>
                                        <div className="bg-gray-100 rounded-lg p-4 flex-grow shadow-sm">
                                            <Latex className="text-gray-800">{`${step}`}</Latex>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalculatorPage;