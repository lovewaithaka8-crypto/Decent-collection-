import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Mail, Lock, User, Phone, CheckCircle, AlertCircle, RefreshCw, KeyRound, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'otp';
  initialEmail?: string;
}

export const CustomerAuthModal: React.FC<Props> = ({ isOpen, onClose, initialMode = 'login', initialEmail = '' }) => {
  const { 
    registerCustomer, verifyCustomerOTP, resendCustomerOTP, loginCustomer, 
    requestPasswordReset, resetPassword, currentCustomer 
  } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot_password' | 'reset_password'>(initialMode);
  
  // Registration form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState(initialEmail);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // OTP inputs (6 digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [targetEmail, setTargetEmail] = useState(initialEmail);
  const [otpTimeLeft, setOtpTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Login form
  const [loginEmail, setLoginEmail] = useState(initialEmail);
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password form
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Alerts & loading
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync mode and initial email when prop changes
  useEffect(() => {
    setMode(initialMode);
    if (initialEmail) {
      setRegEmail(initialEmail);
      setLoginEmail(initialEmail);
      setTargetEmail(initialEmail);
    }
  }, [initialMode, initialEmail, isOpen]);

  // Timer countdown for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'otp' && otpTimeLeft > 0) {
      timer = setInterval(() => {
        setOtpTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, otpTimeLeft]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  // Form submit handlers
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword || !regConfirmPassword) {
      setErrorMsg('Please complete all required registration fields.');
      return;
    }

    if (!regEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = registerCustomer({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword
      });

      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setTargetEmail(regEmail.trim());
        setMode('otp');
        setOtpTimeLeft(600);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessMsg(res.message);
      }
    }, 400);
  };

  const handleOtpVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const fullCode = otpDigits.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = verifyCustomerOTP(targetEmail, fullCode);
      setIsLoading(false);

      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    }, 300);
  };

  const handleResendOTP = () => {
    setErrorMsg('');
    setSuccessMsg('');
    const res = resendCustomerOTP(targetEmail);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setOtpTimeLeft(600);
      setOtpDigits(['', '', '', '', '', '']);
      setSuccessMsg(res.message);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginCustomer(loginEmail.trim(), loginPassword);
      setIsLoading(false);

      if (!res.success) {
        if (res.requiresVerification && res.customer) {
          setTargetEmail(res.customer.email);
          setMode('otp');
          setErrorMsg(res.message);
        } else {
          setErrorMsg(res.message);
        }
      } else {
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 800);
      }
    }, 300);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const res = requestPasswordReset(resetEmail.trim());
    if (res.success) {
      setMode('reset_password');
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    const res = resetPassword(resetEmail.trim(), resetCode.trim(), newPassword);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setMode('login');
        setLoginEmail(resetEmail);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#18181B] border border-[#27272A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative text-white">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-[#27272A] flex items-center justify-between bg-gradient-to-r from-[#211E10] via-[#18181B] to-[#18181B]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
              DC
            </span>
            <div>
              <h3 className="text-sm font-bold font-heading text-white">Decent Collection</h3>
              <p className="text-[10px] text-gray-400">Customer Security Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* Messages */}
          {errorMsg && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <div>
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-white font-heading">Create Customer Account</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Enter your details below. You will receive an OTP code to verify your email.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                    />
                    <User className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Phone Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="e.g. 0712 345 678"
                      className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                    />
                    <Phone className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. john@gmail.com"
                      className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                    />
                    <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                      />
                      <Lock className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 mb-1">Confirm Password *</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2 text-xs outline-none"
                      />
                      <Lock className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-bold text-xs rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account & Verify Email'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-t border-[#27272A]">
                <p className="text-xs text-gray-400">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setErrorMsg(''); }} className="text-[#D4AF37] font-semibold hover:underline">
                    Log In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* MODE: OTP VERIFICATION */}
          {mode === 'otp' && (
            <div>
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-white font-heading">📧 Email Verification</h2>
                <p className="text-xs text-gray-300 mt-1">
                  Enter the 6-digit verification code sent to:
                </p>
                <p className="text-xs font-bold text-[#D4AF37] mt-0.5">{targetEmail}</p>
              </div>

              <form onSubmit={handleOtpVerifySubmit} className="space-y-4">
                {/* 6 Digit Input */}
                <div className="flex justify-center gap-2 my-4">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-10 h-12 text-center text-lg font-extrabold bg-[#09090B] border border-[#3F3F46] focus:border-[#D4AF37] text-white rounded-xl outline-none transition-all shadow-inner"
                    />
                  ))}
                </div>

                {/* Timer indicator */}
                <div className="flex items-center justify-between text-xs px-2 text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Code expires in: <strong className="text-white font-mono">{formatTimer(otpTimeLeft)}</strong>
                  </span>
                  {otpTimeLeft === 0 && (
                    <span className="text-red-400 font-semibold text-[11px]">Expired</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B38F29] text-black font-extrabold text-xs rounded-xl hover:opacity-95 transition-all shadow-lg uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify Account</span>
                </button>
              </form>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-[#27272A] text-xs">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend Code
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className="text-gray-400 hover:text-white"
                >
                  Change Email
                </button>
              </div>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <div>
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-white font-heading">Customer Login</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Access your Decent Collection account & track orders
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. john@gmail.com"
                      className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none"
                    />
                    <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-semibold text-gray-300">Password</label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot_password'); setErrorMsg(''); }}
                      className="text-[10px] text-[#D4AF37] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none"
                    />
                    <Lock className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-bold text-xs rounded-xl transition-all shadow-md mt-2"
                >
                  {isLoading ? 'Logging In...' : 'Log In'}
                </button>
              </form>

              <div className="text-center mt-5 pt-3 border-t border-[#27272A]">
                <p className="text-xs text-gray-400">
                  Don't have an account?{' '}
                  <button onClick={() => { setMode('register'); setErrorMsg(''); }} className="text-[#D4AF37] font-semibold hover:underline">
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* MODE: FORGOT PASSWORD */}
          {mode === 'forgot_password' && (
            <div>
              <div className="text-center mb-5">
                <div className="w-10 h-10 bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white font-heading">Forgot Password</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Enter your email address to receive a password reset security code.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Registered Email Address</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. john@gmail.com"
                    className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl px-3 py-2.5 text-xs outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c39e2d] text-black font-bold text-xs rounded-xl"
                >
                  Send Reset Code
                </button>

                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full text-center text-xs text-gray-400 hover:text-white"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}

          {/* MODE: RESET PASSWORD */}
          {mode === 'reset_password' && (
            <div>
              <div className="text-center mb-5">
                <h2 className="text-lg font-bold text-white font-heading">Reset Password</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Enter the reset code sent to {resetEmail} and your new password.
                </p>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">Reset Code</label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="6-digit security code"
                    className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#D4AF37] text-black font-bold text-xs rounded-xl"
                >
                  Set New Password
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
