import { Link } from 'react-router-dom'

const packages = [
  {
    name: 'Genesis Starter',
    badge: 'Low Risk',
    badgeColor: 'secondary',
    description: 'Entry allocation for first-time digital asset investors seeking steady yield.',
    minimum: '$5,000',
    target: '6–9% APY',
    lockup: '3–6 months',
    details: '50% BTC/ETH, 30% tokenized T-bills, 20% stablecoin vaults',
    footer: 'Capital preservation with automated downside hedges.'
  },
  {
    name: 'Stable Yield',
    badge: 'Income',
    badgeColor: 'warning',
    description: 'Institutional staking, money markets, and fully collateralized CeFi loans.',
    minimum: '$15,000',
    target: '10–13% APY',
    lockup: '6 months',
    details: 'Audited LST ladder + overcollateralized lending pools',
    footer: 'Monthly cash flow distributed to USD, USDC, or USDT.'
  },
  {
    name: 'Growth Momentum',
    badge: 'Growth',
    badgeColor: 'info',
    description: 'Signal-driven basket of Layer-2, modular, and AI infrastructure protocols.',
    minimum: '$25,000',
    target: '15–22% CAGR',
    lockup: '12 months',
    details: 'Dynamic leverage bands with quarterly re-hedging',
    footer: 'Momentum signals + hedged futures'
  },
  {
    name: 'AI Macro Edge',
    badge: 'Balanced',
    badgeColor: 'primary',
    description: 'Quant-driven long/short program that reallocates weekly using machine learning factors.',
    minimum: '$40,000',
    target: '18–25% CAGR',
    lockup: '12 months',
    details: 'Systematic hedging + volatility capture',
    footer: 'AI-enhanced trading models and quantitative research.'
  },
  {
    name: 'Institutional Prime',
    badge: 'Premium',
    badgeColor: 'success',
    description: 'Custom mandate for allocators who require segregated custody and reporting.',
    minimum: '$250,000',
    target: '12–18% CAGR',
    lockup: 'Rolling liquidity windows',
    details: 'White-glove service & compliance',
    footer: 'Dedicated advisors with institutional reporting cadences.'
  },
  {
    name: 'Tokenized Real Assets',
    badge: 'Income',
    badgeColor: 'warning',
    description: 'Exposure to on-chain treasury bills, revenue-share deals, and tokenized credit.',
    minimum: '$75,000',
    target: '9–12% APY',
    lockup: '9 months',
    details: 'RWAs, invoice pools, short-term debt',
    footer: 'Regulatory-aware advisory for institutional clients.'
  }
]

function Packages() {
  return (
    <div className="packages-page">
      <header className="packages-page__header">
        <p className="eyebrow">CipherVault portfolios</p>
        <h1>Six institutional-grade packages for every growth mandate</h1>
        <p className="lead">
          Pick the mix that matches your risk tolerance and liquidity needs. Each package is rebalanced by our 
          research desk, comes with audited custody partners, and includes real-time reporting.
        </p>
        <div className="packages-page__actions">
          <Link className="btn btn--primary btn--lg" to="/signup">
            Open an Account
          </Link>
          <a className="btn btn--ghost btn--lg" href="/contact.html">
            Schedule a Call
          </a>
        </div>
      </header>

      <div className="packages-page__access">
        <div>
          <h2>Already investing with CipherVault?</h2>
          <p>Launch your dashboard to allocate instantly, or spin up a new account in minutes.</p>
        </div>
        <div className="packages-page__access-actions">
          <a className="btn btn--primary" href="/dashboard.html">
            Go to Dashboard
          </a>
          <Link className="btn btn--ghost" to="/signup">
            Create an Account
          </Link>
        </div>
      </div>

      <div className="package-grid">
        {packages.map((pkg) => (
          <article key={pkg.name} className="package-card">
            <div className="package-card__body">
              <span className={`package-badge package-badge--${pkg.badgeColor}`}>{pkg.badge}</span>
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <ul className="package-card__specs">
                <li><strong>Minimum:</strong> {pkg.minimum}</li>
                <li><strong>Target:</strong> {pkg.target}</li>
                <li><strong>Lockup:</strong> {pkg.lockup}</li>
                <li>{pkg.details}</li>
              </ul>
              <div className="package-card__actions">
                <a className="btn btn--primary" href="/dashboard.html">
                  Go to Dashboard
                </a>
                <Link className="btn btn--ghost" to="/signup">
                  Create an Account
                </Link>
              </div>
            </div>
            <footer className="package-card__footer">{pkg.footer}</footer>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Packages
