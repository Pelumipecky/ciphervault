import { Link } from 'react-router-dom'

function Downloads() {
  return (
    <div className="downloads-page">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Downloads & Resources</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Access our comprehensive guides, tutorials, and educational resources to maximize your trading experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* PDF Guides Card */}
          <div className="package-card">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">PDF Guides</h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Comprehensive trading guides available in 20+ languages. Learn everything from beginner basics to advanced strategies.
              </p>
              <Link to="/downloads/guides" className="btn btn--primary btn--lg w-full">
                View PDF Guides
              </Link>
            </div>
          </div>

          {/* YouTube Videos Card */}
          <div className="package-card">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Video Tutorials</h3>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Watch our comprehensive video series covering trading strategies, platform features, and market analysis.
              </p>
              <Link to="/downloads/videos" className="btn btn--primary btn--lg w-full">
                Watch Videos
              </Link>
            </div>
          </div>

          {/* Mobile Apps card removed per request */}
        </div>

        {/* Desktop Applications */}
        <div className="package-card">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Desktop Applications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.449L24 3.449v9.451H10.949m-2.099 10.1L0 20.551V11.1h8.85m13.101-2.55L24 20.551V11.1H21.951"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Windows</h3>
              <p className="text-gray-400 mb-4 text-sm">Version 2.1.0</p>
              <button className="btn btn--primary w-full">
                Download for Windows
              </button>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-gray-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">macOS</h3>
              <p className="text-gray-400 mb-4 text-sm">Version 2.1.0</p>
              <button className="btn btn--primary w-full">
                Download for macOS
              </button>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.23 12.004a2.236 2.236 0 0 0 .055-1.015c-.153-.67-.665-1.207-1.298-1.203-.298.002-.539.112-.793.29-.406.286-.628.64-.628 1.106 0 .52.184.927.564 1.242.256.21.564.316.854.316.387 0 .693-.145.95-.406.23-.234.346-.54.296-.83zm-1.406-6.254c.0.0-.097-.015-.293-.027-.484-.03-1.133.178-1.605.533-.624.47-.964 1.086-.964 1.72 0 .37.13.706.376.97.118.127.25.23.39.305.0.0-.096-.034-.23-.08-.244-.086-.455-.214-.455-.214s-.096.034-.23.08c-.244.086-.455.214-.455.214.14-.075.272-.178.39-.305.246-.264.376-.6.376-.97 0-.634-.34-1.25-.964-1.72-.472-.355-1.12-.563-1.605-.533-.196.012-.293.027-.293.027s.293-1.254.293-1.254c.472-.355 1.12-.563 1.605-.533.196.012.293.027.293.027s-.293 1.254-.293 1.254z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Linux</h3>
              <p className="text-gray-400 mb-4 text-sm">Version 2.1.0</p>
              <button className="btn btn--primary w-full">
                Download for Linux
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Downloads