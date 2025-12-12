import { Link } from 'react-router-dom'

function Downloads() {
  return (
    <div className="downloads-page min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
            Downloads & Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Access our comprehensive guides, tutorials, and educational resources to maximize your trading experience on CipherVault.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {/* PDF Guides Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors duration-300">PDF Guides</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Comprehensive trading guides available in 20+ languages. Learn everything from beginner basics to advanced strategies.
                </p>
                <Link
                  to="/downloads/guides"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25 hover:scale-105"
                >
                  View PDF Guides
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* YouTube Videos Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-red-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors duration-300">Video Tutorials</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Watch our comprehensive video series covering trading strategies, platform features, and market analysis.
                </p>
                <Link
                  to="/downloads/videos"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:scale-105"
                >
                  Watch Videos
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m-3 7.5A9.5 9.5 0 1121.5 12 9.5 9.5 0 0112 2.5z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Apps Card */}
          <div className="group relative md:col-span-2 lg:col-span-1">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">Mobile Apps</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Download our mobile applications for iOS and Android to trade on the go with full functionality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    App Store
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.61 3 21.09 3 20.5Z"/>
                      <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z"/>
                      <path d="M20.16 10.81C20.5 11.08 20.75 11.53 20.75 12C20.75 12.47 20.5 12.92 20.16 13.19L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z"/>
                      <path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z"/>
                    </svg>
                    Google Play
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Applications */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl"></div>
          <div className="relative bg-gray-800/40 backdrop-blur-xl rounded-3xl p-10 border border-gray-700/30 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Desktop Applications
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Download our native desktop applications for the most powerful trading experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group text-center p-8 bg-gray-800/60 rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.449L24 3.449v9.451H10.949m-2.099 10.1L0 20.551V11.1h8.85m13.101-2.55L24 20.551V11.1H21.951"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">Windows</h3>
                <p className="text-gray-300 mb-6">Version 2.1.0 • 64-bit</p>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105">
                  Download for Windows
                </button>
              </div>

              <div className="group text-center p-8 bg-gray-800/60 rounded-2xl border border-gray-700/50 hover:border-gray-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-gray-500/10 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-300 transition-colors duration-300">macOS</h3>
                <p className="text-gray-300 mb-6">Version 2.1.0 • Intel & Apple Silicon</p>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-gray-500/25 hover:scale-105">
                  Download for macOS
                </button>
              </div>

              <div className="group text-center p-8 bg-gray-800/60 rounded-2xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.23 12.004a2.236 2.236 0 0 0 .055-1.015c-.153-.67-.665-1.207-1.298-1.203-.298.002-.539.112-.793.29-.406.286-.628.64-.628 1.106 0 .52.184.927.564 1.242.256.21.564.316.854.316.387 0 .693-.145.95-.406.23-.234.346-.54.296-.83zm-1.406-6.254c.0.0-.097-.015-.293-.027-.484-.03-1.133.178-1.605.533-.624.47-.964 1.086-.964 1.72 0 .37.13.706.376.97.118.127.25.23.39.305.0.0-.096-.034-.23-.08-.244-.086-.455-.214-.455.214s-.096.034-.23.08c-.244.086-.455.214-.455.214.14-.075.272-.178.39-.305.246-.264.376-.6.376-.97 0-.634-.34-1.25-.964-1.72-.472-.355-1.12-.563-1.605-.533-.196.012-.293.027-.293.027s.293-1.254.293-1.254c.472-.355 1.12-.563 1.605-.533.196.012.293.027.293.027s-.293 1.254-.293 1.254z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors duration-300">Linux</h3>
                <p className="text-gray-300 mb-6">Version 2.1.0 • .deb & .rpm</p>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 hover:scale-105">
                  Download for Linux
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Downloads