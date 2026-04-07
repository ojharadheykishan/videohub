'use client';

import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { FiVolume2, FiSettings, FiMaximize } from 'react-icons/fi';
import { formatDuration } from '@/utils/helpers';

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onProgress?: (played: number, duration: number) => void;
  autoplay?: boolean;
}

export default function VideoPlayer({
  videoId,
  title,
  onProgress,
  autoplay = false,
}: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleProgress = (state: any) => {
    setPlayed(state.played);
    if (onProgress && state.playedSeconds) {
      onProgress(state.played, state.playedSeconds);
    }
  };

  const handleSeek = (value: number) => {
    playerRef.current?.seekTo(value);
    setPlayed(value);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      className={`w-full bg-black rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      <div className="relative w-full aspect-video bg-black">
        <ReactPlayer
          ref={playerRef}
          url={`https://www.youtube.com/watch?v=${videoId}`}
          playing={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onProgress={handleProgress}
          onDuration={setDuration}
          playbackRate={playbackSpeed}
          width="100%"
          height="100%"
          controls={false}
        />

        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={played}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1 rounded-lg appearance-none bg-gray-600 cursor-pointer hover:bg-blue-500 transition"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                  played * 100
                }%, #4b5563 ${played * 100}%, #4b5563 100%)`,
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-blue-400 transition"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-700 transition"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <span className="text-sm">
                {formatDuration(played * duration)} / {formatDuration(duration)}
              </span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="hover:text-blue-400 transition"
            >
              <FiMaximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
