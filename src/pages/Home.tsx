import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchDetailedCryptoPrices, formatPrice, CryptoPrice } from '@/utils/cryptoPrices'
import { PLAN_CONFIG, formatPercent } from '@/utils/planConfig'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

// `stats` will be built inside the component to ensure translations are applied via `t()`

// The packages view will also be built inside the component so labels can be localized.

// Help tiles will be built inside the component and localized using `t()`.

function Home() {
  console.log('🏠 Home component rendering...')
  const { t } = useTranslation()
  
  // Live crypto prices
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  const [cryptoError, setCryptoError] = useState(false)
  
  useEffect(() => {
    async function loadPrices() {
      try {
        console.log('🏠 Loading real-time crypto prices...');
        const prices = await fetchDetailedCryptoPrices();
        if (prices && prices.length > 0) {
          setCryptoPrices(prices);
          setCryptoError(false);
          console.log(`✅ Loaded ${prices.length} cryptocurrencies with real-time data`);
        } else {
          console.warn('⚠️ No crypto prices received, will retry...');
          setCryptoError(true);
          setCryptoPrices([]);
        }
      } catch (error) {
        console.error('❌ Failed to load crypto prices:', error);
        setCryptoError(true);
        setCryptoPrices([]);
      }
    }

    // Initial load
    loadPrices();

    // Update every 30 seconds for real-time data
    const interval = setInterval(loadPrices, 30000);

    return () => clearInterval(interval);
  }, []);
  // Build slider & UI content using translations and localized labels
  const localizedStats = [
    { label: t('home.stats.volume'), value: '$38B', detail: t('home.stats.volumeDetail') },
    { label: t('home.stats.assets'), value: '350+', detail: t('home.stats.listedAssetsDetail') },
    { label: t('home.stats.clients'), value: '120M', detail: t('home.stats.clientsDetail') },
    { label: t('home.stats.fees'), value: '0.10%', detail: t('home.stats.feesDetail') }
  ]

  const localizedPackages = PLAN_CONFIG.map(plan => ({
    name: plan.name,
    badge: plan.featured ? t('home.packages.badge.featured') : t('home.packages.badge.standard'),
    description: plan.subtitle,
    bullets: [
      t('home.packages.bullets.duration', { duration: plan.durationLabel }),
      t('home.packages.bullets.dailyRoi', { daily: formatPercent(plan.dailyRate) }),
      t('home.packages.bullets.min', { min: plan.minCapital.toLocaleString() }),
      t('home.packages.bullets.max', { max: plan.maxCapital ? plan.maxCapital.toLocaleString() : t('home.packages.bullets.unlimited') }),
      t('home.packages.bullets.totalReturn', { total: plan.totalReturnPercent })
    ]
  }))

  const localizedHelpTiles = [
    {
      title: t('home.help.desk.title'),
      copy: t('home.help.desk.copy'),
      cta: { label: t('home.help.desk.cta'), href: '/contact.html' }
    },
    {
      title: t('home.help.faq.title'),
      copy: t('home.help.faq.copy'),
      cta: { label: t('home.help.faq.cta'), href: '/#faq' }
    },
    {
      title: t('home.help.blog.title'),
      copy: t('home.help.blog.copy'),
      cta: { label: t('home.help.blog.cta'), href: '/blog.html' }
    }
  ]

  return (
    <div className="home">
      {/* Language Switcher for Home page */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 100 }}>
        <LanguageSwitcher variant="home" />
      </div>
      {/* Live Crypto Ticker */}
      {cryptoPrices.length > 0 && (
        <div style={{
          background: 'linear-gradient(90deg, #181a20 0%, #1e2329 100%)',
          borderBottom: '1px solid rgba(240, 185, 11, 0.1)',
          padding: '10px 0',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            animation: 'scroll 30s linear infinite',
            gap: '40px',
            paddingLeft: '100%'
          }}>
            {[...cryptoPrices, ...cryptoPrices].map((crypto, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}>
                <img 
                  src={crypto.image} 
                  alt={crypto.symbol || 'crypto'} 
                  style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>
                  {crypto.symbol ? crypto.symbol.toUpperCase() : 'N/A'}
                </span>
                <span style={{ color: '#fff', fontSize: '13px' }}>
                  ${crypto.current_price ? formatPrice(crypto.current_price) : 'N/A'}
                </span>
                <span style={{ 
                  color: (crypto.price_change_percentage_24h && !isNaN(crypto.price_change_percentage_24h)) 
                    ? (crypto.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171') 
                    : '#64748b',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {(crypto.price_change_percentage_24h && !isNaN(crypto.price_change_percentage_24h))
                    ? `${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`
                    : 'N/A'
                  }
                </span>
              </div>
            ))}
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
      )}

      <section className="hero" id="hero">
        <div className="hero__content">
          <p className="eyebrow">{t('home.hero.eyebrow')}</p>
          <h1>{t('home.hero.title')}</h1>
          <p className="lead">
            {t('home.hero.subtitle')}
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary btn--lg" to="/signup">
              {t('home.hero.cta')}
            </Link>
            <Link className="btn btn--ghost btn--lg" to="/packages">
              {t('home.hero.ctaExplore')}
            </Link>
          </div>
          <div className="hero__pill">
            <img src="/images/gift.svg" alt="gift" height={32} />
            <div>
              <p className="hero__pill-title">{t('home.hero.pillTitle')}</p>
              <p className="hero__pill-copy">{t('home.hero.pillCopy')}</p>
            </div>
          </div>
        </div>
        <div className="hero__visual">
          <img src="/images/img1.png" alt="CipherVault dashboard" />
        </div>
      </section>

      <section className="stats" aria-label="Key metrics">
        {localizedStats.map((item) => (
          <article key={item.label}>
            <p className="stats__value">{item.value}</p>
            <p className="stats__label">{item.label}</p>
            <p className="stats__detail">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel" id="about">
        <div>
          <p className="eyebrow">{t('home.about.eyebrow')}</p>
          <h2>{t('home.about.title')}</h2>
          <p>{t('home.about.lead')}</p>
          <ul className="checklist">
            <li>{t('home.about.checklist.custody')}</li>
            <li>{t('home.about.checklist.quantResearch')}</li>
            <li>{t('home.about.checklist.advisors')}</li>
          </ul>
          <div className="panel__cta">
            <Link className="btn btn--primary" to="/signup">
              {t('home.about.ctaAdvisor')}
            </Link>
            <a className="btn btn--ghost" href="/about.html">
              {t('home.about.ctaMore')}
            </a>
          </div>
        </div>
        <div className="mission-card">
            <p className="eyebrow">{t('home.about.mission.eyebrow')}</p>
          <h3>{t('home.about.mission.title')}</h3>
          <p>
            We pair rigorous risk analytics with insurance-backed custody so teams can deploy capital confidently — even during volatility.
          </p>
          <div className="mission-grid">
            <div>
              <p className="mission-grid__title">{t('home.about.mission.grid.security.title')}</p>
              <p>{t('home.about.mission.grid.security.copy')}</p>
            </div>
            <div>
              <p className="mission-grid__title">{t('home.about.mission.grid.data.title')}</p>
              <p>{t('home.about.mission.grid.data.copy')}</p>
            </div>
            <div>
              <p className="mission-grid__title">{t('home.about.mission.grid.transparent.title')}</p>
              <p>{t('home.about.mission.grid.transparent.copy')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="packages" id="packages">
        <div className="section-heading">
          <p className="eyebrow">{t('home.packages.title')}</p>
          <h2>{t('home.packages.subtitle')}</h2>
          <p>
            {t('home.packages.description')}
          </p>
        </div>
        <div className="package-grid">
          {localizedPackages.map((pkg) => (
            <article key={pkg.name} className="package-card">
              <span className="package-card__badge">{pkg.badge}</span>
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <ul>
                {pkg.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="package-card__actions">
                <Link className="btn btn--primary" to="/dashboard">
                  {t('nav.dashboard')}
                </Link>
                <Link className="btn btn--ghost" to="/signup">
                  {t('home.packages.ctaAllocate') || 'Allocate now'}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="investment-guide" id="investment-guide">
        <div className="guide-content">
          <h2 className="guide-title">{t('home.guide.title')}</h2>
          <p className="guide-lead">{t('home.guide.lead')}</p>
          <div className="guide-steps">
            <div className="guide-step">
              <img src="/images/card.svg" alt="Verify identity" width="48" height="48" />
              <div className="guide-step-content">
                <h3>{t('home.guide.steps.verify.title')}</h3>
                <p>{t('home.guide.steps.verify.copy')}</p>
              </div>
            </div>
            <div className="guide-step">
              <img src="/images/person.svg" alt="Fund account" width="48" height="48" />
              <div className="guide-step-content">
                <h3>{t('home.guide.steps.fund.title')}</h3>
                <p>{t('home.guide.steps.fund.copy')}</p>
              </div>
            </div>
            <div className="guide-step">
              <img src="/images/money.svg" alt="Start investing" width="48" height="48" />
              <div className="guide-step-content">
                <h3>{t('home.guide.steps.start.title')}</h3>
                <p>{t('home.guide.steps.start.copy')}</p>
              </div>
            </div>
          </div>
          <div className="guide-cta">
            <Link className="btn btn--primary btn--lg" to="/signup">
              {t('home.guide.ctaGetStarted')}
            </Link>
          </div>
        </div>
      </section>

      <section className="help" id="faq">
        <div className="section-heading">
          <p className="eyebrow">{t('home.helpSection.eyebrow')}</p>
          <h2>{t('home.helpSection.title')}</h2>
        </div>
        <div className="help-grid">
          {localizedHelpTiles.map((tile) => (
            <article key={tile.title}>
              <h3>{tile.title}</h3>
              <p>{tile.copy}</p>
              <a className="btn btn--link" href={tile.cta.href}>
                {tile.cta.label} →
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mobile-apps">
        <div className="mobile-apps__content">
          <div className="mobile-apps__image">
            <img src="/images/img6.png" alt="Mobile Trading" />
          </div>
          <div className="mobile-apps__info">
            <h2>Invest on the go. Anywhere, anytime.</h2>
            <p className="lead">Stay in touch with our app and desktop client.</p>
            <div className="platform-grid">
              <div className="platform-item">
                <i className="platform-icon">📱</i>
                <p>App Store</p>
              </div>
              <div className="platform-item">
                <i className="platform-icon">🤖</i>
                <p>Android APK</p>
              </div>
              <div className="platform-item">
                <i className="platform-icon">▶️</i>
                <p>Google Play</p>
              </div>
              <div className="platform-item">
                <i className="platform-icon">🍎</i>
                <p>MacOS</p>
              </div>
              <div className="platform-item">
                <i className="platform-icon">🪟</i>
                <p>Windows</p>
              </div>
              <div className="platform-item">
                <i className="platform-icon">🐧</i>
                <p>Linux</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="help" id="faq">
        <div className="section-heading">
          <h2>Need Help?</h2>
        </div>
        <div className="help-grid">
          <article>
            <div className="help-icon">
              <img src="/images/customer care.svg" alt="Customer Care" height={40} />
            </div>
            <h3>24/7 Chat Support</h3>
            <p>Get 24/7 chat support with our friendly customer service agents at your service.</p>
            <a className="btn btn--primary" href="/chat.html">
              Chat Now
            </a>
          </article>
          <article>
            <div className="help-icon">
              <img src="/images/faq.svg" alt="FAQ" height={40} />
            </div>
            <h3>FAQ</h3>
            <p>View FAQs for detailed instructions on specific features.</p>
            <a className="btn btn--primary" href="/faq.html">
              Learn More
            </a>
          </article>
          <article>
            <div className="help-icon">
              <img src="/images/blog.svg" alt="Blog" height={40} />
            </div>
            <h3>Blogs</h3>
            <p>Stay up to date with the latest stories and commentary.</p>
            <a className="btn btn--primary" href="/blog.html">
              Learn More
            </a>
          </article>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact__card">
          <p className="eyebrow">Talk with us</p>
          <h2>Get paired with an advisor in under 24 hours.</h2>
          <p>
            Share your mandate, risk tolerances, and reporting needs. We will follow up with a tailored allocation plan and onboarding checklist.
          </p>
          <div className="contact__actions">
            <Link className="btn btn--primary btn--lg" to="/signup">
              Book intro call
            </Link>
            <a className="btn btn--ghost btn--lg" href="/contact.html">
              Contact form
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
