import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/90 via-primary to-accent/80 p-5">
      <div className="bg-card rounded-xl p-10 w-full max-w-md shadow-2xl border border-border">
        <h1 className="text-center text-foreground mb-2 text-3xl font-bold">JanSetu</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">Unified Digital Public Infrastructure Platform</p>
        
        {!otpId ? (
          <form onSubmit={handleAadharSubmit}>
            <div className="mb-5">
              <label htmlFor="aadhar" className="block mb-2 text-foreground font-medium">Aadhar Card Number</label>
              <input
                type="text"
                id="aadhar"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value.toUpperCase().slice(0, 20))}
                placeholder="Enter Aadhar (e.g., ABC123456789)"
                required
                minLength={12}
                maxLength={20}
                className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              />
            </div>
            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 text-sm border border-destructive/20">{error}</div>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit}>
            <div className="mb-5">
              <label htmlFor="otp" className="block mb-2 text-foreground font-medium">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                autoFocus
                className="w-full px-3 py-3 border border-input rounded-md text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Check the <strong>backend terminal</strong> for your OTP code.
                <br />
                It will display: <code className="bg-muted px-1 py-0.5 rounded">OTP for Aadhar {aadhar}: XXXXXX</code>
              </p>
            </div>
            {error && <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 text-sm border border-destructive/20">{error}</div>}
            <button 
              type="submit" 
              disabled={loading || otpCode.length !== 6}
              className="w-full py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed mb-3"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOtpId(null);
                setOtpCode('');
                setError('');
              }}
              className="w-full py-3 bg-secondary text-secondary-foreground rounded-md font-semibold hover:bg-secondary/80 transition-colors"
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
