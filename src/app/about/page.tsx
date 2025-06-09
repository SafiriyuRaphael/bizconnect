"use client";
import { ArrowRight, HomeIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function pages() {
  return (
    <section className="relative bg-gradient-to-br from-slate-500 via-blue-500 to-white py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} />
            About BizConnect
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Reliable Digital{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Business Hub
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Welcome to BizConnect – your central platform built to simplify
            transactions and foster seamless connections between businesses and
            customers. We believe in making buying and selling straightforward,
            transparent, and efficient.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-1 mb-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
              To empower businesses to thrive in the digital marketplace and
              provide customers with a trusted and convenient way to discover
              and engage with reliable services and products.
            </p>
          </div>
        </div>

        {/* Why Choose BizConnect */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* For Business Owners */}
          <div className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <HomeIcon size={28} color="white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                For Business Owners
              </h3>
              <p className="text-gray-600 mb-6">
                BizConnect provides you with the tools to effortlessly manage
                your online presence and operations.
              </p>
              <ul className="space-y-3">
                {[
                  {
                    title: "Open a Digital Storefront",
                    desc: "Create your personalized digital storefront in minutes",
                  },
                  {
                    title: "Streamlined Management",
                    desc: "Easily manage orders, customer messages, and listings",
                  },
                  {
                    title: "Offer Diverse Services",
                    desc: "Sell products or offer services, expanding your reach",
                  },
                  {
                    title: "Track Performance",
                    desc: "Monitor business performance and customer interactions",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {item.title}:
                      </span>
                      <span className="text-gray-600 ml-1">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* For Customers */}
          <div className="group">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={28} color="white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                For Customers
              </h3>
              <p className="text-gray-600 mb-6">
                Discover a world of reliable businesses and services across
                various categories, all in one place.
              </p>
              <ul className="space-y-3">
                {[
                  {
                    title: "Discover Reliable Businesses",
                    desc: "Access curated, trustworthy businesses across categories",
                  },
                  {
                    title: "Shop and Book Services",
                    desc: "Enjoy secure and confident shopping experiences",
                  },
                  {
                    title: "Direct Communication",
                    desc: "Message sellers directly for updates and support",
                  },
                  {
                    title: "Monitor Orders & History",
                    desc: "Track orders and view purchase history easily",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        {item.title}:
                      </span>
                      <span className="text-gray-600 ml-1">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How BizConnect Works
          </h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up",
                desc: "Choose your account type – business or customer",
                color: "blue",
              },
              {
                step: "02",
                title: "Set Up",
                desc: "List your products or complete your profile",
                color: "cyan",
              },
              {
                step: "03",
                title: "Engage",
                desc: "Buy, sell, and communicate seamlessly",
                color: "green",
              },
              {
                step: "04",
                title: "Manage",
                desc: "Monitor activities through your dashboard",
                color: "purple",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${
                    item.color === "blue"
                      ? "from-blue-500 to-blue-600"
                      : item.color === "cyan"
                      ? "from-cyan-500 to-cyan-600"
                      : item.color === "green"
                      ? "from-green-500 to-green-600"
                      : "from-purple-500 to-purple-600"
                  } flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "User-Specific Dashboards",
                desc: "Tailored dashboards with relevant information at a glance",
              },
              {
                title: "Flexible Listing",
                desc: "Easily list a variety of products and services",
              },
              {
                title: "Verified & Secure",
                desc: "Verified accounts with secure communication channels",
              },
              {
                title: "Real-time Tracking",
                desc: "Stay updated with real-time inquiry and order tracking",
              },
              {
                title: "Responsive Design",
                desc: "User-friendly platform across all devices",
              },
              {
                title: "Direct Communication",
                desc: "Seamless messaging between buyers and sellers",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300"></div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center mt-16">
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            At BizConnect, we're committed to building a reliable, central
            platform where your transactions are simplified and your connections
            are strengthened.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group"
          >
            Join Us Today
            <ArrowRight
              size={20}
              className="group-hover:translate-x-2 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
