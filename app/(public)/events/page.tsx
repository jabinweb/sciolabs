import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
]

const programmes = [
  'CareBridge',
  'BeGin',
  'ScioSprints',
  'TheoLingua',
  'ScioGuidance',
]

export default function EventsPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[75svh] items-center overflow-hidden bg-scio-blue-dark pt-24 md:pt-28">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #1e3a6f 0%, #2d5296 55%, #1e3a6f 100%)',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center text-white">
            <Badge className="mb-6 border-0 bg-white px-4 py-1.5 font-heading text-xs font-semibold tracking-wider text-scio-blue uppercase hover:bg-white/90">
              ScioLabs @ REC 2026
            </Badge>

            <h1 className="font-heading heading-primary mb-6 text-4xl text-white md:text-5xl lg:text-6xl">
              Upward Equipping.
            </h1>

            <p
              className="font-body text-body mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl"
              style={{ color: '#f3f4f6' }}
            >
              Purpose-built learning for outcomes that last.
            </p>

            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-scio-orange px-8 font-heading text-base font-semibold text-white shadow-lg hover:bg-scio-orange-dark"
            >
              <a href="#connect">Get in touch</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats — no borders; separation via background only */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-12 text-center md:py-14">
              <p className="font-heading text-3xl font-bold text-scio-blue md:text-4xl">
                {stat.value}
              </p>
              <p className="font-body mt-2 text-sm text-gray-600 md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Intro + programmes */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading heading-primary mb-4 text-2xl text-scio-blue md:text-3xl">
            At Reimagining Education
          </h2>
          <p className="font-body text-body mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
            We equip churches, schools, and communities with programmes and
            tools that form wisdom, character, and competence.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {programmes.map((name) => (
              <Badge
                key={name}
                variant="secondary"
                className="rounded-full border border-scio-blue/15 bg-white px-4 py-2 font-heading text-sm font-medium text-scio-blue shadow-sm"
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Form — match Contact page structure */}
      <section
        id="connect"
        className="scroll-mt-24 bg-gradient-to-br from-slate-50 to-blue-50 py-16 md:py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="mb-2">
                <p className="mb-3 font-heading text-sm font-semibold tracking-wider text-scio-orange uppercase">
                  Meet us at REC
                </p>
                <h2 className="font-heading heading-primary mb-4 text-3xl text-scio-blue">
                  Leave your details
                </h2>
                <p className="font-body text-body leading-relaxed text-gray-600">
                  Tell us what you&apos;re looking for — we&apos;ll follow up
                  after the conference.
                </p>
              </div>

              <Card className="group border-0 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-scio-blue transition-transform duration-300 group-hover:scale-105">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-heading mb-1 text-lg font-semibold text-gray-800">
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
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-scio-orange transition-transform duration-300 group-hover:scale-105">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-heading mb-1 text-lg font-semibold text-gray-800">
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
              <CardContent className="p-8">
                <h3 className="font-heading heading-primary mb-2 text-2xl text-scio-blue">
                  Send an enquiry
                </h3>
                <p className="font-body mb-6 text-sm text-gray-600">
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
