'use client'

import { useState } from 'react';

const VideoEditor = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    const video = document.getElementById('mainVideo') as HTMLVideoElement;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden aspect-video">
        <video
          className="w-full h-full object-cover"
          playsInline
          id="mainVideo"
          loop
        >
          <source src="/videos/cursor-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 group">
          <button 
            className={`bg-white/90 hover:bg-white text-emerald-600 rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-105
              ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
            onClick={handlePlayClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {isPlaying ? (
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </button>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="h-full w-0 bg-gradient-to-r from-emerald-600 to-emerald-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor; 