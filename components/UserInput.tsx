import React from 'react';
import type { Theme, Font } from '../types';
import { FaUser, FaCamera, FaPaintBrush, FaCalendarAlt, FaPalette, FaFont } from 'react-icons/fa';

interface UserInputProps {
    friendName: string;
    setFriendName: (name: string) => void;
    friendPhoto: string | null;
    setFriendPhoto: (photo: string | null) => void;
    onGeneratePost: () => void;
    isGenerateDisabled: boolean;
    onDateSelect: (date: Date) => void;
    selectedDate: Date;
    selectedTheme: Theme;
    setSelectedTheme: (theme: Theme) => void;
    selectedFont: Font;
    setSelectedFont: (font: Font) => void;
}

const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const UserInput: React.FC<UserInputProps> = ({
    friendName,
    setFriendName,
    friendPhoto,
    setFriendPhoto,
    onGeneratePost,
    isGenerateDisabled,
    onDateSelect,
    selectedDate,
    selectedTheme,
    setSelectedTheme,
    selectedFont,
    setSelectedFont,
}) => {
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFriendPhoto(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value; // yyyy-mm-dd
        if (dateValue) {
            const date = new Date(dateValue + 'T00:00:00'); // Use T00:00:00 to avoid timezone issues
            onDateSelect(date);
        }
    };
    
    const themes: { id: Theme, name: string, gradient: string }[] = [
        { id: 'sunset', name: 'Sunset Glow', gradient: 'from-orange-400 to-pink-500' },
        { id: 'ocean', name: 'Ocean Dream', gradient: 'from-teal-400 to-blue-500' },
        { id: 'galaxy', name: 'Galaxy Night', gradient: 'from-gray-800 to-black' },
    ];

    return (
        <div className="bg-gray-500/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-inner h-full flex flex-col justify-between">
            <div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
                    <FaUser className="text-indigo-500" />
                    Create Your Post
                </h2>

                <div className="space-y-4">
                     <div>
                        <label htmlFor="birthday-date" className="block text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                           <FaCalendarAlt /> 1. Select Friend's Birthday
                        </label>
                        <input
                            type="date"
                            id="birthday-date"
                            value={formatDateForInput(selectedDate)}
                            onChange={handleDateChange}
                            className="w-full px-4 py-2 bg-white/50 border-2 border-gray-300 rounded-lg transition-all shadow-sm input-focus-effect"
                        />
                    </div>
                    <div>
                        <label htmlFor="friend-name" className="block text-md font-semibold text-gray-800 mb-2">
                            2. Friend's Name
                        </label>
                        <input
                            type="text"
                            id="friend-name"
                            value={friendName}
                            onChange={(e) => setFriendName(e.target.value)}
                            placeholder="Enter your friend's name"
                            className="w-full px-4 py-2 bg-white/50 border-2 border-gray-300 rounded-lg transition-all shadow-sm input-focus-effect"
                        />
                    </div>
                    <div>
                        <label className="block text-md font-semibold text-gray-800 mb-2">
                            3. Friend's Photo (Optional)
                        </label>
                        <div className="flex items-center space-x-4">
                            <label
                                htmlFor="friend-photo"
                                className="cursor-pointer bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-indigo-300/50"
                            >
                                <FaCamera />
                                Choose Photo
                            </label>
                            <input
                                type="file"
                                id="friend-photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                            {friendPhoto && (
                                <img src={friendPhoto} alt="Friend preview" className="w-16 h-16 rounded-full object-cover border-4 border-indigo-400 shadow-md" />
                            )}
                            {!friendPhoto && <span className="text-gray-600 text-sm">No photo selected</span>}
                        </div>
                    </div>
                     <div className="pt-2">
                        <label className="block text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                           <FaPalette /> 4. Customize Your Post
                        </label>
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700">Theme</h4>
                                <div className="flex gap-2 mt-1">
                                    {themes.map(theme => (
                                        <button key={theme.id} onClick={() => setSelectedTheme(theme.id)} className={`w-full p-2 text-sm rounded-lg border-2 transition-all ${selectedTheme === theme.id ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-gray-300'}`}>
                                            <div className={`w-full h-5 rounded bg-gradient-to-r ${theme.gradient}`}></div>
                                            <span className="text-xs font-semibold">{theme.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                               <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1"><FaFont/> Font Style</h4>
                               <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value as Font)} className="w-full mt-1 px-4 py-2 bg-white/50 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all shadow-sm">
                                   <option value="poppins">Elegant</option>
                                   <option value="pacifico">Playful</option>
                                   <option value="anton">Bold</option>
                               </select>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={onGeneratePost}
                disabled={isGenerateDisabled}
                className={`w-full mt-6 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-bold py-3 px-6 rounded-xl text-lg
                hover:scale-105 hover:shadow-2xl hover:shadow-pink-400/50 focus:outline-none focus:ring-4 focus:ring-pink-300
                transition-all duration-300 transform shiny-button
                disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none`}
            >
                <FaPaintBrush className="mr-2" />
                Generate Birthday Post
            </button>
        </div>
    );
};