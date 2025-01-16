/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Link from 'next/link';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Button */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
        <Link 
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black/20 hover:bg-black/30 rounded-full backdrop-blur-sm transition-all duration-200 group"
        >
          <svg 
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center">Privacy Policy</h1>
          <p className="mt-4 text-lg text-purple-100 text-center">
            Your privacy is important to us. This policy explains how we handle your data.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Introduction */}
          <section className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to OmniSocial. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we handle your data when you use our application.
            </p>
          </section>

          {/* Data Collection */}
          <section className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data We Collect</h2>
            <p className="text-gray-700 mb-4">When you use OmniSocial, we collect and process the following information:</p>
            <ul className="list-none space-y-3">
              {[
                'Account information (name, email)',
                'Social media integration data',
                'Automation preferences and settings',
                'Usage data and analytics'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Data Usage */}
          <section className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
            <p className="text-gray-700 mb-4">We use your data to:</p>
            <ul className="list-none space-y-3">
              {[
                'Provide and maintain our services',
                'Process your social media automations',
                'Improve our services',
                'Communicate with you about our services',
                'Comply with legal obligations'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Data Sharing */}
          <section className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Third Parties</h2>
            <p className="text-gray-700 leading-relaxed">
              We share your data with third parties only as necessary to provide our services, 
              including social media platforms you choose to integrate with. We require all third 
              parties to respect your data's security and handle it according to the law.
            </p>
          </section>

          {/* Security */}
          <section className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your personal data against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          {/* User Rights */}
          <section className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-none space-y-3">
              {[
                'Access your personal data',
                'Correct inaccurate data',
                'Request deletion of your data',
                'Object to processing of your data',
                'Request transfer of your data'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mr-3">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact */}
          <section className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, 
              please contact us at&nbsp;
              <a href="mailto:support@omnisocial.com" className="text-purple-600 hover:text-purple-700 underline">
                support@omnisocial.com
              </a>
            </p>
          </section>

          {/* Changes */}
          <section className="border-b border-gray-100 pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the effective date.
            </p>
          </section>

          {/* Last Updated */}
          <section className="pt-4">
            <p className="text-sm text-gray-500 text-center">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 