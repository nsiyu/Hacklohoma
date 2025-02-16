'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Company = {
  name: string;
  logo: string;
  levels: string[];
};

type Language = {
  name: string;
  logo: string;
};

const companies: Company[] = [
  { name: 'Meta', logo: '/logos/meta.svg', levels: ['E3'] },
  { name: 'Google', logo: '/logos/google.png', levels: ['L3'] },
  { name: 'Amazon', logo: '/logos/amazon.png', levels: ['SDE I'] },
  { name: 'Apple', logo: '/logos/apple.png', levels: ['ICT2'] },
  { name: 'Netflix', logo: '/logos/netflix.png', levels: ['SWE I'] },
];

const languages: Language[] = [
  { name: 'Python', logo: '/logos/python.svg' },
  { name: 'C++', logo: '/logos/c++.png' },
];

const levels = [
  { name: 'Easy', color: 'emerald' },
  { name: 'Medium', color: 'yellow' },
  { name: 'Hard', color: 'red' },
];

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logos/codem.svg"
              alt="Codem"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-semibold text-gray-900">Codem</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Catalog</h1>
          <p className="text-lg text-gray-600">Find the perfect practice interview for your needs</p>
        </div>

        <div className="relative mb-12">
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">By Company</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link 
                key={company.name}
                href={`/interview?company=${company.name.toLowerCase()}`}
                className="group block p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={100}
                    height={32}
                    className="h-8 w-auto object-contain"
                  />
                  <div className="flex gap-2">
                    {company.levels.map((level) => (
                      <span key={level} className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                  {company.name} Interviews
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">By Programming Language</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {languages.map((language) => (
              <Link
                key={language.name}
                href={`/interview?language=${language.name.toLowerCase()}`}
                className="group block p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <Image
                    src={language.logo}
                    alt={language.name}
                    width={40}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                  {language.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">By DSA: Difficulty Level</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => (
              <Link
                key={level.name}
                href={`/interview?difficulty=${level.name.toLowerCase()}`}
                className="group block p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${level.color === 'emerald' && 'bg-emerald-100 text-emerald-700'}
                      ${level.color === 'yellow' && 'bg-yellow-100 text-yellow-700'}
                      ${level.color === 'red' && 'bg-red-100 text-red-700'}
                    `}
                  >
                    {level.name}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">
                  {level.name} Questions
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Catalog;
