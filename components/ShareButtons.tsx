import React from 'react';
import { FaDownload, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

// This is to inform TypeScript about the global htmlToImage object from the script tag
declare const htmlToImage: any;

interface ShareButtonsProps {
    cardRef: React.RefObject<HTMLDivElement>;
    friendName: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ cardRef, friendName }) => {
    
    const handleDownload = async () => {
        if (!cardRef.current) {
            alert('Cannot download, the card element is not available.');
            return;
        }
        if (typeof htmlToImage === 'undefined') {
            alert('Image generation library is not loaded yet. Please wait a moment and try again.');
            return;
        }
        
        try {
            const dataUrl = await htmlToImage.toPng(cardRef.current, { 
                quality: 1,
                pixelRatio: 3,
            });
            const link = document.createElement('a');
            link.download = `birthday-post-for-${friendName.toLowerCase().replace(/\s/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) { 
            console.error('Oops, something went wrong!', error);
            alert('Failed to generate image. Please try again.');
        }
    };
    
    const handleShare = (platform: 'facebook' | 'twitter') => {
        const text = encodeURIComponent(`Happy Birthday to my amazing friend ${friendName}! 🎉`);
        const url = encodeURIComponent(window.location.href);
        let shareUrl = '';
        if (platform === 'twitter') {
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        } else if (platform === 'facebook') {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
        }
        window.open(shareUrl, '_blank');
    };

    const handleInstagram = () => {
        alert('To share on Instagram, please download the image first and then upload it from your device!');
    };
    
    const buttonClasses = "flex items-center justify-center gap-2 p-3 text-white rounded-lg font-bold transition-all shadow-md transform hover:scale-105";

    return (
        <div className="mt-8 text-center w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Share Your Creation!</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button onClick={handleDownload} className={`${buttonClasses} bg-green-500 hover:bg-green-600`}>
                    <FaDownload/> Download
                </button>
                 <button onClick={() => handleShare('facebook')} className={`${buttonClasses} bg-blue-600 hover:bg-blue-700`}>
                    <FaFacebook/> Facebook
                </button>
                <button onClick={() => handleShare('twitter')} className={`${buttonClasses} bg-sky-500 hover:bg-sky-600`}>
                    <FaTwitter/> Twitter
                </button>
                <button onClick={handleInstagram} className={`${buttonClasses} bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90`}>
                    <FaInstagram/> Instagram
                </button>
            </div>
        </div>
    );
};