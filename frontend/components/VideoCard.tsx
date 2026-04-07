'use client';

import React from 'react';
import Link from 'next/link';
import { FiStar, FiTrash2 } from 'react-icons/fi';
import { formatDuration, formatDate } from '@/utils/helpers';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  channelName: string;
  completionPercentage: number;
  isFavorite: boolean;
  onFavoriteClick?: () => void;
  onDeleteClick?: () => void;
}

export default function VideoCard({
  id,
  title,
  thumbnail,
  duration,
  channelName,
  completionPercentage,
  isFavorite,
  onFavoriteClick,
  onDeleteClick,
}: VideoCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition group">
      {/* Thumbnail */}
      <Link href={`/watch/${id}`} className="relative block overflow-hidden bg-gray-200 dark:bg-gray-800 aspect-video">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
          <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition">
            ▶
          </span>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
          {formatDuration(duration)}
        </div>

        {/* Progress bar */}
        {completionPercentage > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300 dark:bg-gray-700">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/watch/${id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{channelName}</p>

        {/* Progress text */}
        {completionPercentage > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {completionPercentage}% watched
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onFavoriteClick}
            className={`p-2 rounded transition ${
              isFavorite
                ? 'text-yellow-500'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            <FiStar className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={onDeleteClick}
            className="p-2 rounded text-gray-400 hover:text-red-500 transition ml-auto"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
