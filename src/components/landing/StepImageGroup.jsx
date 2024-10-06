import React from 'react';

const StepImageGroup = () => (
    <>
        <img
            src="/assets/images/step1.png"
            alt="Step 1"
            className="hidden md:block absolute top-20 -left-20 object-cover z-30"
            style={{
                transform: 'translate(0%, 0%)',
                opacity: 1,
            }}
        />
        <img
            src="/assets/images/step2.png"
            alt="Step 2"
            className="hidden md:block absolute bottom-20 -right-24 object-top z-30"
            style={{
                transform: 'translate(0%, 0%)',
                opacity: 1,
            }}
        />
    </>
);

export default StepImageGroup;
