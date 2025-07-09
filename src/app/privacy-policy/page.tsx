"use client";
import React from "react";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Bell,
  Gavel,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg">
              Your privacy is important to us. Learn how we protect your data on
              BizConnect
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last Updated: June 20, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Introduction */}
            <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-purple-800 leading-relaxed">
                At BizConnect, we&apos;re committed to protecting your privacy and
                ensuring transparency about how we collect, use, and safeguard
                your personal information. This Privacy Policy explains our
                practices regarding data collection and usage when you use our
                service marketplace platform.
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              {/* Section 1 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    1. Information We Collect
                  </h2>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  1.1 Personal Information
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We collect information you provide when creating an account,
                  listing services, or making transactions:
                </p>
                <ul className="text-gray-700 space-y-2 ml-6 mb-4">
                  <li>• Name, email address, and phone number</li>
                  <li>• Profile information and business details</li>
                  <li>
                    • Payment information (processed securely by third parties)
                  </li>
                  <li>• Service listings, descriptions, and photos</li>
                  <li>• Reviews, ratings, and communications</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  1.2 Automatically Collected Information
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-0">
                    We automatically collect device information, IP addresses,
                    browser data, usage patterns, and cookies to improve your
                    experience and platform security.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Database className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    2. How We Use Your Information
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  We use your information to:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <ul className="text-gray-700 space-y-2 ml-6">
                    <li>• Provide and maintain our services</li>
                    <li>• Process transactions and payments</li>
                    <li>• Facilitate communication between users</li>
                    <li>• Improve platform functionality</li>
                  </ul>
                  <ul className="text-gray-700 space-y-2 ml-6">
                    <li>• Prevent fraud and ensure security</li>
                    <li>• Send important service notifications</li>
                    <li>• Provide customer support</li>
                    <li>• Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    3. Information Sharing
                  </h2>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.1 With Other Users
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you create service listings or engage in transactions,
                  certain information becomes visible to other users, including
                  your name, profile information, service details, and reviews.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.2 With Third Parties
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm mb-2">
                    <strong>Service Providers:</strong> We share data with
                    trusted partners who help us operate our platform (payment
                    processors, hosting providers, analytics services).
                  </p>
                  <p className="text-yellow-800 text-sm mb-0">
                    <strong>Legal Requirements:</strong> We may disclose
                    information when required by law or to protect our rights
                    and users&apos; safety.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    4. Data Security
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement robust security measures to protect your personal
                  information:
                </p>
                <ul className="text-gray-700 space-y-2 ml-6 mb-4">
                  <li>• Encryption of sensitive data in transit and at rest</li>
                  <li>
                    • Regular security audits and vulnerability assessments
                  </li>
                  <li>• Secure authentication and access controls</li>
                  <li>• Staff training on data protection best practices</li>
                </ul>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm mb-0">
                    <strong>Security Notice:</strong> While we use
                    industry-standard security measures, no system is 100%
                    secure. Please use strong passwords and keep your account
                    information confidential.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Your Privacy Rights
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.1 Access and Control
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="text-gray-700 space-y-2 ml-6 mb-4">
                  <li>• Access and review your personal information</li>
                  <li>• Update or correct inaccurate data</li>
                  <li>• Request deletion of your account and data</li>
                  <li>• Export your data in a portable format</li>
                  <li>• Opt-out of marketing communications</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.2 Data Retention
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-0">
                    We retain your information for as long as your account is
                    active or as needed to provide services. Some information
                    may be retained longer for legal, security, or business
                    purposes.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    6. Cookies and Tracking
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your
                  experience:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Essential Cookies
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Required for basic platform functionality and security
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Analytics Cookies
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Help us understand how users interact with our platform
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Preference Cookies
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Remember your settings and preferences
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Marketing Cookies
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Deliver relevant ads and measure campaign effectiveness
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Children&apos;s Privacy
                </h2>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800 text-sm mb-0">
                    <strong>Age Requirement:</strong> BizConnect is not intended
                    for children under 18. We do not knowingly collect personal
                    information from children. If we become aware of such data
                    collection, we will delete it promptly.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. International Data Transfers
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure appropriate
                  safeguards are in place to protect your data in accordance
                  with applicable privacy laws and regulations.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Gavel className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    9. Policy Updates
                  </h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy periodically to reflect
                  changes in our practices or legal requirements. Significant
                  changes will be communicated via email or platform
                  notification. Your continued use of BizConnect constitutes
                  acceptance of the updated policy.
                </p>
              </section>

              {/* Contact Section */}
              <section className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">
                    10. Contact Us
                  </h2>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    If you have questions about this Privacy Policy or want to
                    exercise your privacy rights:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Privacy Officer:</strong> privacy@bizconnect.com
                    </p>
                    <p>
                      <strong>Data Protection:</strong>{" "}
                      dataprotection@bizconnect.com
                    </p>
                    <p>
                      <strong>General Support:</strong> support@bizconnect.com
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Notice */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 text-center">
                <p className="text-lg font-semibold mb-2">
                  Your Privacy Matters
                </p>
                <p className="text-purple-100">
                  We&apos;re committed to protecting your personal information and
                  being transparent about our data practices. Contact us anytime
                  with questions or concerns.
                </p>
                <p className="text-purple-200 text-sm mt-4">
                  Secure transactions, trusted connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>&copy; 2025 BizConnect. All rights reserved.</p>
      </div>
    </div>
  );
}
