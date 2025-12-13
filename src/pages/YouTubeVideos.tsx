import { useState } from 'react'
import { Link } from 'react-router-dom'

const videoCategories = [
  { id: 'all', name: 'All Videos', count: 24 },
  { id: 'beginner', name: 'Beginner Guides', count: 8 },
  { id: 'technical', name: 'Technical Analysis', count: 6 },
  { id: 'strategies', name: 'Trading Strategies', count: 5 },
  { id: 'crypto', name: 'Cryptocurrency', count: 3 },
  { id: 'platform', name: 'Platform Tutorials', count: 2 }
]

const videos = [
  {
    id: 1,
    title: 'Getting Started with CipherVault - Complete Beginner Guide',
    description: 'Learn the basics of trading on CipherVault platform. Perfect for newcomers to cryptocurrency trading.',
    duration: '12:34',
    views: '125K',
    likes: '8.2K',
    thumbnail: '/images/video-thumbnails/getting-started.jpg',
    category: 'beginner',
    publishedAt: '2024-01-15',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: 'Understanding Candlestick Patterns - Essential Knowledge',
    description: 'Master the most important candlestick patterns every trader should know.',
    duration: '18:45',
    views: '89K',
    likes: '6.1K',
    thumbnail: '/images/video-thumbnails/candlesticks.jpg',
    category: 'technical',
    publishedAt: '2024-01-12',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 3,
    title: 'Risk Management: Protecting Your Trading Capital',
    description: 'Learn essential risk management techniques to preserve and grow your trading capital.',
    duration: '15:22',
    views: '156K',
    likes: '12.3K',
    thumbnail: '/images/video-thumbnails/risk-management.jpg',
    category: 'strategies',
    publishedAt: '2024-01-10',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 4,
    title: 'How to Use Technical Indicators Effectively',
    description: 'Comprehensive guide to using RSI, MACD, Moving Averages, and other key indicators.',
    duration: '22:18',
    views: '203K',
    likes: '15.7K',
    thumbnail: '/images/video-thumbnails/indicators.jpg',
    category: 'technical',
    publishedAt: '2024-01-08',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 5,
    title: 'Cryptocurrency Trading Strategies for 2024',
    description: 'Advanced strategies specifically designed for cryptocurrency markets.',
    duration: '28:45',
    views: '178K',
    likes: '13.9K',
    thumbnail: '/images/video-thumbnails/crypto-strategies.jpg',
    category: 'crypto',
    publishedAt: '2024-01-05',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 6,
    title: 'Setting Up Your First Trade on CipherVault',
    description: 'Step-by-step tutorial on how to place your first trade on our platform.',
    duration: '8:12',
    views: '267K',
    likes: '18.4K',
    thumbnail: '/images/video-thumbnails/first-trade.jpg',
    category: 'platform',
    publishedAt: '2024-01-03',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 7,
    title: 'Trading Psychology: Mastering Your Emotions',
    description: 'Learn how to control fear, greed, and other emotions that affect trading decisions.',
    duration: '16:33',
    views: '134K',
    likes: '9.8K',
    thumbnail: '/images/video-thumbnails/psychology.jpg',
    category: 'beginner',
    publishedAt: '2024-01-01',
    youtubeId: 'dQw4w9WgXcQ'
  },
  {
    id: 8,
    title: 'Advanced Chart Analysis Techniques',
    description: 'Deep dive into advanced chart analysis methods and pattern recognition.',
    duration: '25:41',
    views: '98K',
    likes: '7.2K',
    thumbnail: '/images/video-thumbnails/chart-analysis.jpg',
    category: 'technical',
    publishedAt: '2023-12-28',
    youtubeId: 'dQw4w9WgXcQ'
  }
]

function YouTubeVideos() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatViews = (views: string) => {
    const num = parseInt(views.replace('K', '000'))
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return views
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <div className="youtube-videos-page">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/downloads" className="inline-flex items-center text-red-500 hover:text-red-400 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Downloads
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Video Tutorials</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Watch our comprehensive video series covering trading strategies, platform features, and market analysis.
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white pl-12 focus:border-red-500 focus:outline-none"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {videoCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map(video => (
            <div key={video.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-red-500/50 transition-all duration-300 group">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-700 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="text-white text-sm font-medium">Video Preview</div>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 leading-tight">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                  {video.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {formatViews(video.views)}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {video.likes}
                    </span>
                  </div>
                  <span>{formatDate(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredVideos.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300">
              Load More Videos
            </button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-8 border border-red-500/20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get notified when we release new video tutorials and educational content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YouTubeVideos