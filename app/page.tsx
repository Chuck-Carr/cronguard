import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              CronGuard
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/login"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-zinc-900 dark:text-white leading-tight">
            Monitor your scheduled tasks.
            <br />
            <span className="text-blue-600">Know when they fail.</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Simple, reliable monitoring for cron jobs, background workers, pipelines, and any recurring task. Get instant alerts when things go wrong.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              Get Started Free
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
            Free plan includes 3 monitors • No credit card required
          </p>
        </div>

        {/* Visual Demo */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-lg border border-zinc-800 shadow-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="bg-zinc-950 rounded p-4 font-mono text-sm">
              <div className="text-zinc-500"># Add to your crontab</div>
              <div className="text-green-400 mt-2">0 2 * * * /scripts/backup.sh && curl https://cronguard.app/ping/abc123</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-50 dark:bg-zinc-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
              Everything you need to monitor your jobs
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Dead simple setup. No complex configuration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 border border-zinc-200 dark:border-zinc-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                Instant Alerts
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Get notified via email, Slack, or SMS the moment your cron job fails or is late.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 border border-zinc-200 dark:border-zinc-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                Simple Dashboard
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Track all your monitors in one place. View history, uptime, and ping logs at a glance.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-lg p-8 border border-zinc-200 dark:border-zinc-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                Grace Periods
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Configure grace periods for late jobs. Don't get alerted for temporary delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { 
                name: 'Free', 
                price: '$0', 
                monitors: '3 monitors', 
                features: ['7-day history', 'Email alerts', 'Delayed notifications'],
                cta: 'Start Free'
              },
              { 
                name: 'Starter', 
                price: '$7', 
                monitors: '20 monitors', 
                features: ['30-day history', 'Instant alerts', 'Webhooks (Slack/Discord)'],
                cta: 'Get Started',
                popular: true
              },
              { 
                name: 'Pro', 
                price: '$19', 
                monitors: '100 monitors', 
                features: ['90-day history', 'SMS alerts', 'Priority support'],
                cta: 'Get Started'
              },
              { 
                name: 'Business', 
                price: '$49', 
                monitors: 'Unlimited', 
                features: ['1-year history', 'Priority support', 'SLA guarantees'],
                cta: 'Contact Us'
              },
            ].map((plan) => (
              <div 
                key={plan.name} 
                className={`relative bg-white dark:bg-zinc-800 rounded-xl p-6 border ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
                    : 'border-zinc-200 dark:border-zinc-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">/month</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-6">
                    {plan.monitors}
                  </p>
                  <Link
                    href="/signup"
                    className={`block w-full py-2 px-4 rounded-lg font-medium transition ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-600'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 dark:bg-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Start monitoring your cron jobs today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get started in minutes. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition shadow-xl"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>© 2025 CronGuard. Simple cron job monitoring.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
