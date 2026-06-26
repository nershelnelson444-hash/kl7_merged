import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import loginBg from '../assets/loginpage.jpg';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

interface SignInPageProps {
  description?: React.ReactNode;
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onBack?: () => void;
  error?: string | null;
  loading?: boolean;
}

// --- HELPER ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-300 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-black/70 focus-within:bg-black/5">
    {children}
  </div>
);

// --- TESTIMONIAL CARD ---

const TestimonialCard = ({ name, text, delay }: { name: string; text: string; delay: string }) => (
  <div className={`${delay} flex flex-col gap-1 rounded-3xl bg-white/85 backdrop-blur-xl border border-gray-200 p-5 w-64 shadow-sm`}>
    <p className="font-medium text-black text-sm">{name}</p>
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-3 w-3 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
      ))}
    </div>
    <p className="text-gray-600 text-xs mt-1">{text}</p>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  description = "Access your account and continue your journey with us",
  onSignIn,
  onGoogleSignIn,
  onBack,
  error,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const adminUrl = import.meta.env.VITE_ADMIN_URL ?? 'http://localhost:5174';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white w-full">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex flex-col p-8 relative">
        {onBack && (
          <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
        )}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md mt-12 md:mt-0">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-black mb-2 uppercase tracking-wide">WELCOME</h1>
                <p className="text-gray-500">{description}</p>
              </div>

            <form className="space-y-5" onSubmit={onSignIn}>
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <GlassInputWrapper>
                  <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-black" />
                </GlassInputWrapper>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-black" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-500 hover:text-black transition-colors" /> : <Eye className="w-5 h-5 text-gray-500 hover:text-black transition-colors" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="flex items-center text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                  <span className="text-gray-700">Keep me signed in</span>
                </label>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium text-center bg-red-50 rounded-xl p-3">{error}</p>
              )}

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-black py-4 font-medium text-white hover:bg-black/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <span className="w-full border-t border-gray-200"></span>
              <span className="px-4 text-sm text-gray-500 bg-white absolute">Or continue with</span>
            </div>

            <button onClick={onGoogleSignIn} className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-4 hover:bg-gray-50 transition-colors text-black font-medium">
                <GoogleIcon />
                Continue with Google
            </button>

              <div className="text-center">
                <a href={`${adminUrl}/login`} className="text-sm font-medium text-gray-500 hover:text-black transition-colors underline underline-offset-4">
                  Login as Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right column: hero image + reviews */}
      <section className="hidden md:block flex-1 relative p-4">
        <div
          className="absolute inset-4 rounded-[32px] bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center z-10">
          <TestimonialCard
            name="Arun Kumar"
            text="Very good service. Got my bike at a very reasonable price. The staff was helpful and the whole process was smooth!"
            delay=""
          />
          <div className="hidden xl:block">
            <TestimonialCard
              name="Vishnu V"
              text="Excellent experience! The team is very friendly and transparent. No hidden charges — what they quoted is what I paid."
              delay=""
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleGoogleSignIn = async () => {
        setError(null);
        try {
            await signInWithGoogle();
            navigate('/');
        } catch (err: any) {
            setError('Google sign-in failed. Please try again.');
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const form = e.currentTarget;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err: any) {
            const code = err.code;
            if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
                setError('Invalid email or password. Please try again.');
            } else if (code === 'auth/too-many-requests') {
                setError('Too many attempts. Please try again later.');
            } else {
                setError('Sign-in failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SignInPage
            onSignIn={handleEmailSignIn}
            onGoogleSignIn={handleGoogleSignIn}
            onBack={() => navigate(-1)}
            error={error}
            loading={loading}
        />
    );
}