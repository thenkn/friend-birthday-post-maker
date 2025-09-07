import React, { useRef, useEffect } from 'react';
import type { PostData, Theme, Font } from '../types';
import { FaBirthdayCake, FaStar } from 'react-icons/fa';
import { ShareButtons } from './ShareButtons';

interface BirthdayPostProps {
    postData: PostData;
}

const THEMES: Record<Theme, { gradient: string; textColor: string; accentColor: string; nameColor: string; overlay: string; shadow: string; }> = {
    sunset: {
        gradient: 'from-orange-400 via-red-500 to-pink-600',
        textColor: 'text-white',
        accentColor: 'text-yellow-300',
        nameColor: 'text-yellow-200',
        overlay: 'bg-black/20',
        shadow: 'shadow-red-500/50',
    },
    ocean: {
        gradient: 'from-teal-400 via-cyan-500 to-blue-600',
        textColor: 'text-white',
        accentColor: 'text-cyan-200',
        nameColor: 'text-white',
        overlay: 'bg-black/20',
        shadow: 'shadow-cyan-500/50',
    },
    galaxy: {
        gradient: 'from-gray-900 via-black to-blue-900',
        textColor: 'text-gray-300',
        accentColor: 'text-pink-400',
        nameColor: 'text-white',
        overlay: 'bg-white/10',
        shadow: 'shadow-pink-400/50',
    },
};

const FONTS: Record<Font, { main: string; heading: string; }> = {
    poppins: { main: 'font-poppins', heading: 'font-poppins' },
    pacifico: { main: 'font-pacifico', heading: 'font-pacifico' },
    anton: { main: 'font-anton tracking-wider', heading: 'font-anton tracking-widest' },
};

const ThemeBackgroundEffects: React.FC<{ theme: Theme }> = ({ theme }) => {
    if (theme === 'galaxy') {
        return (
            <>
                <div className="stars"></div>
                <div className="twinkling"></div>
                <div className="clouds"></div>
            </>
        );
    }
    if (theme === 'ocean') {
        const bubbles = Array.from({ length: 15 }).map((_, i) => {
            const style = {
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 10 + 8}s`,
            };
            return <div key={i} className="bubble" style={style}></div>;
        });
        return <div className="bubbles-container">{bubbles}</div>;
    }
    if (theme === 'sunset') {
        return <div className="sun-rays"></div>;
    }
    return null;
};


const FamousPersonEntry: React.FC<{ person: any, theme: Theme }> = ({ person, theme }) => {
    const fallbackPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=FFFFFF&color=333&size=128&bold=true`;
    const photoSrc = person.imageUrl || fallbackPhoto;
    
    return (
        <div className={`flex items-center gap-4 p-2 rounded-lg ${THEMES[theme].overlay} backdrop-blur-sm`}>
            <img
                src={photoSrc}
                alt={person.name}
                className="w-14 h-14 object-cover rounded-full shadow-md border-2 border-white/30 flex-shrink-0"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== fallbackPhoto) {
                        target.src = fallbackPhoto;
                    }
                }}
            />
            <div>
                <h4 className={`font-bold leading-tight ${THEMES[theme].nameColor} text-sm`}>{person.name}</h4>
                <p className={`text-xs opacity-80 ${THEMES[theme].textColor}`}>{person.description}</p>
            </div>
        </div>
    );
};


export const BirthdayPost: React.FC<BirthdayPostProps> = ({ postData }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { friend, famous, date, theme, font } = postData;
    
    const fallbackFriendPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=ffc107&color=fff&size=200&bold=true`;
    const friendPhotoSrc = friend.photo || fallbackFriendPhoto;

    const formattedDate = date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const selectedTheme = THEMES[theme];
    const selectedFont = FONTS[font];

    return (
        <div className="flex flex-col items-center">
            <div
                ref={cardRef}
                id="birthday-card"
                className={`w-full max-w-sm aspect-[9/16] bg-gradient-to-br ${selectedTheme.gradient} ${selectedTheme.textColor} ${selectedFont.main}
                           p-4 rounded-3xl shadow-2xl ${selectedTheme.shadow} overflow-hidden relative flex flex-col`}
            >
                <ThemeBackgroundEffects theme={theme} />
                <div className="relative z-10 flex flex-col h-full text-center">
                    
                    <header className="flex-shrink-0 mb-3">
                         <h3 className={`text-3xl font-bold tracking-tight text-shadow-lg ${selectedFont.heading} ${selectedTheme.nameColor}`}>
                            Happy Birthday
                        </h3>
                        <p className={`text-xl font-bold -mt-1 ${selectedTheme.accentColor} ${selectedFont.heading}`}>{friend.name}!</p>
                    </header>
                    
                    <div className="flex-grow flex flex-col justify-center items-center">
                        <div className="relative">
                           <img
                                src={friendPhotoSrc}
                                alt={friend.name}
                                className="w-48 h-48 object-cover rounded-full shadow-2xl border-4 border-white/50 friend-photo-glow"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== fallbackFriendPhoto) {
                                        target.src = fallbackFriendPhoto;
                                    }
                                }}
                           />
                            <FaBirthdayCake className={`absolute -bottom-2 -right-2 text-4xl ${selectedTheme.accentColor} drop-shadow-lg`}/>
                        </div>
                        <p className={`mt-3 text-base opacity-90 px-2 ${selectedTheme.textColor}`}>
                            Wishing you a day filled with love, laughter, and joy!
                        </p>
                    </div>
                    
                    <footer className="flex-shrink-0 mt-3">
                         <div className="flex items-center justify-center gap-2 border-t-2 border-white/20 pt-2 pb-1">
                            <FaStar className={`${selectedTheme.accentColor}`}/>
                            <p className="text-xs font-bold tracking-wider opacity-80 uppercase">Birthday Twins for {formattedDate}</p>
                            <FaStar className={`${selectedTheme.accentColor}`}/>
                        </div>
                         <div className="space-y-2 mt-2">
                            {famous.map((person) => (
                                 <FamousPersonEntry
                                    key={person.name}
                                    person={person}
                                    theme={theme}
                                />
                            ))}
                        </div>
                    </footer>
                </div>
            </div>
            <ShareButtons cardRef={cardRef} friendName={friend.name}/>
        </div>
    );
};