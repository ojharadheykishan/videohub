'use client';

import React from 'react';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';

const categories = ['All', 'Productivity', 'Learning', 'Design', 'AI', 'Development'];
const videos = [
  {
    title: 'Learn JavaScript in 30 Minutes',
    channel: 'VideoHub Academy',
    views: '1.2M views',
    time: '2 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Build an AI Study System',
    channel: 'Study Smart',
    views: '980K views',
    time: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'YouTube Playlist Workflow',
    channel: 'Creator Lab',
    views: '560K views',
    time: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1508610048659-a06ddf10cb0e?auto=format&fit=crop&w=900&q=80',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-600 text-white w-10 h-10 flex items-center justify-center text-xl font-bold">
              V
            </div>
            <div>
              <h1 className="text-lg font-semibold">VideoHub</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your learning playlist window</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 shadow-sm">
            <FiSearch className="text-gray-500" />
            <input
              className="bg-transparent outline-none text-sm w-96 text-gray-900 dark:text-gray-100"
              placeholder="Search videos, playlists, topics..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin" className="px-4 py-2 rounded-full border border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 text-sm font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition">
              Admin Access
            </Link>
            <Link href="/login" className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Login
            </Link>
            <Link href="/signup" className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr] gap-6">
          <div className="space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-black relative">
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80"
                alt="Hero"
                className="w-full h-96 object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-red-400">Video learning</p>
                <h2 className="text-4xl font-bold leading-tight">Create your own study playlist like YouTube</h2>
                <p className="max-w-xl text-gray-200">Import playlists, take notes, track your progress, and keep your learning flow organized.</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Link href="/signup" className="px-5 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition">
                    Get Started
                  </Link>
                  <Link href="/login" className="px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition">
                    Login
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button key={category} className="rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    {category}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-4">Trending playlists</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {videos.map((video) => (
                  <div key={video.title} className="group rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-950 hover:shadow-xl transition border border-gray-200 dark:border-gray-800">
                    <div className="relative">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-44 object-cover" />
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        12:34
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{video.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{video.channel}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{video.views} · {video.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Why VideoHub?</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li>✅ Build custom study playlists</li>
                <li>✅ Sync with YouTube content</li>
                <li>✅ Add notes to learn faster</li>
                <li>✅ Track your study habits</li>
              </ul>
            </div>
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="bg-gray-100 dark:bg-gray-950 px-6 py-4">
                <h3 className="text-lg font-semibold">Quick start</h3>
              </div>
              <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="space-y-1">
                  <p className="font-semibold">1. Login or Sign up</p>
                  <p>Use admin/admin to preview admin access.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">2. Import playlists</p>
                  <p>Add YouTube playlists and save them in folders.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">3. Add notes</p>
                  <p>Take timestamped notes while watching.</p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
