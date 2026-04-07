'use client';

import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useVideoStore } from '@/utils/videoStore';
import { useVideo } from '@/hooks/useVideo';
import AddVideoModal from '@/components/AddVideoModal';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { folders, fetchFolders, isLoading, createFolder } = useVideoStore();
  const { addPlaylistVideos, addVideo, isAdding } = useVideo();

  React.useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (name) {
      try {
        await createFolder(name);
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome to VideoHub</h1>
        <p className="text-blue-100 mb-6">
          Organize, learn, and grow with your video collection
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          <FiPlus className="w-5 h-5" />
          Add Videos
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Total Folders
          </h3>
          <p className="text-3xl font-bold">{folders.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Total Videos
          </h3>
          <p className="text-3xl font-bold">
            {folders.reduce((sum, f) => sum + f.videoCount, 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
            Watch Time
          </h3>
          <p className="text-3xl font-bold">0 hrs</p>
        </div>
      </div>

      {/* Folders Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Folders</h2>
          <button
            onClick={handleCreateFolder}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FiPlus className="w-5 h-5" />
            New Folder
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No folders yet. Create one to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <a
                key={folder._id}
                href={`/library/${folder._id}`}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition cursor-pointer"
              >
                <div className="text-4xl mb-2">{folder.icon}</div>
                <h3 className="font-bold text-lg mb-1">{folder.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {folder.videoCount} videos
                </p>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPlaylist={addPlaylistVideos}
        onAddVideo={addVideo}
        isLoading={isAdding}
        folders={folders}
      />
    </div>
  );
}
