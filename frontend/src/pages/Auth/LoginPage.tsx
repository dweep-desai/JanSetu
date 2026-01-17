import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [aadhar, setAadhar] = useState('');
  const [otpId, setOtpId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, verifyOTP } = useAuth();

  const handleAadharSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(aadhar);
      setOtpId(response.otp_id);
      // In development, show OTP in console
      console.log('OTP sent. Check console for OTP code in development.');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOTP(aadhar, otpId!, otpCode);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>JanSetu</h1>
        <p className="subtitle">Unified Digital Public Infrastructure Platform</p>
        
        {!otpId ? (
          <form onSubmit={handleAadharSubmit}>
            <div className="form-group">
              <label htmlFor="aadhar">Aadhar Card Number</label>
              <input
                type="text"
                id="aadhar"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value.toUpperCase().slice(0, 20))}
                placeholder="Enter Aadhar (e.g., ABC123456789)"
                required
                minLength={12}
                maxLength={20}
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                autoFocus
              />
              <p className="help-text">
                Check the <strong>backend terminal</strong> for your OTP code.
                <br />
                It will display: <code>OTP for Aadhar {aadhar}: XXXXXX</code>
              </p>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" disabled={loading || otpCode.length !== 6}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => {
                setOtpId(null);
                setOtpCode('');
                setError('');
              }}
            >
              Change Aadhar Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
