import React, { useState, useCallback, useEffect } from 'react';
import type { FamousPerson, PostData, Theme, Font } from './types';
import { fetchFamousBirthdaysForDate, fetchImageFromGoogle } from './services/geminiService';
import { Header } from './components/Header';
import { FamousBirthdays } from './components/FamousBirthdays';
import { UserInput } from './components/UserInput';
import { BirthdayPost } from './components/BirthdayPost';
import { FaGift } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const fetchWikipediaImage = async (name: string): Promise<string | null> => {
    try {
        const encodedName = encodeURIComponent(name);
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=200&origin=*`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Wikipedia API request failed with status ${response.status}`);
        }
        const data = await response.json();
        
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === "-1") {
            console.warn(`No Wikipedia page found for ${name}`);
            return null;
        }

        const page = pages[pageId];
        const imageUrl = page?.thumbnail?.source;
        
        return imageUrl || null;
    } catch (error) {
        console.error(`Failed to fetch Wikipedia image for "${name}":`, error);
        return null;
    }
};


const App: React.FC = () => {
    const [famousPeople, setFamousPeople] = useState<FamousPerson[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [friendName, setFriendName] = useState<string>('');
    const [friendPhoto, setFriendPhoto] = useState<string | null>(null);
    const [generatedPost, setGeneratedPost] = useState<PostData | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTheme, setSelectedTheme] = useState<Theme>('sunset');
    const [selectedFont, setSelectedFont] = useState<Font>('poppins');
    const [selectedPeopleNames, setSelectedPeopleNames] = useState<string[]>([]);

    const fetchBirthdays = useCallback(async (date: Date) => {
        setGeneratedPost(null);
        setFamousPeople([]);
        setSelectedPeopleNames([]);
        setLoading(true);
        setError(null);
        try {
            const people = await fetchFamousBirthdaysForDate(date);
            
            const peopleWithImages = await Promise.all(
                people.map(async (person) => {
                    let imageUrl = await fetchWikipediaImage(person.name);
                    if (!imageUrl) {
                        console.log(`Wikipedia image not found for ${person.name}. Trying Google via Gemini...`);
                        imageUrl = await fetchImageFromGoogle(person.name);
                    }
                    return { ...person, imageUrl };
                })
            );

            setFamousPeople(peopleWithImages);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch famous birthdays. The Gemini API might be unavailable. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBirthdays(selectedDate);
    }, [fetchBirthdays, selectedDate]);


    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
    };

    const handleTogglePersonSelection = (name: string) => {
        setSelectedPeopleNames(currentSelected => {
            const isSelected = currentSelected.includes(name);
            if (isSelected) {
                return currentSelected.filter(pName => pName !== name);
            } else {
                if (currentSelected.length < 3) {
                    return [...currentSelected, name];
                }
                return currentSelected; // Limit selection to 3
            }
        });
    };

    const handleGeneratePost = () => {
        if (!friendName) {
            alert("Please enter your friend's name!");
            return;
        }
       
        let peopleForPost: FamousPerson[];
            
        if (selectedPeopleNames.length > 0) {
            // Map names back to full person objects, preserving order of selection
            peopleForPost = selectedPeopleNames.map(name => 
                famousPeople.find(p => p.name === name)!
            ).filter(Boolean); // filter(Boolean) removes any potential nulls if a person wasn't found
        } else {
            // Default behavior: pick the first 2 if no selection is made
            peopleForPost = famousPeople.slice(0, 2);
        }
        
        if (peopleForPost.length === 0) {
            alert("Not enough famous people data to generate a post. Please try again later.");
            return;
        }

        setGeneratedPost({
            friend: {
                name: friendName,
                photo: friendPhoto,
            },
            famous: peopleForPost,
            date: selectedDate,
            theme: selectedTheme,
            font: selectedFont,
        });
    };
    
    const isGenerateDisabled = loading || !!error || famousPeople.length === 0 || !friendName;

    return (
        <IconContext.Provider value={{ className: "inline-block" }}>
            <div className="min-h-screen w-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="container mx-auto max-w-7xl bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30 container-glow">
                    <Header />
                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-2">
                                <FamousBirthdays 
                                  people={famousPeople} 
                                  loading={loading} 
                                  error={error} 
                                  onRetry={() => fetchBirthdays(selectedDate)}
                                  selectedPeople={selectedPeopleNames}
                                  onPersonSelect={handleTogglePersonSelection}
                                />
                            </div>
                            <div className="lg:col-span-3">
                                <UserInput
                                    friendName={friendName}
                                    setFriendName={setFriendName}
                                    friendPhoto={friendPhoto}
                                    setFriendPhoto={setFriendPhoto}
                                    onGeneratePost={handleGeneratePost}
                                    isGenerateDisabled={isGenerateDisabled}
                                    onDateSelect={handleDateSelect}
                                    selectedDate={selectedDate}
                                    selectedTheme={selectedTheme}
                                    setSelectedTheme={setSelectedTheme}
                                    selectedFont={selectedFont}
                                    setSelectedFont={setSelectedFont}
                                />
                            </div>
                        </div>
                        {generatedPost && (
                            <div className="mt-12">
                                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-3">
                                    <FaGift className="text-pink-500" />
                                    Your Birthday Post is Ready!
                                </h2>
                                <BirthdayPost postData={generatedPost} />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </IconContext.Provider>
    );
};

export default App;