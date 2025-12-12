import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const paymentMethods = [
  {
    name: 'Bitcoin (BTC)',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin Network',
    icon: '₿',
  },
  {
    name: 'Ethereum (ETH)',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    network: 'Ethereum Network (ERC-20)',
    icon: 'Ξ',
  },
  {
    name: 'Tether (USDT)',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    network: 'Ethereum Network (ERC-20)',
    icon: '₮',
  },
  {
    name: 'Bank Transfer',
    accountName: 'CipherVault Investments Ltd.',
    accountNumber: '1234567890',
    bankName: 'Global Trust Bank',
    routingNumber: 'GTB001234',
    swiftCode: 'GTBKUS33',
    icon: '🏦',
  },
];

const Deposit: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="deposit-page" style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <i className="icofont-plus-circle"></i> Deposit Funds
      </h2>
      <div className="deposit-form" style={{ background: 'linear-gradient(135deg, #181a20 0%, #23272f 100%)', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}>
        <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Amount (USD)</label>
        <input
          type="number"
          min="10"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter deposit amount"
          style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #f0b90b', marginBottom: '1.5rem', fontSize: '1rem' }}
        />
        <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Select Payment Method</label>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {paymentMethods.map((method, idx) => (
            <button
              key={method.name}
              className={`method-btn${selectedMethod.name === method.name ? ' selected' : ''}`}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: 8,
                border: selectedMethod.name === method.name ? '2px solid #f0b90b' : '1px solid #23272f',
                background: selectedMethod.name === method.name ? 'rgba(240,185,11,0.08)' : 'rgba(255,255,255,0.02)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onClick={() => setSelectedMethod(method)}
            >
              <span style={{ fontSize: '1.25rem' }}>{method.icon}</span> {method.name}
            </button>
          ))}
        </div>
        <div className="deposit-details" style={{ marginBottom: '2rem', background: 'rgba(240,185,11,0.05)', borderRadius: 12, padding: '1rem' }}>
          {selectedMethod.name !== 'Bank Transfer' ? (
            <>
              <div style={{ marginBottom: 8 }}><strong>Address:</strong> {selectedMethod.address}</div>
              <div style={{ marginBottom: 8 }}><strong>Network:</strong> {selectedMethod.network}</div>
              <button className="copy-btn" style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#f0b90b', color: '#23272f', fontWeight: 600, border: 'none', cursor: 'pointer' }} onClick={() => handleCopy(selectedMethod.address || '')}>
                {copied ? 'Copied!' : 'Copy Address'}
              </button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 8 }}><strong>Account Name:</strong> {selectedMethod.accountName}</div>
              <div style={{ marginBottom: 8 }}><strong>Account Number:</strong> {selectedMethod.accountNumber}</div>
              <div style={{ marginBottom: 8 }}><strong>Bank Name:</strong> {selectedMethod.bankName}</div>
              <div style={{ marginBottom: 8 }}><strong>Routing Number:</strong> {selectedMethod.routingNumber}</div>
              <div style={{ marginBottom: 8 }}><strong>SWIFT Code:</strong> {selectedMethod.swiftCode}</div>
              <button className="copy-btn" style={{ padding: '0.5rem 1rem', borderRadius: 8, background: '#f0b90b', color: '#23272f', fontWeight: 600, border: 'none', cursor: 'pointer' }} onClick={() => handleCopy(selectedMethod.accountNumber || '')}>
                {copied ? 'Copied!' : 'Copy Account Number'}
              </button>
            </>
          )}
        </div>
        <button className="primary-btn" style={{ width: '100%', padding: '1rem', borderRadius: 8, background: 'linear-gradient(135deg, #f0b90b, #d4a50a)', color: '#23272f', fontWeight: 700, fontSize: '1.1rem', border: 'none', cursor: 'pointer' }}>
          Submit Deposit Request
        </button>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.95rem' }}>
          After submitting, upload your payment proof in the Wallet section for faster approval.
        </p>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/wallet" style={{ color: '#f0b90b', fontWeight: 600, textDecoration: 'underline' }}>Go to Wallet</Link>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
