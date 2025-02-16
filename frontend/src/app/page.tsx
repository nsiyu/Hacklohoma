import VideoEditor from '@/components/VideoEditor';
import Link from 'next/link';
import Image from 'next/image';

const Home = () => {
  return (
    <div className="min-h-screen text-gray-900 relative overflow-x-hidden overflow-hidden font-montserrat overscroll-none bg-white">
      <div className="fixed inset-0 -z-10">
        <div className="inset-0 bg-[radial-gradient(ellipse_at_top,rgba(224,242,254,0.5)_0%,transparent_50%)] h-screen sticky top-0"></div>
        <div className="inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(220,252,231,0.4)_0%,transparent_50%)] h-screen sticky top-0"></div>
        <div className="top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob sticky"></div>
        <div className="top-40 right-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 sticky"></div>
        <div className="-bottom-8 left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 sticky"></div>
      </div>

      <nav className="relative py-4 z-50 border-b">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="font-semibold text-xl tracking-tight relative group flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-600">
                  <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M8 21H5C3.89543 21 3 20.1046 3 19V16M21 8V5C21 3.89543 20.1046 3 19 3H16M21 16V19C21 20.1046 20.1046 21 19 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 9L11 11.5L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 9L13 11.5L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex">
                  <span className="text-gray-900 transition-colors duration-300">Codem</span>
                </div>
                <span className="absolute -inset-x-4 -inset-y-1 group-hover:bg-emerald-50 rounded-lg transition-colors duration-300 -z-10"></span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-emerald-50">
                Log in
              </button>
              <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-2 px-5 rounded-lg transition-all duration-200 shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 transform hover:-translate-y-0.5">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative">
        <div className="relative flex flex-col items-center justify-center mt-16 py-12 px-4">
          <div className="absolute -left-4 top-1/4">
            <div className="w-24 h-24 bg-emerald-50 rounded-lg rotate-12 animate-float"></div>
          </div>
          <div className="absolute right-10 bottom-1/4">
            <div className="w-16 h-16 bg-green-50 rounded-full animate-float animation-delay-2000"></div>
          </div>
          
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              <span className="  relative inline-block group">
                Ace
      
              </span>
              {' '}Your Technical Interviews
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
              Simulate real technical interviews with AI.
            </p>

            <Link href="/catalog">
              <button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg">
                Try it out ✨
              </button>
            </Link>
          </div>
        </div>

        <div className="relative container mx-auto mt-12 mb-16 px-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm font-medium mb-8">
              Practice interviews for top tech companies
            </p>
            <div className="flex justify-center items-center gap-x-12 grayscale opacity-70">
              <Image src="/logos/meta.svg" alt="Meta" width={100} height={32} className="h-8 w-auto object-contain" />
              <Image src="/logos/apple.png" alt="Apple" width={100} height={24} className="h-6 w-auto object-contain" />
              <Image src="/logos/amazon.png" alt="Amazon" width={100} height={32} className="h-8 w-auto object-contain" />
              <Image src="/logos/netflix.png" alt="Netflix" width={100} height={28} className="h-7 w-auto object-contain" />
              <Image src="/logos/google.png" alt="Google" width={100} height={28} className="h-7 w-auto object-contain" />
            </div>
          </div>
        </div>

        <div className="relative container mx-auto mt-12 px-4">
          <VideoEditor />
        </div>
      </div>
    </div>
  );
};

export default Home;