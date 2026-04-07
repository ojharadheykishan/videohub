'use client';

import React, { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlaylist: (url: string, name?: string) => Promise<void>;
  onAddVideo: (url: string, folderId: string) => Promise<void>;
  isLoading?: boolean;
  folderId?: string;
  folders?: Array<{ _id: string; name: string }>;
}

export default function AddVideoModal({
  isOpen,
  onClose,
  onAddPlaylist,
  onAddVideo,
  isLoading = false,
  folderId,
  folders = [],
}: AddVideoModalProps) {
  const [mode, setMode] = useState<'single' | 'playlist'>('single');
  const [url, setUrl] = useState('');
  const [folderName, setFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>(folderId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (mode === 'single' && !selectedFolderId) {
      toast.error('Please select a folder first');
      return;
    }

    try {
      if (mode === 'playlist') {
        await onAddPlaylist(url, folderName || undefined);
      } else {
        await onAddVideo(url, selectedFolderId);
      }
      setUrl('');
      setFolderName('');
      setSelectedFolderId(folderId || '');
      onClose();
    } catch (error) {
      // Error is already handled by parent
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">Add Videos</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`px-4 py-2 rounded transition ${
                mode === 'single'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Single Video
            </button>
            <button
              type="button"
              onClick={() => setMode('playlist')}
              className={`px-4 py-2 rounded transition ${
                mode === 'playlist'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Playlist
            </button>
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {mode === 'playlist' ? 'Playlist URL' : 'Video URL'}
            </label>
            <input
              type="url"
              placeholder="Paste YouTube link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Folder Selection (for single video) */}
          {mode === 'single' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Folder
              </label>
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">Select a folder...</option>
                {folders.map((folder) => (
                  <option key={folder._id} value={folder._id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Folder Name (for playlist) */}
          {mode === 'playlist' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Folder Name (optional)
              </label>
              <input
                type="text"
                placeholder="Custom folder name..."
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <FiPlus className="w-4 h-4" />
              {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
