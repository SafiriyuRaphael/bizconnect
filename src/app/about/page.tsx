"use client";
import { ArrowRight, HomeIcon, Sparkles, Users, Shield, Zap, BarChart3, MessageSquare, Eye, Star, CheckCircle, TrendingUp, Globe } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-white py-20 px-6 overflow-hidden">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl rotate-12 opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl -rotate-45 opacity-50 animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full opacity-30 animate-bounce delay-700"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 text-blue-700 rounded-full text-sm font-bold mb-8 hover:scale-105 hover:shadow-lg transition-all duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <Sparkles size={18} className="text-blue-500" />
            Trusted by 10,000+ Businesses Worldwide
            <Star size={16} className="text-yellow-500" />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.9] tracking-tight">
            The Future of
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent animate-pulse">
              Digital Commerce
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-2xl md:text-3xl text-gray-600 max-w-5xl mx-auto mb-12 leading-relaxed font-medium">
            Connect, transact, and grow with the most powerful business platform designed for the modern digital economy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/signup"
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Start Your Journey
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            <Link
              href="/demo"
              className="px-10 py-5 bg-white border-2 border-gray-900 text-gray-900 text-xl font-bold rounded-2xl hover:bg-gray-900 hover:text-white transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            >
              Watch Demo
            </Link>
          </div>

          {/* Social Proof Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "50K+", label: "Active Users", icon: <Users size={24} /> },
              { number: "1M+", label: "Transactions", icon: <TrendingUp size={24} /> },
              { number: "99.9%", label: "Uptime", icon: <Shield size={24} /> },
              { number: "150+", label: "Countries", icon: <Globe size={24} /> }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300">
                  <div className="text-blue-500 mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section - Unique Layout */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-8">
                <Eye size={16} />
                Our Mission
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                Empowering Digital 
                <span className="text-blue-600"> Excellence</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                We're revolutionizing how businesses connect with customers by creating a seamless, transparent, and efficient digital marketplace that drives real growth.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={28} color="white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Proven Results</div>
                  <div className="text-gray-600">$10M+ in transactions facilitated</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="text-6xl font-black mb-4">2019</div>
                <div className="text-xl font-semibold mb-2">Founded</div>
                <div className="text-blue-200">Started with a vision to simplify digital commerce</div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white border-4 border-gray-100 rounded-2xl p-8 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="text-4xl font-black text-gray-900 mb-2">Today</div>
                <div className="text-gray-600 font-semibold">Leading the industry</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Masonry Style */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Why Choose 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> BizConnect</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Everything you need to succeed in the digital marketplace, all in one powerful platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Large Feature Card */}
            <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <HomeIcon size={48} className="mb-6 text-cyan-300" />
                <h3 className="text-4xl font-black mb-6">For Business Owners</h3>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Transform your business with our comprehensive digital storefront solution.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    "Instant Storefront Setup",
                    "Advanced Analytics",
                    "Customer Management",
                    "Multi-channel Selling"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                        <CheckCircle size={16} color="white" />
                      </div>
                      <span className="font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Medium Feature Card */}
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl p-8 text-white hover:scale-105 hover:-translate-y-2 transition-all duration-300">
              <Users size={40} className="mb-6 text-cyan-200" />
              <h3 className="text-3xl font-black mb-4">For Customers</h3>
              <p className="text-cyan-100 mb-6">
                Discover amazing businesses and enjoy seamless shopping experiences.
              </p>
              <div className="space-y-3">
                {["Verified Businesses", "Secure Payments", "Real-time Support"].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star size={16} className="text-yellow-300" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Small Feature Cards */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 text-white hover:scale-105 hover:-translate-y-2 transition-all duration-300">
              <Shield size={36} className="mb-4" />
              <h3 className="text-2xl font-black mb-3">99.9% Secure</h3>
              <p className="text-green-100 text-sm">Bank-level security for all transactions</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white hover:scale-105 hover:-translate-y-2 transition-all duration-300">
              <Zap size={36} className="mb-4" />
              <h3 className="text-2xl font-black mb-3">Lightning Fast</h3>
              <p className="text-purple-100 text-sm">Sub-second response times globally</p>
            </div>

            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 text-white hover:scale-105 hover:-translate-y-2 transition-all duration-300">
              <MessageSquare size={36} className="mb-4" />
              <h3 className="text-2xl font-black mb-3">24/7 Support</h3>
              <p className="text-orange-100 text-sm">Always here when you need us</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Creative Timeline */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Get Started in 
              <span className="text-blue-600">4 Simple Steps</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full opacity-30"></div>
            
            <div className="space-y-24">
              {[
                {
                  step: "01",
                  title: "Sign Up & Choose Your Path",
                  desc: "Create your account and select whether you're a business owner or customer. Get instant access to your personalized dashboard.",
                  color: "from-blue-500 to-cyan-500",
                  position: "left"
                },
                {
                  step: "02", 
                  title: "Set Up Your Profile",
                  desc: "Complete your profile, add your products or preferences, and customize your digital presence to match your brand.",
                  color: "from-purple-500 to-pink-500",
                  position: "right"
                },
                {
                  step: "03",
                  title: "Connect & Engage",
                  desc: "Start buying, selling, and communicating with verified users. Use our built-in messaging system for seamless interactions.",
                  color: "from-green-500 to-emerald-500", 
                  position: "left"
                },
                {
                  step: "04",
                  title: "Scale & Optimize",
                  desc: "Use our analytics and insights to optimize your performance, track your growth, and scale your success.",
                  color: "from-orange-500 to-red-500",
                  position: "right"
                }
              ].map((item, index) => (
                <div key={index} className={`flex items-center ${item.position === 'right' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-1/2 ${item.position === 'right' ? 'pl-16' : 'pr-16'}`}>
                    <div className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${item.position === 'right' ? 'text-right' : ''}`}>
                      <div className={`text-8xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-4`}>
                        {item.step}
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full border-4 border-white shadow-lg flex items-center justify-center hover:scale-125 transition-transform duration-300`}>
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold & Modern */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Ready to 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Transform</span>
            <br />Your Business?
          </h2>
          <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
            Join thousands of successful businesses already growing with BizConnect.
            Your digital transformation starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/signup"
              className="group px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-black rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-4"
            >
              Get Started Free
              <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-300" />
            </Link>
            <Link
              href="/contact"
              className="px-12 py-6 bg-gray-900 text-white text-2xl font-black rounded-2xl hover:bg-gray-800 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}