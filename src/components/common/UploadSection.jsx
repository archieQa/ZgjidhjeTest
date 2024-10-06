import React, { useState } from 'react';
import { DocumentArrowUpIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Tesseract from 'tesseract.js';

const UploadSection = () => {
    const [recognizedText, setRecognizedText] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [cohereAnswer, setCohereAnswer] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [editableText, setEditableText] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);
            setUploadedFile(file);
            const reader = new FileReader();
            reader.onload = async (e) => {
                setPreviewUrl(e.target.result);
                setIsUploading(false);
                setIsRecognizing(true);
                const { data: { text } } = await Tesseract.recognize(e.target.result);
                setRecognizedText(text);
                setEditableText(text);
                setIsRecognizing(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setRecognizedText('');
        setEditableText('');
        setPreviewUrl(null);
        setCohereAnswer('');
        setShowConfirmation(false);
    };

    const handleConfirmText = () => {
        setShowConfirmation(true);
    };

    const handleProcessText = async () => {
        setShowConfirmation(false);
        await getAnswerFromCohere(editableText);
    };

    const getAnswerFromCohere = async (text) => {
        setIsProcessing(true);
        try {
            const apiKey = import.meta.env.VITE_COHERE_API_KEY;
            if (!apiKey) {
                throw new Error('Cohere API key is not set');
            }

            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'command-xlarge-nightly',
                    prompt: `Ju jeni një profesor nga Shqipëria. Ju lutem analizoni dhe përgjigjuni tekstit të mëposhtëm në shqip rrjedhshëm, duke u përpjekur të jeni sa më i qartë dhe konciz që të jetë e mundur: "${text}"`,
                    max_tokens: 200,
                    temperature: 0.4,
                    k: 0,
                    stop_sequences: [],
                    return_likelihoods: 'NONE'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from Cohere API');
            }

            const data = await response.json();
            const answer = data.generations[0].text;
            setCohereAnswer(answer);
        } catch (error) {
            console.error('Error processing text:', error);
            setCohereAnswer('Ndodhi një gabim gjatë përpunimit të tekstit tuaj. ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto mb-8 p-6 bg-white rounded-xl shadow-lg">
            {!uploadedFile ? (
                <label
                    htmlFor="fileUpload"
                    className="flex flex-col w-full items-center justify-center h-64 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition duration-300 ease-in-out">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <DocumentArrowUpIcon className="w-16 h-16 text-blue-500" />
                        <div className="text-center">
                            <p className="text-lg font-semibold text-blue-600">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-blue-400">PDF, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                    </div>
                    <input type="file" id="fileUpload" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
                </label>
            ) : (
                <div className="w-full p-6 bg-gray-50 rounded-xl shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-4 text-sm">
                            <p><span className="font-bold">Name:</span> {uploadedFile.name}</p>
                            <p><span className="font-bold">Type:</span> {uploadedFile.type}</p>
                            <p><span className="font-bold">Size:</span> {(uploadedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => document.getElementById('fileUpload').click()} className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition duration-300">
                                <ArrowPathIcon className="w-6 h-6" />
                            </button>
                            <button onClick={handleRemoveFile} className="p-2 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition duration-300">
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    {isUploading && <p className="text-sm text-gray-600">Uploading file...</p>}
                    {previewUrl && (
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Preview:</h4>
                            {uploadedFile.type.startsWith('image/') ? (
                                <img src={previewUrl} alt="Uploaded file preview" className="max-w-full h-auto rounded-lg shadow-md" />
                            ) : (
                                <embed src={previewUrl} type={uploadedFile.type} width="100%" height="500px" className="rounded-lg shadow-md" />
                            )}
                        </div>
                    )}
                </div>
            )}
            {isRecognizing && <p className="mt-4 text-sm text-blue-600">Recognizing text...</p>}
            {recognizedText && (
                <div className="mt-6 p-6 bg-white rounded-xl shadow-md w-full">
                    <h3 className="text-xl font-bold mb-3 text-gray-800">Recognized Text:</h3>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows="5"
                        value={editableText}
                        onChange={(e) => setEditableText(e.target.value)}
                    />
                    <button
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={handleConfirmText}
                    >
                        Confirm Text
                    </button>
                </div>
            )}
            {showConfirmation && (
                <div className="mt-6 p-6 bg-yellow-50 rounded-xl shadow-md w-full">
                    <h3 className="text-xl font-bold mb-3 text-yellow-800">Confirm Processing</h3>
                    <p className="text-yellow-700 mb-4">Are you sure you want to process this text with AI?</p>
                    <div className="flex space-x-4">
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            onClick={handleProcessText}
                        >
                            Yes, Process
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setShowConfirmation(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {isProcessing && <p className="mt-4 text-sm text-blue-600">Processing with AI...</p>}
            {cohereAnswer && (
                <div className="mt-6 p-6 bg-blue-50 rounded-xl shadow-md w-full">
                    <h3 className="text-xl font-bold mb-3 text-blue-800">AI Analysis:</h3>
                    <p className="text-blue-700">{cohereAnswer}</p>
                </div>
            )}
            <input type="file" id="fileUpload" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf" />
        </div>
    );
};

export default UploadSection;