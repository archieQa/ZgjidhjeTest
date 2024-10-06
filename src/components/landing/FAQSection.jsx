// src/components/landing/FAQSection.jsx
import React, { useState, useEffect } from 'react';

// Dummy Data for FAQs
const faqs = [
    {
        question: "How does the AI work?",
        answer:
            "Our AI uses advanced machine learning algorithms and natural language processing to understand and solve complex problems. It analyzes the question, breaks it down into components, and provides step-by-step explanations using its vast knowledge base.",
    },
    {
        question: "Can I get help from real tutors?",
        answer:
            "Absolutely! We have a network of qualified tutors available 24/7 for personalized assistance. You can schedule one-on-one sessions or join group tutoring sessions based on your preference and learning needs.",
    },
    {
        question: "What subjects are covered?",
        answer:
            "We cover a wide range of subjects including Mathematics, Physics, Chemistry, Biology, Computer Science, Literature, History, and more. Our platform is constantly expanding to include new subjects and topics.",
    },
    {
        question: "Is there a mobile app available?",
        answer:
            "Yes, we have mobile apps available for both iOS and Android devices. You can download them from the App Store or Google Play Store to access our services on the go.",
    },
    {
        question: "How much does it cost?",
        answer:
            "We offer various subscription plans to suit different needs and budgets. You can choose from monthly, quarterly, or annual plans. We also offer a free trial period for new users to explore our platform.",
    },
];

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Autoplay the questions on larger screens
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % faqs.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    // Handle closing the active question on small screens
    const handleQuestionClick = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    return (
        <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
                    Frequently Asked Questions
                </h2>

                {/* For small screens, keep the original collapsible FAQ layout */}
                <div className="md:hidden bg-white rounded-lg shadow-md p-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200 py-4">
                            <button
                                className="flex justify-between items-center w-full text-left"
                                onClick={() => handleQuestionClick(index)}
                            >
                                <h3 className="text-lg font-semibold">{faq.question}</h3>
                                {index === activeIndex ? '-' : '+'}
                            </button>
                            {index === activeIndex && (
                                <div className="mt-2">
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* For medium and larger screens, show the autoplay effect with the rolodex style */}
                <div className="hidden md:flex md:flex-row items-center justify-evenly mt-8">
                    {/* Left Side: Questions List */}
                    <div className="w-full md:w-1/2 flex flex-col items-start space-y-4 p-4 bg-white rounded-lg shadow-lg overflow-hidden">
                        {faqs.map((faq, index) => (
                            <button
                                key={index}
                                className={`p-4 text-left border-b border-gray-200 rounded-lg transition duration-300 w-full ${activeIndex === index
                                    ? 'bg-blue-100 text-blue-800 font-bold'
                                    : 'bg-gray-100 hover:bg-blue-50 text-gray-800'
                                    }`}
                                onClick={() => setActiveIndex(index)}
                            >
                                <h3 className="text-lg">{faq.question}</h3>
                            </button>
                        ))}
                    </div>

                    {/* Right Side: Answers Display */}
                    <div className="relative w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center -mt-20 space-y-3">
                        {/* Current Answer */}
                        <div className="w-full z-10 p-6 bg-white rounded-xl shadow-lg transform transition-all duration-500 hover:shadow-2xl">
                            <p className="text-gray-800 text-lg">{faqs[activeIndex]?.answer}</p>
                        </div>

                        {/* Next Answer (Grayer and Smaller) */}
                        <div
                            className="absolute top-32 w-full p-4 bg-white rounded-lg shadow-md border border-gray-200 transform scale-90 transition-all duration-500"
                            style={{ opacity: 0.5 }}
                        >
                            <p className="text-gray-600 text-base">
                                {faqs[(activeIndex + 1) % faqs.length]?.answer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
