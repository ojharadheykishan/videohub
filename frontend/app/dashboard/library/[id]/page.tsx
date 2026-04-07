'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useVideoStore } from '@/utils/videoStore';
import VideoCard from '@/components/VideoCard';
import { FiPlus } from 'react-icons/fi';
import AddVideoModal from '@/components/AddVideoModal';
import { useVideo } from '@/hooks/useVideo';

export default function LibraryPage() {
  const params = useParams();
  const folderId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentFolder, videos, fetchFolder, isLoading, toggleFavorite, deleteVideo } = useVideoStore();
  const { addVideo, isAdding } = useVideo();

  useEffect(() => {
    if (folderId) {
      fetchFolder(folderId);
    }
  }, [folderId, fetchFolder]);

  const handleAddVideo = async (videoUrl: string) => {
    if (currentFolder) {
      await addVideo(videoUrl, currentFolder._id);
      await fetchFolder(currentFolder._id);
    }
  };

  const handleFavorite = async (videoId: string) => {
    await toggleFavorite(videoId);
  };

  const handleDelete = async (videoId: string) => {
    if (confirm('Delete this video?')) {
      await deleteVideo(videoId);
      if (currentFolder) {
        await fetchFolder(currentFolder._id);
      }
    }
  };

  if (!folderId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Folder Header */}
      {currentFolder && (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-5xl mb-2">{currentFolder.icon}</div>
              <h1 className="text-3xl font-bold mb-2">{currentFolder.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentFolder.videoCount} videos
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <FiPlus className="w-5 h-5" />
              Add Video
            </button>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-800 rounded-lg h-80 animate-pulse"
            />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No videos in this folder
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus className="w-5 h-5" />
            Add Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              id={video._id}
              title={video.title}
              thumbnail={video.thumbnail}
              duration={video.duration}
              channelName={video.channelName}
              completionPercentage={video.completionPercentage}
              isFavorite={video.isFavorite}
              onFavoriteClick={() => handleFavorite(video._id)}
              onDeleteClick={() => handleDelete(video._id)}
            />
          ))}
        </div>
      )}

      <AddVideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPlaylist={async (url) => {
          await handleAddVideo(url);
        }}
        onAddVideo={handleAddVideo}
        isLoading={isAdding}
      />
    </div>
  );
}
