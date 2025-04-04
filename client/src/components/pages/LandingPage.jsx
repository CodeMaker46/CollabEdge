import React from 'react';
import { Code2, Phone, Pencil, Users, ArrowRight, Github } from 'lucide-react';
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';

const LandingPage = () => {
  return (
    <BackgroundBeamsWithCollision>
      <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <nav className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="w-8 h-8" />
              <span className="text-xl font-bold">CollabEdge</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-gray-300 transition-colors">Features</a>
              <a href="#about" className="hover:text-gray-300 transition-colors">About</a>
              <a href="#pricing" className="hover:text-gray-300 transition-colors">Pricing</a>
            </div>
            <button className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Collaborate in Real-time with
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"> Voice & Vision</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Experience seamless collaboration with integrated code editing, voice calls, and whiteboarding. All in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                Start Coding Now <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto border border-white/20 px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Github className="w-5 h-5" /> View on GitHub
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-24 border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <Code2 className="w-12 h-12 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Real-time Code Editor</h3>
            <p className="text-gray-400">Collaborate on code in real-time with syntax highlighting and intelligent suggestions.</p>
          </div>
          <div className="p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <Phone className="w-12 h-12 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Voice Calls</h3>
            <p className="text-gray-400">Crystal clear voice communication for seamless team collaboration.</p>
          </div>
          <div className="p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
            <Pencil className="w-12 h-12 mb-6" />
            <h3 className="text-xl font-semibold mb-4">Interactive Whiteboard</h3>
            <p className="text-gray-400">Visualize ideas and explain concepts with our built-in whiteboard.</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-24 border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">100K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50M+</div>
            <div className="text-gray-400">Lines of Code</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="text-gray-400">Team Projects</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Start Collaborating?</h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of developers who are already using CollabEdge to build amazing things together.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
            Get Started for Free <Users className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Code2 className="w-6 h-6" />
              <span className="font-bold">CollabEdge</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 CollabEdge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
    </BackgroundBeamsWithCollision>
  );
}

export default LandingPage;