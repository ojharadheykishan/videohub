'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import apiClient from '@/utils/api';
import toast from 'react-hot-toast';

interface NotesEditorProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Note {
  _id?: string;
  title?: string;
  content: string;
  timestamps: any[];
  blocks: any[];
}

export default function NotesEditor({
  videoId,
  isOpen,
  onClose,
}: NotesEditorProps) {
  const [note, setNote] = useState<Note>({
    content: '',
    timestamps: [],
    blocks: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && videoId) {
      fetchNotes();
    }
  }, [isOpen, videoId]);

  const fetchNotes = async () => {
    try {
      const { data } = await apiClient.get(`/notes/${videoId}`);
      if (data.note) {
        setNote(data.note);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiClient.post(`/notes/${videoId}`, note);
      toast.success('Notes saved!');
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save notes');
    } finally {
      setIsLoading(false);
    }
  };

  const addTimestamp = (time: number, text: string) => {
    setNote((prev) => ({
      ...prev,
      timestamps: [
        ...prev.timestamps,
        { time, text, color: '#fbbf24' },
      ],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h2 className="text-xl font-bold">Edit Notes</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              placeholder="Note title..."
              value={note.title || ''}
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              placeholder="Write your notes here..."
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Timestamps */}
          {note.timestamps.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Timestamps</label>
              <div className="space-y-2">
                {note.timestamps.map((ts, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded"
                  >
                    <span className="text-sm font-mono">{ts.time}s</span>
                    <span className="text-sm">{ts.text}</span>
                  </div>
                ))}
              </div>
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
              <FiSave className="w-4 h-4" />
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
