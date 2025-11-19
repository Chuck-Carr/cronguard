'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="space-y-8 max-w-3xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
          Support
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Need help? We're here for you.
        </p>
      </div>

      {/* Quick Help */}
      <Card gradient>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Before You Contact Us</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                Check out our <a href="/dashboard/integrations" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">Integrations Guide</a> for step-by-step setup instructions.
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                Most common questions are answered there, including cron setup, Windows Task Scheduler, and webhook configurations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card hover>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                Message
              </label>
              <textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please describe your issue or question in detail..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-100">Message sent!</p>
                    <p className="text-sm text-green-800 dark:text-green-200">We'll get back to you as soon as possible.</p>
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-900 dark:text-red-100">Failed to send</p>
                    <p className="text-sm text-red-800 dark:text-red-200">Please try again or email us directly at support@taskalive.io</p>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={status === 'sending'}
              className="w-full"
            >
              {status === 'sending' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Alternative Contact */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Prefer email? Reach us directly at
            </p>
            <a 
              href="mailto:support@taskalive.io" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              support@taskalive.io
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
