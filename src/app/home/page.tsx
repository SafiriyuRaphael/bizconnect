"use client";
import {
  ArrowRight,
  Zap,
  Shield,
  Star,
  Users,
  TrendingUp,
  Globe,
  CheckCircle,
  PlayCircle,
  MessageSquare,
  BarChart3,
  Sparkles,
  HomeIcon,
  Eye,
  Clock,
  Award,
  Target,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Absolute Fire */}
      <section className="relative bg-white py-20 px-6 overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full opacity-30 animate-pulse blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 rounded-full opacity-20 animate-pulse delay-1000 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-10 animate-pulse delay-500 blur-3xl"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl rotate-12 animate-bounce opacity-80"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg rotate-45 animate-bounce delay-300 opacity-50"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Hero Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 text-blue-700 rounded-full text-sm font-bold mb-8 hover:scale-105 transition-all duration-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <Star size={16} className="text-yellow-500" />
                #1 Business Platform in Nigeria
                <Sparkles size={16} className="text-purple-500" />
              </div>

              {/* Main Headline */}
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.85]">
                <span className="block">Connect.</span>
                <span className="block">Transact.</span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Dominate.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-2xl text-gray-600 mb-10 leading-relaxed max-w-xl">
                The all-in-one platform where Nigerian businesses thrive and
                customers discover amazing services. Join the digital revolution
                today.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Link
                  href="/signup"
                  className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  Start Free Today
                  <ArrowRight
                    size={24}
                    className="group-hover:translate-x-2 transition-transform duration-300"
                  />
                </Link>
                <button className="group px-10 py-5 bg-white border-2 border-gray-900 text-gray-900 text-xl font-bold rounded-2xl hover:bg-gray-900 hover:text-white transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                  <PlayCircle
                    size={24}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  Watch Demo
                </button>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-3xl font-black text-gray-900">50K+</div>
                  <div className="text-gray-600 font-semibold">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900">₦2B+</div>
                  <div className="text-gray-600 font-semibold">
                    Transactions
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900">99.9%</div>
                  <div className="text-gray-600 font-semibold">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Visual */}
            <div className="relative">
              {/* Main Dashboard Mockup */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white font-bold text-lg">
                      Dashboard
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-white/80 text-sm">
                    Welcome back, Business Owner!
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-blue-600 mb-2">
                      <BarChart3 size={20} />
                    </div>
                    <div className="font-bold text-gray-900">₦250K</div>
                    <div className="text-gray-600 text-sm">This Month</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-green-600 mb-2">
                      <TrendingUp size={20} />
                    </div>
                    <div className="font-bold text-gray-900">+32%</div>
                    <div className="text-gray-600 text-sm">Growth</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        New Order #1234
                      </div>
                      <div className="text-gray-600 text-xs">2 minutes ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        Customer Message
                      </div>
                      <div className="text-gray-600 text-xs">5 minutes ago</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-8 -right-8 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 transform rotate-12 hover:rotate-6 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-green-500" />
                  <span className="font-bold text-gray-900 text-sm">
                    Verified
                  </span>
                </div>
                <div className="text-gray-600 text-xs">100% Secure</div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-4 text-white shadow-xl transform -rotate-12 hover:-rotate-6 transition-transform duration-300">
                <div className="font-black text-2xl mb-1">24/7</div>
                <div className="text-green-100 text-sm">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Logo Wall */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 font-semibold mb-8 text-lg">
            Trusted by leading Nigerian businesses
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
            {["Jumia", "Konga", "Paystack", "Flutterwave", "Interswitch"].map(
              (company, index) => (
                <div
                  key={index}
                  className="text-2xl font-black text-gray-400 hover:text-gray-700 transition-colors duration-300 cursor-pointer"
                >
                  {company}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features - Problem/Solution */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Problem Statement */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-full text-sm font-bold mb-8">
              <Target size={16} />
              The Problem
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              Nigerian Businesses Are
              <span className="text-red-500"> Struggling</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Clock size={32} />,
                  title: "Wasted Time",
                  desc: "Hours spent on manual processes",
                },
                {
                  icon: <MessageSquare size={32} />,
                  title: "Poor Communication",
                  desc: "Lost customers due to delayed responses",
                },
                {
                  icon: <BarChart3 size={32} />,
                  title: "No Insights",
                  desc: "Flying blind without proper analytics",
                },
              ].map((problem, index) => (
                <div
                  key={index}
                  className="bg-red-50 rounded-2xl p-8 border-2 border-red-100"
                >
                  <div className="text-red-500 mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border-2 border-green-200 text-green-700 rounded-full text-sm font-bold mb-8">
              <CheckCircle size={16} />
              The Solution
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-16">
              BizConnect
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                {" "}
                Solves Everything
              </span>
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* For Business Owners */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-10 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <HomeIcon size={48} className="mb-6 text-cyan-300" />
                  <h3 className="text-3xl font-black mb-6">Business Owners</h3>
                  <div className="space-y-4 text-left">
                    {[
                      "Set up your digital storefront in 5 minutes",
                      "Manage all orders from one dashboard",
                      "Get real-time customer notifications",
                      "Track performance with advanced analytics",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle
                          size={20}
                          className="text-cyan-300 flex-shrink-0"
                        />
                        <span className="text-blue-100">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/business-signup"
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Start Selling <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* For Customers */}
              <div className="bg-gradient-to-br from-cyan-500 to-green-500 rounded-3xl p-10 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <Users size={48} className="mb-6 text-green-200" />
                  <h3 className="text-3xl font-black mb-6">Customers</h3>
                  <div className="space-y-4 text-left">
                    {[
                      "Discover verified local businesses",
                      "Shop with confidence and security",
                      "Get instant customer support",
                      "Track all your orders in real-time",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Star
                          size={20}
                          className="text-yellow-300 flex-shrink-0"
                        />
                        <span className="text-green-100">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/customer-signup"
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Start Shopping <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-10 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <Award size={48} className="mb-6 text-pink-200" />
                  <h3 className="text-3xl font-black mb-6">Why BizConnect?</h3>
                  <div className="space-y-4 text-left">
                    {[
                      "Built specifically for Nigerian market",
                      "Local payment methods supported",
                      "24/7 customer support in local languages",
                      "Lowest transaction fees guaranteed",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Zap
                          size={20}
                          className="text-yellow-300 flex-shrink-0"
                        />
                        <span className="text-purple-100">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/about"
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-16">
            The Numbers Don't
            <span className="text-cyan-400"> Lie</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                number: "50,000+",
                label: "Active Users",
                icon: <Users size={32} />,
              },
              {
                number: "₦2B+",
                label: "Transaction Volume",
                icon: <TrendingUp size={32} />,
              },
              {
                number: "10,000+",
                label: "Businesses",
                icon: <HomeIcon size={32} />,
              },
              { number: "99.9%", label: "Uptime", icon: <Shield size={32} /> },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                  <div className="text-cyan-400 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-3">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 font-semibold">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              What Our Users
              <span className="text-blue-600"> Say</span>
            </h2>
            <p className="text-2xl text-gray-600">
              Real stories from real businesses growing with BizConnect
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Adebayo Ogundimu",
                role: "CEO, Lagos Fashion House",
                avatar: "AO",
                content:
                  "BizConnect transformed my fashion business. I went from 10 orders per month to 200+ orders. The platform is incredibly easy to use!",
                rating: 5,
                color: "from-blue-500 to-purple-500",
              },
              {
                name: "Fatima Suleiman",
                role: "Owner, Abuja Catering",
                avatar: "FS",
                content:
                  "I love how I can manage everything from one dashboard. Customer communication is seamless and my business has grown 300%!",
                rating: 5,
                color: "from-green-500 to-cyan-500",
              },
              {
                name: "Chinedu Okwu",
                role: "Electronics Retailer",
                avatar: "CO",
                content:
                  "The analytics features helped me understand my customers better. My conversion rate doubled within 3 months of using BizConnect.",
                rating: 5,
                color: "from-purple-500 to-pink-500",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center text-white font-black text-lg`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-yellow-500 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-700 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
            Ready to
            <span className="text-cyan-300"> Transform</span>
            <br />
            Your Business?
          </h2>
          <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
            Join 50,000+ businesses already growing with BizConnect. Start your
            free account today and see the difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              href="/signup"
              className="group px-12 py-6 bg-white text-blue-600 text-2xl font-black rounded-2xl hover:shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-4"
            >
              <Rocket size={28} />
              Start Free Today
              <ArrowRight
                size={28}
                className="group-hover:translate-x-3 transition-transform duration-300"
              />
            </Link>
            <Link
              href="/demo"
              className="px-12 py-6 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white text-2xl font-black rounded-2xl hover:bg-white/20 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-4"
            >
              <PlayCircle size={28} />
              Watch Demo
            </Link>
          </div>

          <div className="text-center">
            <p className="text-blue-100 text-lg mb-2">
              🚀 No credit card required
            </p>
            <p className="text-blue-200">⚡ Setup takes less than 5 minutes</p>
          </div>
        </div>
      </section>
    </>
  );
}
