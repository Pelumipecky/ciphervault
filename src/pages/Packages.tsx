import { Link } from 'react-router-dom'
import { PLAN_CONFIG, formatPercent } from '@/utils/planConfig'

const packages = PLAN_CONFIG.map(plan => ({
  name: plan.name,
  badge: plan.featured ? 'Featured' : 'Standard',
  badgeColor: plan.featured ? 'success' : 'primary',
  description: plan.subtitle,
  minimum: `$${plan.minCapital.toLocaleString()}`,
  target: `${formatPercent(plan.dailyRate)} daily ROI`,
  lockup: plan.durationLabel,
  details: `Total return: ${plan.totalReturnPercent}% | Sample earnings: $${plan.sampleEarning.toLocaleString()}`,
  footer: `Investment range: $${plan.minCapital.toLocaleString()} - ${plan.maxCapital ? `$${plan.maxCapital.toLocaleString()}` : 'Unlimited'}`
}))

function Packages() {
  return (
    <div className="packages-page">
      <header className="packages-page__header">
        <p className="eyebrow">Cypher Vault portfolios</p>
        <h1>Six investment plans for every growth strategy</h1>
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
          <h2>Already investing with Cypher Vault?</h2>
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

      <div className="package-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
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
