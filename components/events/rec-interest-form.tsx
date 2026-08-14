'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

const INTEREST_OPTIONS = [
  'Gamified Revision Portals',
  'Teacher Training',
  'Curriculum Digitisation',
  'Bible-based English Courses',
  'English for Healthcare',
  'English for Young Learners',
  'Diagnostic tools for learners',
  'Skills workshops for GenZ',
  'Career Guidance & Mentoring',
] as const

export function RecInterestForm() {
  const [loading, setLoading] = useState(false)
  const [interests, setInterests] = useState<string[]>([])

  function toggleInterest(option: string, checked: boolean) {
    setInterests((prev) =>
      checked ? [...prev, option] : prev.filter((item) => item !== option)
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (interests.length === 0) {
      toast.error('Please select at least one option')
      return
    }

    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const city = (form.elements.namedItem('city') as HTMLInputElement).value.trim()
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      ...(email ? { email } : {}),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      organisation: (form.elements.namedItem('organisation') as HTMLInputElement)
        .value,
      ...(city ? { city } : {}),
      interests,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'rec-2026',
          data,
          ...(email ? { email } : {}),
          phone: data.phone,
          source: 'events-rec-2026',
        }),
      })

      const result = await res.json()

      if (result.success) {
        toast.success("Thanks — we'll be in touch soon.")
        form.reset()
        setInterests([])
      } else {
        toast.error(result.error || 'Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="font-heading text-sm font-medium text-gray-700"
          >
            Name
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Your name"
            className="h-10 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-heading text-sm font-medium text-gray-700"
          >
            Email <span className="font-normal text-gray-500">(optional)</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@organisation.org"
            className="h-10 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="font-heading text-sm font-medium text-gray-700"
          >
            Phone number (WhatsApp)
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            className="h-10 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="city"
            className="font-heading text-sm font-medium text-gray-700"
          >
            City / Town{' '}
            <span className="font-normal text-gray-500">(optional)</span>
          </Label>
          <Input
            id="city"
            name="city"
            placeholder="Your city or town"
            className="h-10 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="organisation"
          className="font-heading text-sm font-medium text-gray-700"
        >
          Organisation
        </Label>
        <Input
          id="organisation"
          name="organisation"
          placeholder="School, church, or institution"
          className="h-10 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="font-heading text-sm font-medium text-gray-700">
          What we offer?
        </legend>
        <p className="font-body text-xs text-gray-500">
          Select all that apply
        </p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {INTEREST_OPTIONS.map((option) => {
            const id = `interest-${option.replace(/\s+/g, '-').toLowerCase()}`
            const checked = interests.includes(option)

            return (
              <label
                key={option}
                htmlFor={id}
                className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-gray-200 bg-slate-50/80 px-3 py-2.5 transition-colors hover:border-scio-blue/40 hover:bg-white has-[:checked]:border-scio-blue has-[:checked]:bg-scio-blue/5"
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={(value) =>
                    toggleInterest(option, value === true)
                  }
                  className="mt-0.5"
                />
                <span className="font-body text-sm leading-snug text-gray-800">
                  {option}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label
          htmlFor="message"
          className="font-heading text-sm font-medium text-gray-700"
        >
          Any questions for us?
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Optional — ask us anything"
          className="rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-scio-orange font-heading font-semibold text-white hover:bg-scio-orange-dark"
      >
        {loading ? 'Sending…' : 'Send enquiry'}
      </Button>
    </form>
  )
}
