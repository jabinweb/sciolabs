import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="font-heading heading-primary text-4xl md:text-5xl mb-6">
              Privacy Policy
            </h1>
            <p className="font-body text-body text-lg text-gray-100 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                    This Privacy Policy describes how Scio Labs (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, and shares your personal information when you visit our website or use our services.
                  </p>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-blue mb-4">Information We Collect</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">Personal Information</h3>
                      <p className="font-body text-gray-700">We may collect personal information such as your name, email address, phone number, and other contact details when you:</p>
                      <ul className="font-body text-gray-700 ml-6 mt-2 space-y-1">
                        <li>• Contact us through our website</li>
                        <li>• Subscribe to our newsletter</li>
                        <li>• Register for our services</li>
                        <li>• Participate in our programs</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">Usage Information</h3>
                      <p className="font-body text-gray-700">We automatically collect information about how you use our website, including your IP address, browser type, pages visited, and time spent on our site.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-blue mb-4">How We Use Your Information</h2>
                  <p className="font-body text-gray-700 mb-4">We use the information we collect to:</p>
                  <ul className="font-body text-gray-700 ml-6 space-y-1">
                    <li>• Provide and improve our services</li>
                    <li>• Communicate with you about our programs</li>
                    <li>• Send you updates and marketing communications</li>
                    <li>• Analyze website usage and performance</li>
                    <li>• Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-blue mb-4">Information Sharing</h2>
                  <p className="font-body text-gray-700">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:</p>
                  <ul className="font-body text-gray-700 ml-6 mt-2 space-y-1">
                    <li>• Service providers who assist us in operating our website and services</li>
                    <li>• Legal requirements or to protect our rights</li>
                    <li>• Business transfers or mergers</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-blue mb-4">Data Security</h2>
                  <p className="font-body text-gray-700">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-blue mb-4">Your Rights</h2>
                  <p className="font-body text-gray-700 mb-4">You have the right to:</p>
                  <ul className="font-body text-gray-700 ml-6 space-y-1">
                    <li>• Access your personal information</li>
                    <li>• Correct inaccurate information</li>
                    <li>• Request deletion of your information</li>
                    <li>• Opt-out of marketing communications</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading heading-secondary text-2xl text-scio-blue mb-4">Contact Us</h2>
                  <p className="font-body text-gray-700">
                    If you have any questions about this Privacy Policy, please contact us at:
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
