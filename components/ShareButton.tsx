import React from 'react';

interface ShareButtonProps {
  title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title }) => {
  const handleShare = () => {
    // 1. Get the current page URL
    const currentUrl = window.location.href;

    // 2. Construct the Facebook Share URL
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(title)}`;

    // 3. Open it in a popup window
    window.open(
      facebookUrl,
      'facebook-share-dialog',
      'width=800,height=600'
    );
  };

  return (
    <button 
      onClick={handleShare}
      className="group flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-5 py-2.5 rounded-full font-bold text-xs transition-all shadow-md hover:shadow-lg active:scale-95 uppercase tracking-wider"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
      </svg>
      <span>Share</span>
    </button>
  );
};

export default ShareButton;