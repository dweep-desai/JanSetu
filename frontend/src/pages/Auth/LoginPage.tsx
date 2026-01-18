import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Building2,
  ShieldCheck,
  User,
  IdCard,
  KeyRound,
  ArrowRight,
  Loader2,
  Stethoscope,
  Wheat,
  Briefcase
} from 'lucide-react';

type LoginTab = 'citizen' | 'service-provider' | 'admin';
type SPSubTab = 'login' | 'register';

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') as LoginTab | null;
  const [activeTab, setActiveTab] = useState<LoginTab>(initialTab || 'citizen');
  const [spSubTab, setSpSubTab] = useState<SPSubTab>('login');

  // Update active tab if URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') as LoginTab | null;
    if (tab && ['citizen', 'service-provider', 'admin'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Citizen login state
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

  // Citizen login handlers
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
        if (spProviderType === 'DOCTOR' || spProviderType === 'OTHER') {
          registrationData.specialization = spSpecialization;
        }
        registrationData.years_of_experience = spYearsOfExperience ? parseInt(spYearsOfExperience) : null;
      } else if (spRequestType === 'MKISAN') {
        registrationData.provider_category = 'BUYER';
      }

      const response = await api.post('/sp-registration/register', registrationData);
      setSuccess(`Registration request submitted successfully! Request ID: ${response.data.request_id}. Your request has been assigned to admin ${response.data.assigned_admin.full_name} for approval.`);

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

      const userResponse = await api.get('/auth/me');
      const userData = userResponse.data;
      localStorage.setItem('user', JSON.stringify(userData));

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const getSubTitle = () => {
    switch (activeTab) {
      case 'citizen': return 'Access government services and documents';
      case 'service-provider': return 'For doctors, merchants, and service providers';
      case 'admin': return 'Government administration portal';
      default: return 'Unified Digital Public Infrastructure';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-slate-50 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[100px] rounded-full mix-blend-multiply filter opacity-70 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[100px] rounded-full mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-emerald-600/10 blur-[100px] rounded-full mix-blend-multiply filter opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative z-10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">

        {/* Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">JanSetu</span>
          </h1>
          <p className="text-slate-500 font-medium">{getSubTitle()}</p>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 mb-8">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {(['citizen', 'service-provider', 'admin'] as LoginTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tab === 'citizen' && <User className="w-4 h-4 mr-2" />}
                {tab === 'service-provider' && <Building2 className="w-4 h-4 mr-2" />}
                {tab === 'admin' && <ShieldCheck className="w-4 h-4 mr-2" />}
                <span className="capitalize">{tab.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-8 pb-10">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-medium animate-in slide-in-from-top-2">
              {success}
            </div>
          )}

          {/* Citizen Login */}
          {activeTab === 'citizen' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {!otpId ? (
                <form onSubmit={handleAadharSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Aadhaar Number</label>
                    <div className="relative">
                      <IdCard className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={aadhar}
                        onChange={(e) => setAadhar(e.target.value.toUpperCase().slice(0, 20))}
                        placeholder="Enter 12-digit Aadhaar"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        required
                        minLength={12}
                        maxLength={20}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 tracking-widest"
                        required
                        maxLength={6}
                        autoFocus
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500 text-center bg-blue-50 py-1.5 rounded-lg border border-blue-100">
                      Check backend terminal for OTP
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button
                      type="submit"
                      disabled={loading || otpCode.length !== 6}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpId(null);
                        setOtpCode('');
                        setError('');
                      }}
                      className="w-full text-slate-500 hover:text-slate-700 font-medium py-2 text-sm transition-colors"
                    >
                      Use a different Aadhaar number
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Service Provider Tab */}
          {activeTab === 'service-provider' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex border-b border-slate-200 mb-6">
                <button
                  onClick={() => { setSpSubTab('login'); setError(''); setSuccess(''); }}
                  className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${spSubTab === 'login' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                  Provider Login
                </button>
                <button
                  onClick={() => { setSpSubTab('register'); setError(''); setSuccess(''); }}
                  className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition-colors ${spSubTab === 'register' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                >
                  New Registration
                </button>
              </div>

              {spSubTab === 'login' && (
                <>
                  {!spLoginOtpId ? (
                    <form onSubmit={handleSPLoginAadharSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Provider Aadhaar</label>
                        <div className="relative">
                          <IdCard className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                          <input
                            type="text"
                            value={spLoginAadhar}
                            onChange={(e) => setSpLoginAadhar(e.target.value.toUpperCase().slice(0, 20))}
                            placeholder="Enter 12-digit Aadhaar"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                            required
                          />
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                          Access restricted to approved service providers.
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        {loading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSPLoginOTPSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">One-Time Password</label>
                        <div className="relative">
                          <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                          <input
                            type="text"
                            value={spLoginOtpCode}
                            onChange={(e) => setSpLoginOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Enter 6-digit OTP"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 tracking-widest"
                            required
                            maxLength={6}
                            autoFocus
                          />
                        </div>
                        <p className="mt-2 text-xs text-slate-500 text-center bg-blue-50 py-1.5 rounded-lg border border-blue-100">
                          Check backend terminal for OTP
                        </p>
                      </div>
                      <div className="space-y-3">
                        <button
                          type="submit"
                          disabled={loading || spLoginOtpCode.length !== 6}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? <Loader2 className="animate-spin" /> : 'Verify Access'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSpLoginOtpId(null);
                            setSpLoginOtpCode('');
                          }}
                          className="w-full text-slate-500 hover:text-slate-700 font-medium py-2 text-sm transition-colors"
                        >
                          Try different ID
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {spSubTab === 'register' && (
                <form onSubmit={handleSPRegistration} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Aadhaar Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <IdCard className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={spAadhar}
                          onChange={(e) => setSpAadhar(e.target.value.toUpperCase().slice(0, 20))}
                          placeholder="Provider Aadhaar"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Service Type <span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSpRequestType('ESANJEEVANI')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${spRequestType === 'ESANJEEVANI' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                        >
                          <Stethoscope className="w-5 h-5" />
                          <span className="text-xs font-bold">Healthcare</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSpRequestType('MKISAN')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${spRequestType === 'MKISAN' ? 'border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/20' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                        >
                          <Wheat className="w-5 h-5" />
                          <span className="text-xs font-bold">Agriculture</span>
                        </button>
                      </div>
                    </div>

                    {spRequestType === 'ESANJEEVANI' && (
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Profession</label>
                          <select
                            value={spProviderType}
                            onChange={(e) => setSpProviderType(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                            required
                          >
                            <option value="">Select Profession</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="NURSE">Nurse</option>
                            <option value="PHARMACIST">Pharmacist</option>
                            <option value="LAB_TECHNICIAN">Lab Tech</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        {(spProviderType === 'DOCTOR' || spProviderType === 'OTHER') && (
                          <div>
                            <input
                              type="text"
                              value={spSpecialization}
                              onChange={(e) => setSpSpecialization(e.target.value)}
                              placeholder="Specialization (e.g. Cardiology)"
                              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                              required
                            />
                          </div>
                        )}
                        <div>
                          <input
                            type="number"
                            value={spYearsOfExperience}
                            onChange={(e) => setSpYearsOfExperience(e.target.value)}
                            placeholder="Years of Experience"
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {spRequestType === 'MKISAN' && (
                      <div className="p-4 bg-green-50/50 rounded-xl border border-green-100 space-y-4 animate-in zoom-in-95 duration-200">
                        <select
                          value="BUYER"
                          disabled
                          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 cursor-not-allowed"
                        >
                          <option value="BUYER">Buyer</option>
                        </select>
                      </div>
                    )}

                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Organization Info</label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            value={spOrganizationName}
                            onChange={(e) => setSpOrganizationName(e.target.value)}
                            placeholder="Organization Name (Optional)"
                            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={spRegistrationNumber}
                          onChange={(e) => setSpRegistrationNumber(e.target.value)}
                          placeholder="Reg. Number (Optional)"
                          className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !spRequestType}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Submit Registration'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Admin Login */}
          {activeTab === 'admin' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <form onSubmit={handleAdminLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Admin ID</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Enter Username"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter Password"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-slate-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Admin Login'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
