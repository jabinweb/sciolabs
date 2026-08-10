import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { RecInterestForm } from '@/components/events/rec-interest-form'
import { Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ScioLabs @ REC 2026 | Events',
  description:
    'Upward Equipping — purpose-built learning for outcomes that last. Meet ScioLabs at Reimagining Education Conference 2026.',
}

const stats = [
  { value: '25,000+', label: 'Learners trained' },
  { value: '20+', label: 'Partners' },
  { value: '4,000+', label: 'Games built' },
  { value: '70,000+', label: 'Learning hours' },
]

export default function EventsPage() {
  return (
    <main className="bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Intro + stats — two columns */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Badge className="mb-4 border-0 bg-white px-3 py-1 font-heading text-xs font-semibold tracking-wider text-scio-blue uppercase shadow-sm hover:bg-white">
                ScioLabs @ REC 2026
              </Badge>
              <h1 className="font-heading heading-primary mb-4 text-3xl text-scio-blue md:text-4xl">
                Upward Equipping.
              </h1>
              <p className="font-body text-body mb-4 text-base leading-relaxed text-gray-600 md:text-lg">
                Purpose-built learning for outcomes that last.
              </p>
              <p className="font-body text-sm leading-relaxed text-gray-600 md:text-base">
                Reimagining Education calls for churches and communities to
                build learning that forms wisdom, character, and competence.
                ScioLabs equips that work with programmes, tools, and training
                for the institutions carrying the mission forward.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-0 bg-white shadow-md">
                  <CardContent className="p-5 md:p-6">
                    <p className="font-heading text-2xl font-bold text-scio-blue md:text-3xl">
                      {stat.value}
                    </p>
                    <p className="font-body mt-1 text-sm text-gray-600">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="connect" className="scroll-mt-24 pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div>
                <p className="mb-2 font-heading text-xs font-semibold tracking-wider text-scio-orange uppercase">
                  Meet us at REC
                </p>
                <h2 className="font-heading heading-primary mb-3 text-2xl text-scio-blue md:text-3xl">
                  Leave your details
                </h2>
                <p className="font-body text-sm leading-relaxed text-gray-600 md:text-base">
                  Select what you&apos;re interested in — we&apos;ll follow up
                  after the conference.
                </p>
              </div>

              <Card className="group border-0 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-scio-blue">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-gray-800">
                        Email
                      </h4>
                      <a
                        href="mailto:info@sciolabs.in"
                        className="font-body text-sm text-gray-600 hover:text-scio-blue"
                      >
                        info@sciolabs.in
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-0 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-scio-orange">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-gray-800">
                        Phone
                      </h4>
                      <a
                        href="tel:+919495212484"
                        className="font-body text-sm text-gray-600 hover:text-scio-blue"
                      >
                        +91 9495-212-484
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 bg-white shadow-xl">
              <CardContent className="p-6 md:p-8">
                <h3 className="font-heading heading-primary mb-1 text-xl text-scio-blue md:text-2xl">
                  Send an enquiry
                </h3>
                <p className="font-body mb-5 text-sm text-gray-600">
                  We typically respond within 1–2 business days.
                </p>
                <RecInterestForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
