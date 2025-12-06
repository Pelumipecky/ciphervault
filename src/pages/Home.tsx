import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchDetailedCryptoPrices, formatPrice, CryptoPrice } from '@/utils/cryptoPrices'

const stats = [
  { label: '24h Volume', value: '$38B', detail: 'Traded across spot, futures, and structured products.' },
  { label: 'Listed Assets', value: '350+', detail: 'Curated coins and tokenized yield strategies.' },
  { label: 'Clients', value: '120M', detail: 'Global wallets, treasuries, and family offices.' },
  { label: 'Fees', value: '0.10%', detail: 'Institutional pricing with maker rebates.' }
]

const packages = [
  {
    name: 'Genesis Starter',
    badge: 'Low Risk',
    description: 'Entry allocation for first-time digital asset investors seeking steady yield.',
    bullets: ['50% BTC + ETH core', '30% tokenized T-bills', '20% stablecoin vaults']
  },
  {
    name: 'AI Macro Edge',
    badge: 'Balanced',
    description: 'Signals-driven basket focused on AI infra, DePIN, and layer-two rollups.',
    bullets: ['Quant momentum guardrails', 'Automatically hedged with options', 'Weekly risk briefings']
  },
  {
    name: 'Real-World Assets',
    badge: 'Income',
    description: 'Tokenized invoices, treasuries, and commodity streams under full compliance.',
    bullets: ['Yield monitored hourly', 'Institutional custody partners', 'Insurance-backed storage']
  }
]

const helpTiles = [
  {
    title: '24/7 Desk',
    copy: 'Message advisors anytime for rebalancing help or treasury workflows.',
    cta: { label: 'Chat Now', href: '/contact.html' }
  },
  {
    title: 'FAQ Library',
    copy: 'Browse custody, staking, and on/off-ramp guidance in our docs.',
    cta: { label: 'View FAQ', href: '/#faq' }
  },
  {
    title: 'Blog + Research',
    copy: 'Weekly on-chain insights and macro notes straight from the quant floor.',
    cta: { label: 'Read Insights', href: '/blog.html' }
  }
]

function Home() {
  console.log('🏠 Home component rendering...')
  
  // Live crypto prices
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([])
  
  useEffect(() => {
    async function loadPrices() {
      const prices = await fetchDetailedCryptoPrices()
      setCryptoPrices(prices)
    }
    loadPrices()
    const interval = setInterval(loadPrices, 60000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="home">
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
                  alt={crypto.symbol} 
                  style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span style={{ color: '#fff', fontWeight: '600', fontSize: '13px' }}>
                  {crypto.symbol.toUpperCase()}
                </span>
                <span style={{ color: '#fff', fontSize: '13px' }}>
                  ${formatPrice(crypto.current_price)}
                </span>
                <span style={{ 
                  color: crypto.price_change_percentage_24h >= 0 ? '#4ade80' : '#f87171',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
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
          <p className="eyebrow">Institutional crypto platform</p>
          <h1>Disciplined exposure for serious digital-asset teams.</h1>
          <p className="lead">
            CipherVault blends custody, quantitative research, and transparent reporting so every allocation is as resilient as a vault.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary btn--lg" to="/signup">
              Open an account
            </Link>
            <Link className="btn btn--ghost btn--lg" to="/packages">
              Explore packages
            </Link>
          </div>
          <div className="hero__pill">
            <img src="/images/gift.svg" alt="gift" height={32} />
            <div>
              <p className="hero__pill-title">Trade Bitcoin with zero fees</p>
              <p className="hero__pill-copy">Available for new clients through Q1.</p>
            </div>
          </div>
        </div>
        <div className="hero__visual">
          <img src="/images/img1.png" alt="CipherVault dashboard" />
        </div>
      </section>

      <section className="stats" aria-label="Key metrics">
        {stats.map((item) => (
          <article key={item.label}>
            <p className="stats__value">{item.value}</p>
            <p className="stats__label">{item.label}</p>
            <p className="stats__detail">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel" id="about">
        <div>
          <p className="eyebrow">About CipherVault</p>
          <h2>Security-first infrastructure with data-driven allocations.</h2>
          <p>
            Every wallet is verified, every counterparty audited, and every rebalance recorded. Family offices, treasuries, and protocol foundations trust us to
            scale exposure without compromising governance.
          </p>
          <ul className="checklist">
            <li>Custody partners meeting SOC 2 + insurance standards</li>
            <li>Quant research spanning DeFi, RWA, and AI infrastructure</li>
            <li>Dedicated advisors with institutional reporting cadences</li>
          </ul>
          <div className="panel__cta">
            <Link className="btn btn--primary" to="/signup">
              Talk to an advisor
            </Link>
            <a className="btn btn--ghost" href="/about.html">
              More about us
            </a>
          </div>
        </div>
        <div className="mission-card">
          <p className="eyebrow">Mission</p>
          <h3>Unlock long-term financial growth with disciplined crypto exposure.</h3>
          <p>
            We pair rigorous risk analytics with insurance-backed custody so teams can deploy capital confidently — even during volatility.
          </p>
          <div className="mission-grid">
            <div>
              <p className="mission-grid__title">Security First</p>
              <p>Every asset is vetted for compliance, custody, and counterparty risk.</p>
            </div>
            <div>
              <p className="mission-grid__title">Data Driven</p>
              <p>Quant models, on-chain telemetry, and AI insights guide allocation.</p>
            </div>
            <div>
              <p className="mission-grid__title">Transparent</p>
              <p>Real-time dashboards, blockchain proofs, and monthly letters.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="packages" id="packages">
        <div className="section-heading">
          <p className="eyebrow">CipherVault portfolios</p>
          <h2>Six institutional-grade packages for every mandate.</h2>
          <p>
            Pick the mix that matches your risk tolerance and liquidity needs. Each package is rebalanced by our research desk and audited quarterly.
          </p>
        </div>
        <div className="package-grid">
          {packages.map((pkg) => (
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
                <a className="btn btn--primary" href="/dashboard.html">
                  Go to dashboard
                </a>
                <Link className="btn btn--ghost" to="/signup">
                  Allocate now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="investment-guide" id="investment-guide">
        <div className="guide-content">
          <h2 className="guide-title">Build your investment portfolio</h2>
          <p className="guide-lead">Start your first investment with these easy steps.</p>
          <div className="guide-steps">
            <div className="guide-step">
              <img src="/images/card.svg" alt="Verify identity" width="48" height="48" />
              <div className="guide-step-content">
                <h3>Verify your identity</h3>
                <p>Complete the identity verification process to secure your account and transactions.</p>
              </div>
            </div>
            <div className="guide-step">
              <img src="/images/person.svg" alt="Fund account" width="48" height="48" />
              <div className="guide-step-content">
                <h3>Fund your account</h3>
                <p>Add funds to your crypto account to start investing. You can add funds with a variety of payment methods.</p>
              </div>
            </div>
            <div className="guide-step">
              <img src="/images/money.svg" alt="Start investing" width="48" height="48" />
              <div className="guide-step-content">
                <h3>Start investing</h3>
                <p>You're good to go! Buy/sell crypto, set up recurring buys for your investments, and discover what CipherVault Investments has to offer.</p>
              </div>
            </div>
          </div>
          <div className="guide-cta">
            <Link className="btn btn--primary btn--lg" to="/signup">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="help" id="faq">
        <div className="section-heading">
          <p className="eyebrow">Need help?</p>
          <h2>Advisors, docs, and research on standby.</h2>
        </div>
        <div className="help-grid">
          {helpTiles.map((tile) => (
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
