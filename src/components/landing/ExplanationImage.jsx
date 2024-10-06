import React from 'react';

const ExplanationImage = () => (
    <img
        src="/assets/images/explanation.png"
        alt="Detailed Explanation"
        className="hidden md:block absolute top-[70%] left-24 object-cover z-30"
        style={{
            transform: 'translate(0%, -70%)',
            opacity: 1,
        }}
    />
);

export default ExplanationImage;
