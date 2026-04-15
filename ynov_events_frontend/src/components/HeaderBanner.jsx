import React from 'react';

const HeaderBanner = () => {
    return (
        <div className="bg-white dark:bg-white w-full border-b border-slate-100 flex justify-center">
            <img 
                src="/header2.png" 
                alt="Ynov Talk Event Banner" 
                className="w-full max-w-6xl h-auto max-h-32 object-contain py-2"
            />
        </div>
    );
};

export default HeaderBanner;
