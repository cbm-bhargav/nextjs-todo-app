'use client';

import Link from 'next/link';
import React from 'react';

export default function HomePage() {
 //ddd
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 bg-gray-100">
      <div className="p-10 bg-white rounded-lg shadow-lg text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Task Manager</h1>
        <div className="flex justify-center gap-6">
          <Link href={'/auth/register'}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Register
          </Link>
          <Link href={'/auth/login'}
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Login
          </Link>
        </div>    
      </div>    
    </main>
  );
}
