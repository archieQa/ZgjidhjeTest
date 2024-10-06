import { useState } from 'react';
import axios from 'axios';

export const useCohere = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);

    const getCohereResponse = async (prompt) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                'https://api.cohere.ai/v1/generate',
                {
                    model: 'command-xlarge-nightly',
                    prompt: prompt,
                    max_tokens: 300,
                    temperature: 0.3,
                    k: 0,
                    stop_sequences: [],
                    return_likelihoods: 'NONE'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.VITE_COHERE_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setIsLoading(false);
            const botResponse = response.data.generations[0].text.trim();
            setMessages(prevMessages => [...prevMessages, { type: 'bot', content: botResponse }]);
            return botResponse;
        } catch (err) {
            setIsLoading(false);
            setError('An error occurred while fetching the response.');
            console.error('Cohere API Error:', err);
            const errorMessage = 'Sorry, I encountered an error while processing your request.';
            setMessages(prevMessages => [...prevMessages, { type: 'bot', content: errorMessage }]);
            return errorMessage;
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return { getCohereResponse, isLoading, error, messages, clearChat };
};
