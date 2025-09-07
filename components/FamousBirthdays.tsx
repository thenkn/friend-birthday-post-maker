import React from 'react';
import type { FamousPerson } from '../types';
import { FaStar, FaExclamationTriangle, FaSync, FaCheck } from 'react-icons/fa';
import { Spinner } from './Spinner';

interface FamousBirthdaysProps {
    people: FamousPerson[];
    loading: boolean;
    error: string | null;
    onRetry: () => void;
    selectedPeople: string[];
    onPersonSelect: (name: string) => void;
}

interface FamousPersonCardProps {
    person: FamousPerson;
    isSelected: boolean;
    onSelect: () => void;
}

const FamousPersonCard: React.FC<FamousPersonCardProps> = ({ person, isSelected, onSelect }) => {
    const fallbackImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random&color=fff&size=128`;
    const imageUrl = person.imageUrl || fallbackImageUrl;

    return (
        <div 
            onClick={onSelect}
            className={`bg-gradient-to-br from-purple-50 to-pink-100 p-4 rounded-2xl shadow-lg transition-all duration-300 flex items-center space-x-4 border-2 relative cursor-pointer card-hover-effect ${isSelected ? 'selected-card-glow' : 'border-white/50'}`}>
            
            <div className={`absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1 shadow-md transition-all duration-300 transform ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <FaCheck size={12}/>
            </div>
            
            <div className="relative flex-shrink-0">
                 <img
                    src={imageUrl}
                    alt={person.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== fallbackImageUrl) {
                            target.src = fallbackImageUrl;
                        }
                    }}
                />
                <div className="absolute inset-0 rounded-full border-2 border-pink-400 group-hover:animate-ping"></div>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{person.name}</h3>
                <p className="text-sm text-gray-700 leading-snug">{person.description}</p>
            </div>
        </div>
    );
};


export const FamousBirthdays: React.FC<FamousBirthdaysProps> = ({ people, loading, error, onRetry, selectedPeople, onPersonSelect }) => {
    return (
        <div className="bg-gray-500/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-inner h-full">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 flex items-center justify-center gap-2">
                <FaStar className="text-yellow-400 text-shadow" />
                Famous Birthday Twins
            </h2>
            <p className="text-center text-gray-700 -mt-1 mb-4 text-sm font-medium">Select up to 3 to include in the post (optional).</p>

            {loading && (
                <div className="flex flex-col items-center justify-center h-64">
                    <Spinner />
                    <p className="mt-4 text-gray-700 font-semibold">Finding famous birthday twins...</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center text-center bg-red-100/80 p-4 rounded-lg border border-red-300">
                    <FaExclamationTriangle className="text-red-500 text-4xl mb-3" />
                    <p className="text-red-800 font-semibold mb-4">{error}</p>
                    <button
                        onClick={onRetry}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg hover:shadow-red-300/50"
                    >
                        <FaSync />
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && people.length > 0 && (
                <div className="space-y-4">
                    {people.map((person) => (
                        <FamousPersonCard 
                            key={person.name} 
                            person={person}
                            isSelected={selectedPeople.includes(person.name)}
                            onSelect={() => onPersonSelect(person.name)}
                        />
                    ))}
                </div>
            )}
             {!loading && !error && people.length === 0 && (
                 <div className="text-center text-gray-500 py-10">
                    <p>No famous birthdays found for this date.</p>
                 </div>
            )}
        </div>
    );
};