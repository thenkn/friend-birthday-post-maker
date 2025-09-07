import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-6 sm:p-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-shadow">
                🎉 AI Birthday Post Maker 🎉
            </h1>
            <p className="text-lg opacity-90 max-w-3xl mx-auto font-light">
                Create amazing birthday posts with famous people sharing the same birthday, powered by Google's Gemini AI!
            </p>
        </header>
    );
};