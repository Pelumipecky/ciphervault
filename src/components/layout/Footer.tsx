const footerLinks = [
  {
    title: 'About Us',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers.html' },
      { label: 'Community', href: '/community.html' },
      { label: 'Contact', href: '/contact.html' },
      { label: 'Terms', href: '/terms.html' },
      { label: 'Notices', href: '/notices.html' }
    ]
  },
  {
    title: 'Services',
    links: [
      { label: 'Downloads', href: '/downloads.html' },
      { label: 'Invest Now', href: '/bank-deposit.html' },
      { label: 'OTC Trading', href: '/otc.html' },
      { label: 'Historical Market Data', href: '/trading-data.html' },
      { label: 'Referral', href: '/referral.html' }
    ]
  },
  {
    title: 'Learn',
    links: [
      { label: 'Learn & Earn', href: '/learn.html' },
      { label: 'Browse Crypto Prices', href: '/markets-overview.html' },
      { label: 'Buy Tradable Altcoins', href: '/buy-altcoins.html' },
      { label: 'Research', href: '/research.html' },
      { label: 'Trust Wallet', href: '/trust-wallet.html' }
    ]
  }
]

const socialLinks = [
  { name: 'Discord', icon: '/images/discord.svg', href: '#' },
  { name: 'Telegram', icon: '/images/telegram.svg', href: '#' },
  { name: 'Twitter', icon: '/images/twitter.svg', href: '#' },
  { name: 'Facebook', icon: '/images/facebook.svg', href: '#' },
  { name: 'Instagram', icon: '/images/instagram.svg', href: '#' },
  { name: 'YouTube', icon: '/images/youtube.svg', href: '#' }
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <p className="site-footer__heading">{section.title}</p>
            <ul>
              {section.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="site-footer__newsletter">
          <p className="site-footer__heading">Subscribe to our newsletter</p>
          <p>Monthly digest of what's new and exciting from us.</p>
          <form className="site-footer__form" action="/subscribe.html">
            <input type="email" name="email" placeholder="Email address" aria-label="Email" required />
            <button className="btn btn--primary" type="submit">
              Subscribe
            </button>
          </form>
          <ul className="social-links">
            {socialLinks.map((social) => (
              <li key={social.name}>
                <a href={social.href} aria-label={social.name}>
                  <img src={social.icon} alt={social.name} height={40} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="site-footer__meta">
        <p>© {new Date().getFullYear()} CipherVault Investments. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
