'use client';

import Link from 'next/link';
import { PartnerSearch } from '@/components/shared/PartnerSearch';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 text-amber-900 p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-3xl text-center mb-8">
        Oops! Looks like this dish went missing from the menu!
      </h2>
      {/* Placeholder for food-themed SVG illustration */}
      <div className="relative w-64 h-64 mb-8">
        <svg
          width="100%" height="100%" viewBox="0 0 200 200"
          fill="none" xmlns="http://www.w3.org/2000/svg"
          className="text-amber-500"
        >
          <circle cx="100" cy="100" r="80" fill="currentColor"/>
          <path d="M100 20 L130 80 L70 80 Z" fill="#FFF"/>
          <rect x="85" y="110" width="30" height="40" fill="#FFF" rx="5"/>
          <circle cx="80" cy="110" r="15" fill="#FFF"/>
          <circle cx="120" cy="110" r="15" fill="#FFF" rx="5"/>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
          Oops!
        </span>
      </div>
      <Link href="/">
        <button className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300">
          Go Home
        </button>
      </Link>
      {/* PartnerSearch component */}
      <div className="mt-12 w-full max-w-md">
        <PartnerSearch />
      </div>
    </div>
  );
}
