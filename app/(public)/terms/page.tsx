import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-orange via-scio-orange-light to-scio-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="font-heading heading-primary text-4xl md:text-5xl mb-6">
              Terms of Service
            </h1>
            <p className="font-body text-body text-lg text-gray-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="space-y-8">
                <div>
                  <p className="font-body text-gray-600 mb-6">
                    <strong>Last updated:</strong> January 1, 2024
                  </p>
                  <p className="font-body text-gray-700 leading-relaxed">
                    These Terms of Service (&quot;Terms&quot;) govern your use of Scio Labs&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.eslintreact/no-unescaped-entities website and services. By accessing or using our services, you agree to be bound by these Terms.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">Acceptance of Terms</h2>
                  <p className="font-body text-gray-700">
                    By accessing and using our website and services, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">Description of Services</h2>
                  <p className="font-body text-gray-700 mb-4">Scio Labs provides educational and career guidance services including:</p>
                  <ul className="font-body text-gray-700 ml-6 space-y-1">
                    <li>• Career counseling and guidance</li>
                    <li>• Educational training programs</li>
                    <li>• Professional development services</li>
                    <li>• Online educational resources</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">User Responsibilities</h2>
                  <p className="font-body text-gray-700 mb-4">You agree to:</p>
                  <ul className="font-body text-gray-700 ml-6 space-y-1">
                    <li>• Provide accurate and complete information</li>
                    <li>• Use our services for lawful purposes only</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Not interfere with the operation of our services</li>
                    <li>• Maintain the confidentiality of your account information</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">Intellectual Property</h2>
                  <p className="font-body text-gray-700">
                    All content, materials, and intellectual property on our website and in our services are owned by Scio Labs and are protected by copyright, trademark, and other laws.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">Payment Terms</h2>
                  <p className="font-body text-gray-700 mb-4">For paid services:</p>
                  <ul className="font-body text-gray-700 ml-6 space-y-1">
                    <li>• Payment is due upon registration or as specified</li>
                    <li>• Refunds are subject to our refund policy</li>
                    <li>• Prices may change with notice</li>
                    <li>• You are responsible for all applicable taxes</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">Limitation of Liability</h2>
                  <p className="font-body text-gray-700">
                    Scio Labs shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">Termination</h2>
                  <p className="font-body text-gray-700">
                    We reserve the right to terminate or suspend your access to our services at any time for violation of these Terms or for any other reason.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">Changes to Terms</h2>
                  <p className="font-body text-gray-700">
                    We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-orange mb-4">Contact Information</h2>
                  <p className="font-body text-gray-700">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="font-body text-gray-700">Email: info@sciolabs.in</p>
                    <p className="font-body text-gray-700">Phone: +91 9495212484</p>
                    <p className="font-body text-gray-700">Address: N-304, Ashiyana Sector – N, Lucknow – 226012, India</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
