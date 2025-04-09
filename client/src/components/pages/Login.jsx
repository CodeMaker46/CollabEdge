import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from "@/config/firebase";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const Login = () => {

  const navigate = useNavigate();


const handleGoogleSignIn = async () => {
  
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

     // Store user data
     localStorage.setItem('user', JSON.stringify({
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName
    }));
    console.log("Google sign-in successful:", result.user);
    // console.log(result.user.email)
    // console.log(result.user.displayName)
    toast.success("Successfully signed in with Google!");
    navigate('/dashboard');
  } catch (error) {
    console.error("Google sign-in error:", error);
    toast.error("Failed to sign in with Google");
  }
};

  return (
    <div className="min-h-screen bg-black flex">
      {/* Login container */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-white">Welcome to CollabEdge</h1>
              <p className="text-gray-400">Sign in to start collaborating</p>
            </div>

            <div className="space-y-4">
              <button
                // onClick={loginWithGoogle}
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                Continue with Google
              </button>
              <button
                // onClick={loginAsGuest}
                className="w-full border text-white border-white/20 px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
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

export default Login;
