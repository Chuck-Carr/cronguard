import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
            CronGuard
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Simple, affordable cron job monitoring for developers
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Sign In
            </Link>
          </div>
        </header>

        <section className="max-w-4xl mx-auto mb-16">
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">
              How it works
            </h2>
            <ol className="space-y-4 text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-4">
                <span className="font-bold text-blue-600">1.</span>
                <span>Create a monitor and get a unique ping URL</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-blue-600">2.</span>
                <span>Have your cron job ping that URL when it runs successfully</span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-blue-600">3.</span>
                <span>Get alerted if your job fails or doesn't run</span>
              </li>
            </ol>
            <div className="mt-6 bg-zinc-100 dark:bg-zinc-900 p-4 rounded font-mono text-sm">
              <code>0 2 * * * /scripts/backup.sh && curl https://cronguard.app/ping/abc123</code>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-white">
            Simple Pricing
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Free', price: '$0', monitors: '3 monitors', features: ['Email alerts (24h delay)', '7-day history'] },
              { name: 'Starter', price: '$5', monitors: '20 monitors', features: ['Instant email alerts', 'Webhooks', '30-day history'] },
              { name: 'Pro', price: '$12', monitors: '100 monitors', features: ['Everything in Starter', 'SMS alerts', '90-day history'] },
              { name: 'Business', price: '$25', monitors: 'Unlimited', features: ['Everything in Pro', 'Priority support', '1-year history'] },
            ].map((plan) => (
              <div key={plan.name} className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4 text-blue-600">{plan.price}<span className="text-base text-zinc-600">/mo</span></p>
                <p className="font-semibold mb-4 text-zinc-700 dark:text-zinc-300">{plan.monitors}</p>
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
