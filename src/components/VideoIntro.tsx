import React, { useRef, useState, useEffect } from 'react';

interface VideoIntroProps {
  onVideoEnd: () => void;
  onSkip: () => void;
}

const VideoIntro: React.FC<VideoIntroProps> = ({ onVideoEnd, onSkip }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [hasVideoLoaded, setHasVideoLoaded] = useState(false);
  const [loadingFailed, setLoadingFailed] = useState(false);

  useEffect(() => {
    // Allow skipping after 3 seconds
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    // Auto-skip if video doesn't load within 5 seconds
    const failureTimer = setTimeout(() => {
      if (!hasVideoLoaded) {
        console.log('Video failed to load within 5 seconds, auto-skipping');
        setLoadingFailed(true);
        onSkip();
      }
    }, 5000);

    // Test if video file exists
    if (videoRef.current) {
      videoRef.current.addEventListener('loadstart', () => {
        console.log('Video load started');
      });
      videoRef.current.addEventListener('loadeddata', () => {
        console.log('Video data loaded');
      });
      videoRef.current.addEventListener('canplaythrough', () => {
        console.log('Video can play through');
      });
    }

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(failureTimer);
    };
  }, [hasVideoLoaded, onSkip]);

  const handleVideoEnd = () => {
    console.log('Video ended, transitioning to menu');
    onVideoEnd();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setHasVideoLoaded(true);
      console.log('Video loaded successfully');
    }
  };

  const handleVideoError = (error: any) => {
    console.log('Video failed to load:', error);
    setHasVideoLoaded(false);
    setLoadingFailed(true);
    // Auto-skip after error
    setTimeout(() => {
      onSkip();
    }, 2000);
  };

  const togglePlayPause = () => {
    if (videoRef.current && hasVideoLoaded) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Play failed:', error);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // If loading failed, show error and auto-skip
  if (loadingFailed) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2">🧠⚔️</h1>
          <h2 className="text-4xl font-bold text-white mb-2">Brain Battle</h2>
          <p className="text-xl text-gray-300 mb-8">Get ready to challenge your mind!</p>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Video could not be loaded. Proceeding to menu...</p>
          </div>
          <button
            onClick={handleSkip}
            className="px-8 py-3 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
          >
            Continue to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-8">
      {/* Game Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">🧠⚔️</h1>
        <h2 className="text-4xl font-bold text-white mb-2">Brain Battle</h2>
        <p className="text-xl text-gray-300">Get ready to challenge your mind!</p>
      </div>

      {/* Video Container */}
      <div className="relative max-w-4xl w-full">
        <video
          ref={videoRef}
          className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-2xl"
          onEnded={handleVideoEnd}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleVideoError}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onCanPlay={() => setHasVideoLoaded(true)}
          playsInline
          muted={false}
          preload="metadata"
          controls={false}
        >
          <source src={`${import.meta.env.BASE_URL}intro-video.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading State */}
        {!hasVideoLoaded && !loadingFailed && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300 mb-4">Loading video...</p>
              <button
                onClick={handleSkip}
                className="px-6 py-2 bg-white bg-opacity-20 text-white rounded hover:bg-opacity-30 transition-colors"
              >
                Skip to Menu
              </button>
            </div>
          </div>
        )}

        {/* Large Play Button Overlay */}
        {hasVideoLoaded && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center text-black transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Video Controls */}
      {hasVideoLoaded && (
        <div className="mt-6 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex items-center gap-2 text-white text-sm">
            <span>{formatTime(currentTime)}</span>
            <div className="w-64 h-2 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-200"
                style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className={`absolute top-8 right-8 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
          canSkip
            ? 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 backdrop-blur-sm'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
        disabled={!canSkip}
      >
        {canSkip ? 'Skip Intro' : `Skip (${Math.max(0, 3 - Math.floor(currentTime))}s)`}
      </button>

      {/* Instructions */}
      {hasVideoLoaded && (
        <p className="text-gray-400 text-sm mt-4 text-center">
          Click the play button to start • Video will automatically proceed to menu when finished
        </p>
      )}
    </div>
  );
};

export default VideoIntro; 