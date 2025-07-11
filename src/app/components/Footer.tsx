import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-2 rounded-xl border border-gray-200">
                <Image 
                  src="/images/myLogo.png" 
                  width={32} 
                  height={32} 
                  alt="BgClean Logo"
                  className="transition-transform duration-200"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 text-purple-500">BGClean</span>
                <span className="text-xs text-gray-500 font-medium">Background Remover</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              Remove image backgrounds instantly with our AI-powered tool. 100% free, private, and secure. 
              No sign-up required, all processing happens in your browser.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.719-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.097.118.112.223.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div className='space-y-5 sm:space-y-0 sm:flex sm:justify-between'>
            
            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">AI Background Removal</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">High Quality Output</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Privacy First</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">FAQ</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition-colors">Feature Request</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-xs text-gray-500">
                © 2025 BGClean. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Privacy Policy</a>
                <span className="text-gray-300">•</span>
                <a href="#" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Terms of Service</a>
                <span className="text-gray-300">•</span>
                <a href="#" className="text-xs text-gray-500 hover:text-blue-500 transition-colors">Cookie Policy</a>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">By @Micheal_Getu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
    </footer>
  );
};

export default Footer;