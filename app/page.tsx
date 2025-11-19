import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50/30 to-white dark:from-zinc-950 dark:via-zinc-900/30 dark:to-zinc-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                TaskAlive
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-slide-in-down">
            <Badge variant="info" size="md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Trusted by developers worldwide
            </Badge>
          </div>

          {/* Headline */}
          <div className="text-center mb-12 space-y-6 animate-slide-in-up">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-zinc-900 dark:text-white leading-[1.1] tracking-tight">
              Monitor your
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                scheduled tasks
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              Get instant alerts when your cron jobs, background workers, and scheduled tasks fail or don't run on time.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 animate-slide-in-up">
            <Link href="/signup">
              <Button size="xl" className="group">
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="xl" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
          
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free plan includes 3 monitors • No credit card required
          </p>
        </div>

        {/* Visual Demo */}
        <div className="mt-20 max-w-6xl mx-auto animate-slide-in-up">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-zinc-900 dark:bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-5 py-4 bg-zinc-950 border-b border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs text-zinc-500 font-mono">crontab</span>
              </div>
              
              {/* Code Content */}
              <div className="p-6 bg-zinc-950 font-mono text-sm">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-600 select-none">1</span>
                    <span className="text-zinc-500"># Backup database every night at 2 AM</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-600 select-none">2</span>
                    <div>
                      <span className="text-purple-400">0 2 * * *</span>
                      <span className="text-zinc-300"> /scripts/backup.sh </span>
                      <span className="text-blue-400">&& </span>
                      <span className="text-green-400">curl https://taskalive.io/ping/abc123</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 opacity-50">
                    <span className="text-zinc-600 select-none">3</span>
                    <span className="text-zinc-600"></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-600 select-none">4</span>
                    <span className="text-zinc-500"># Process reports every Monday at 8 AM</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-600 select-none">5</span>
                    <div>
                      <span className="text-purple-400">0 8 * * 1</span>
                      <span className="text-zinc-300"> /scripts/reports.sh </span>
                      <span className="text-blue-400">&& </span>
                      <span className="text-green-400">curl https://taskalive.io/ping/def456</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/50 -z-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" size="lg" className="mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-zinc-900 dark:text-white tracking-tight">
              Everything you need to monitor your jobs
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Dead simple setup. No complex configuration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border-2 border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 h-full shadow-lg hover:shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">
                  Instant Alerts
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Get notified via email, Slack, Discord, Teams, or SMS the moment your cron job fails or is late. Stay informed in real-time.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border-2 border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 h-full shadow-lg hover:shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">
                  Simple Dashboard
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Track all your monitors in one place. View history, uptime, and ping logs at a glance with beautiful visualizations.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-8 border-2 border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 h-full shadow-lg hover:shadow-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-white">
                  Grace Periods
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Configure grace periods for late jobs. Don't get alerted for temporary delays. Smart monitoring that understands your workflow.
                </p>
              </div>
            </div>
          </div>

          {/* Additional features grid */}
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔒', title: 'Secure', desc: 'End-to-end encryption' },
              { icon: '⚡', title: 'Fast', desc: 'Sub-second response times' },
              { icon: '📊', title: 'Analytics', desc: 'Detailed performance insights' },
              { icon: '🌐', title: 'Global', desc: 'Worldwide monitoring network' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 transition-colors">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <Badge variant="outline" size="lg" className="mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-zinc-900 dark:text-white tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Start free. Upgrade when you need more. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                features: ['30-day history', 'Instant alerts', 'Webhooks (Slack/Discord/Teams)'],
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
                className={`relative group ${
                  plan.popular ? 'md:-mt-4 md:mb-4' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge variant="info" size="sm">
                      ⭐ Most Popular
                    </Badge>
                  </div>
                )}
                <div className={`
                  relative h-full bg-white dark:bg-zinc-900 rounded-3xl p-8
                  border-2 transition-all duration-300
                  ${
                    plan.popular 
                      ? 'border-blue-500 shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/10 scale-105' 
                      : 'border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700'
                  }
                `}>
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"></div>
                  )}
                  <div className="relative">
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
                        {plan.name}
                      </h3>
                      <div className="mb-2">
                        <span className="text-5xl font-black text-zinc-900 dark:text-white">
                          {plan.price}
                        </span>
                        <span className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">/mo</span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        {plan.monitors}
                      </p>
                    </div>
                    
                    <Link href="/signup" className="block mb-8">
                      <Button 
                        size="md" 
                        variant={plan.popular ? 'primary' : 'outline'}
                        className="w-full"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                    
                    <ul className="space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                          <svg className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 dark:from-blue-700 dark:via-blue-800 dark:to-purple-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-semibold mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Join 1000+ developers monitoring their tasks
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white leading-tight">
            Ready to never miss
            <br />
            a failed job again?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-light">
            Get started in minutes. No credit card required. Start monitoring for free.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="xl" variant="secondary" className="bg-white hover:bg-zinc-50 text-blue-700 shadow-2xl hover:shadow-white/20 group">
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                View Pricing
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  TaskAlive
                </span>
              </Link>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4 max-w-sm">
                Simple, reliable monitoring for cron jobs and scheduled tasks. Get instant alerts when things go wrong.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#pricing" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign In</Link></li>
                <li><Link href="/signup" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link></li>
                <li><Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              © 2025 TaskAlive. All rights reserved. Built for developers who care about reliability.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
