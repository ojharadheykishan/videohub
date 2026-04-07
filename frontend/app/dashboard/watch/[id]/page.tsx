'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FiBook, FiClock, FiHeart } from 'react-icons/fi';
import { useVideoStore } from '@/utils/videoStore';
import VideoPlayer from '@/components/VideoPlayer';
import NotesEditor from '@/components/NotesEditor';
import apiClient from '@/utils/api';
import { formatDuration } from '@/utils/helpers';

export default function WatchPage() {
  const params = useParams();
  const videoId = params.id as string;
  const [video, setVideo] = useState<any>(null);
  const [notes, setNotes] = useState<any>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { updateWatchProgress, toggleFavorite } = useVideoStore();

  useEffect(() => {
    if (videoId) {
      fetchVideo();
      fetchNotes();
    }
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const { data } = await apiClient.get(`/videos/${videoId}`);
      setVideo(data.video);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data } = await apiClient.get(`/notes/${videoId}`);
      setNotes(data.note);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleProgress = async (played: number, duration: number) => {
    const percentage = Math.round(played * 100);
    if (percentage % 10 === 0) {
      // Save progress every 10%
      await updateWatchProgress(videoId, percentage);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Video Player */}
      <div>
        <VideoPlayer
          videoId={video.videoId}
          title={video.title}
          onProgress={handleProgress}
          autoplay={true}
        />
      </div>

      {/* Video Info */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{video.channelName}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={async () => {
              await toggleFavorite(videoId);
              fetchVideo();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded transition ${
              video.isFavorite
                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
            }`}
          >
            <FiHeart className="w-5 h-5" fill={video.isFavorite ? 'currentColor' : 'none'} />
            {video.isFavorite ? 'Favorited' : 'Favorite'}
          </button>

          <button
            onClick={() => setIsNotesOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition"
          >
            <FiBook className="w-5 h-5" />
            {notes ? 'Edit Notes' : 'Add Notes'}
          </button>

          <div className="ml-auto flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiClock className="w-5 h-5" />
            <span>{formatDuration(video.duration)}</span>
          </div>
        </div>

        {/* Progress */}
        {video.completionPercentage > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm">{video.completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${video.completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-4">Description</h2>
        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
          {video.description || 'No description available'}
        </p>
      </div>

      {/* Notes */}
      {notes && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4">My Notes</h2>
          {notes.title && <h3 className="font-semibold mb-2">{notes.title}</h3>}
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {notes.content}
          </p>

          {notes.timestamps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold mb-2">Timestamps</h4>
              <div className="space-y-2">
                {notes.timestamps.map((ts: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    <span className="font-mono text-blue-600">{ts.time}s</span> - {ts.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <NotesEditor
        videoId={videoId}
        isOpen={isNotesOpen}
        onClose={() => {
          setIsNotesOpen(false);
          fetchNotes();
        }}
      />
    </div>
  );
}
