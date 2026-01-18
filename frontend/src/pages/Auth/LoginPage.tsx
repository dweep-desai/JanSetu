import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './LoginPage.css';

type LoginTab = 'citizen' | 'service-provider' | 'admin';
type SPSubTab = 'login' | 'register';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LoginTab>('citizen');
  const [spSubTab, setSpSubTab] = useState<SPSubTab>('login');
  
  // Citizen login state (same as before)
  const [aadhar, setAadhar] = useState('');
  const [otpId, setOtpId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  
  // Service Provider login state
  const [spLoginAadhar, setSpLoginAadhar] = useState('');
  const [spLoginOtpId, setSpLoginOtpId] = useState<string | null>(null);
  const [spLoginOtpCode, setSpLoginOtpCode] = useState('');
  
  // Service Provider registration state
  const [spAadhar, setSpAadhar] = useState('');
  const [spRequestType, setSpRequestType] = useState<'ESANJEEVANI' | 'MKISAN' | ''>('');
  const [spOrganizationName, setSpOrganizationName] = useState('');
  const [spRegistrationNumber, setSpRegistrationNumber] = useState('');
  // e-Sanjeevani fields
  const [spProviderType, setSpProviderType] = useState('');
  const [spSpecialization, setSpSpecialization] = useState('');
  const [spYearsOfExperience, setSpYearsOfExperience] = useState('');
  // mKisan fields
  const [spProviderCategory, setSpProviderCategory] = useState('');
  const [spBusinessLicense, setSpBusinessLicense] = useState('');
  const [spGstNumber, setSpGstNumber] = useState('');
  const [spYearsInBusiness, setSpYearsInBusiness] = useState('');
  
  // Admin login state
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { login, verifyOTP } = useAuth();

  // Citizen login handlers (same as before)
  const handleAadharSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(aadhar);
      setOtpId(response.otp_id);
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

  // Service Provider login handlers
  const handleSPLoginAadharSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/sp/login', { aadhar: spLoginAadhar });
      setSpLoginOtpId(response.data.otp_id);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSPLoginOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOTP(spLoginAadhar, spLoginOtpId!, spLoginOtpCode);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Service Provider registration handler
  const handleSPRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const registrationData: any = {
        aadhar: spAadhar,
        request_type: spRequestType,
        organization_name: spOrganizationName || null,
        registration_number: spRegistrationNumber || null,
      };

      if (spRequestType === 'ESANJEEVANI') {
        registrationData.provider_type = spProviderType;
        // Specialization only required for DOCTOR and OTHER
        if (spProviderType === 'DOCTOR' || spProviderType === 'OTHER') {
          registrationData.specialization = spSpecialization;
        }
        registrationData.years_of_experience = spYearsOfExperience ? parseInt(spYearsOfExperience) : null;
      } else if (spRequestType === 'MKISAN') {
        registrationData.provider_category = spProviderCategory;
        registrationData.business_license = spBusinessLicense || null;
        registrationData.gst_number = spGstNumber || null;
        registrationData.years_in_business = spYearsInBusiness ? parseInt(spYearsInBusiness) : null;
      }

      const response = await api.post('/sp-registration/register', registrationData);
      setSuccess(`Registration request submitted successfully! Request ID: ${response.data.request_id}. Your request has been assigned to admin ${response.data.assigned_admin.full_name} for approval.`);
      
      // Reset form
      setSpAadhar('');
      setSpRequestType('');
      setSpOrganizationName('');
      setSpRegistrationNumber('');
      setSpProviderType('');
      setSpSpecialization('');
      setSpYearsOfExperience('');
      setSpProviderCategory('');
      setSpBusinessLicense('');
      setSpGstNumber('');
      setSpYearsInBusiness('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit registration request');
    } finally {
      setLoading(false);
    }
  };

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/admin/login', {
        username: adminUsername,
        password: adminPassword,
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Fetch user details
      const userResponse = await api.get('/auth/me');
      const userData = userResponse.data;
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">JanSetu</h1>
          <p className="login-subtitle">Unified Digital Public Infrastructure Platform</p>
        </div>
        
        {/* Tabs */}
        <div className="login-tabs">
          <button
            onClick={() => {
              setActiveTab('citizen');
              setError('');
              setSuccess('');
            }}
            className={`login-tab ${activeTab === 'citizen' ? 'active' : ''}`}
          >
            Citizen
          </button>
          <button
            onClick={() => {
              setActiveTab('service-provider');
              setError('');
              setSuccess('');
            }}
            className={`login-tab ${activeTab === 'service-provider' ? 'active' : ''}`}
          >
            Service Provider
          </button>
          <button
            onClick={() => {
              setActiveTab('admin');
              setError('');
              setSuccess('');
            }}
            className={`login-tab ${activeTab === 'admin' ? 'active' : ''}`}
          >
            Admin
          </button>
        </div>

        {/* Citizen Login */}
        {activeTab === 'citizen' && (
          <>
            {!otpId ? (
              <form onSubmit={handleAadharSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="aadhar" className="form-label">Aadhar Card Number</label>
                  <input
                    type="text"
                    id="aadhar"
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value.toUpperCase().slice(0, 20))}
                    placeholder="Enter Aadhar (e.g., ABC123456789)"
                    required
                    minLength={12}
                    maxLength={20}
                    className="form-input"
                  />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="otp" className="form-label">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    autoFocus
                    className="form-input"
                  />
                  <p className="help-text">
                    Check the <strong>backend terminal</strong> for your OTP code.
                  </p>
                </div>
                {error && <div className="error-message">{error}</div>}
                <div className="form-actions">
                  <button 
                    type="submit" 
                    disabled={loading || otpCode.length !== 6}
                    className="btn btn-primary"
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
                    className="btn btn-secondary"
                  >
                    Change Aadhar Number
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* Service Provider Tab */}
        {activeTab === 'service-provider' && (
          <>
            {/* SP Sub-tabs */}
            <div className="login-subtabs">
              <button
                type="button"
                onClick={() => {
                  setSpSubTab('login');
                  setError('');
                  setSuccess('');
                  setSpLoginOtpId(null);
                  setSpLoginOtpCode('');
                }}
                className={`login-subtab ${spSubTab === 'login' ? 'active' : ''}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpSubTab('register');
                  setError('');
                  setSuccess('');
                }}
                className={`login-subtab ${spSubTab === 'register' ? 'active' : ''}`}
              >
                Register
              </button>
            </div>

            {/* SP Login */}
            {spSubTab === 'login' && (
              <>
                {!spLoginOtpId ? (
                  <form onSubmit={handleSPLoginAadharSubmit} className="login-form">
                    <div className="form-group">
                      <label htmlFor="sp-login-aadhar" className="form-label">Aadhar Card Number</label>
                      <input
                        type="text"
                        id="sp-login-aadhar"
                        value={spLoginAadhar}
                        onChange={(e) => setSpLoginAadhar(e.target.value.toUpperCase().slice(0, 20))}
                        placeholder="Enter Aadhar (e.g., ABC123456789)"
                        required
                        minLength={12}
                        maxLength={20}
                        className="form-input"
                      />
                      <p className="help-text">
                        Only approved service providers can login. If your registration is pending, please wait for admin approval.
                      </p>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSPLoginOTPSubmit} className="login-form">
                    <div className="form-group">
                      <label htmlFor="sp-login-otp" className="form-label">Enter OTP</label>
                      <input
                        type="text"
                        id="sp-login-otp"
                        value={spLoginOtpCode}
                        onChange={(e) => setSpLoginOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        required
                        maxLength={6}
                        autoFocus
                        className="form-input"
                      />
                      <p className="help-text">
                        Check the <strong>backend terminal</strong> for your OTP code.
                      </p>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-actions">
                      <button 
                        type="submit" 
                        disabled={loading || spLoginOtpCode.length !== 6}
                        className="btn btn-primary"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSpLoginOtpId(null);
                          setSpLoginOtpCode('');
                          setError('');
                        }}
                        className="btn btn-secondary"
                      >
                        Change Aadhar Number
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* SP Registration */}
            {spSubTab === 'register' && (
          <form onSubmit={handleSPRegistration} className="login-form">
            <div className="form-group">
              <label className="form-label">Aadhar Card Number *</label>
              <input
                type="text"
                value={spAadhar}
                onChange={(e) => setSpAadhar(e.target.value.toUpperCase().slice(0, 20))}
                placeholder="Enter Aadhar (e.g., ABC123456789)"
                required
                minLength={12}
                maxLength={20}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Service Type *</label>
              <select
                value={spRequestType}
                onChange={(e) => setSpRequestType(e.target.value as 'ESANJEEVANI' | 'MKISAN' | '')}
                required
                className="form-select"
              >
                <option value="">Select service type</option>
                <option value="ESANJEEVANI">e-Sanjeevani (Healthcare)</option>
                <option value="MKISAN">mKisan (Agriculture)</option>
              </select>
            </div>

            {/* e-Sanjeevani fields */}
            {spRequestType === 'ESANJEEVANI' && (
              <>
                <div className="form-group">
                  <label className="form-label">Profession *</label>
                  <select
                    value={spProviderType}
                    onChange={(e) => setSpProviderType(e.target.value)}
                    required
                    className="form-select"
                  >
                    <option value="">Select profession</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="NURSE">Nurse</option>
                    <option value="PHARMACIST">Pharmacist</option>
                    <option value="LAB_TECHNICIAN">Lab Technician</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                {(spProviderType === 'DOCTOR' || spProviderType === 'OTHER') && (
                  <div className="form-group">
                    <label className="form-label">Specialization *</label>
                    <input
                      type="text"
                      value={spSpecialization}
                      onChange={(e) => setSpSpecialization(e.target.value)}
                      placeholder="e.g., Orthopedic, Cardiology"
                      required
                      className="form-input"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Years of Experience *</label>
                  <input
                    type="number"
                    value={spYearsOfExperience}
                    onChange={(e) => setSpYearsOfExperience(e.target.value)}
                    placeholder="e.g., 5"
                    required
                    min="0"
                    className="form-input"
                  />
                </div>
              </>
            )}

            {/* mKisan fields */}
            {spRequestType === 'MKISAN' && (
              <>
                <div className="form-group">
                  <label className="form-label">Provider Category *</label>
                  <select
                    value={spProviderCategory}
                    onChange={(e) => setSpProviderCategory(e.target.value)}
                    required
                    className="form-select"
                  >
                    <option value="">Select category</option>
                    <option value="BUYER">Buyer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Business License</label>
                  <input
                    type="text"
                    value={spBusinessLicense}
                    onChange={(e) => setSpBusinessLicense(e.target.value)}
                    placeholder="Business license number"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input
                    type="text"
                    value={spGstNumber}
                    onChange={(e) => setSpGstNumber(e.target.value)}
                    placeholder="GST number"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Years in Business</label>
                  <input
                    type="number"
                    value={spYearsInBusiness}
                    onChange={(e) => setSpYearsInBusiness(e.target.value)}
                    placeholder="e.g., 5"
                    min="0"
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input
                type="text"
                value={spOrganizationName}
                onChange={(e) => setSpOrganizationName(e.target.value)}
                placeholder="Organization name (optional)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Registration Number</label>
              <input
                type="text"
                value={spRegistrationNumber}
                onChange={(e) => setSpRegistrationNumber(e.target.value)}
                placeholder="Registration number (optional)"
                className="form-input"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <button 
              type="submit" 
              disabled={loading || !spRequestType}
              className="btn btn-primary"
            >
              {loading ? 'Submitting...' : 'Register as Service Provider'}
            </button>
          </form>
            )}
          </>
        )}

        {/* Admin Login */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="form-input"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
