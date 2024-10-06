// src/components/landing/DocumentUploadSection.jsx
import React from 'react';
import UploadSection from '../common/UploadSection';

const DocumentUploadSection = () => {
    return (
        <section className="flex flex-col items-center bg-gray-100 p-6 my-8">
            <h2 className="text-3xl font-semibold mb-4">Upload Your Homework</h2>
            <p className="text-gray-700 mb-4">Upload images or PDFs of your questions to get step-by-step solutions.</p>
            <UploadSection />
        </section>
    );
};

export default DocumentUploadSection;
