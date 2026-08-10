'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export function RecInterestForm() {
  const [loading, setLoading] = useState(false)
  const [interest, setInterest] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!interest) {
      toast.error('Please select a programme')
      return
    }

    setLoading(true)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      organisation: (form.elements.namedItem('organisation') as HTMLInputElement)
        .value,
      interest,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: 'rec-2026',
          data,
          email: data.email,
          source: 'events-rec-2026',
        }),
      })

      const result = await res.json()

      if (result.success) {
        toast.success("Thanks — we'll be in touch soon.")
        form.reset()
        setInterest('')
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
            className="h-11 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="font-heading text-sm font-medium text-gray-700"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@organisation.org"
            className="h-11 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
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
          className="h-11 rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
        />
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="interest"
          className="font-heading text-sm font-medium text-gray-700"
        >
          Interested in
        </Label>
        <Select value={interest} onValueChange={setInterest} required>
          <SelectTrigger
            id="interest"
            className="h-11 w-full rounded-lg border-gray-300 focus:border-scio-blue focus:ring-scio-blue"
          >
            <SelectValue placeholder="Select a programme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CareBridge">CareBridge</SelectItem>
            <SelectItem value="BeGin">BeGin</SelectItem>
            <SelectItem value="ScioSprints">ScioSprints</SelectItem>
            <SelectItem value="TheoLingua">TheoLingua</SelectItem>
            <SelectItem value="ScioGuidance">ScioGuidance</SelectItem>
            <SelectItem value="Other">Other / general enquiry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="message"
          className="font-heading text-sm font-medium text-gray-700"
        >
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="How can we help?"
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
