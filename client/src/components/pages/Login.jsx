import React from 'react'

const Login = () => {
    return (
        <div className="min-h-screen bg-black flex">
          {/* Login container */}
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="w-full max-w-md">
              <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Welcome to CollabEdge</h1>
                  <p className="text-gray-400">Sign in to start collaborating</p>
                </div>
    
                <div className="space-y-4">
                  <button
                    // onClick={handleGoogleLogin}
                    className="w-full bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                  <button
                    // onClick={handleGuestLogin}
                    className="w-full border text-white  border-white/20 px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
                  >
                    Continue as Guest
                  </button>
                </div>
    
                <div className="mt-8 text-center text-sm text-gray-400">
                  <p>By continuing, you agree to our</p>
                  <div className="mt-1">
                    <a href="#" className="text-white hover:underline">Terms of Service</a>
                    <span className="mx-2">•</span>
                    <a href="#" className="text-white hover:underline">Privacy Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Login