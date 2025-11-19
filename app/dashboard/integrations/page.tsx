import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function IntegrationsPage() {
  return (
    <div className="space-y-8 max-w-5xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
          Integrations
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400">
          Learn how to integrate TaskAlive with your cron jobs, scheduled tasks, and notification channels.
        </p>
      </div>

      {/* Overview */}
      <Card gradient>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">How TaskAlive Works</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                TaskAlive monitors your scheduled tasks by expecting regular "ping" requests at specified intervals. 
                Simply add a curl request to your cron job or scheduled task, and we'll alert you if it fails to run on time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Primary Platforms */}
            <div className="grid md:grid-cols-3 gap-3">
              <a href="#crontab" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 dark:bg-zinc-800 rounded-lg">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Linux/Mac Crontab
                </span>
              </a>

              <a href="#windows" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path className="text-blue-500" d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                  </svg>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Windows Task Scheduler
                </span>
              </a>

              <a href="#webhooks" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                <div className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-950 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </div>
                <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  Webhooks & Alerts
                </span>
              </a>
            </div>

            {/* More Platforms Toggle */}
            <details className="group">
              <summary className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all cursor-pointer">
                <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  More Platforms
                </span>
              </summary>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                <a href="#airflow" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                  <div className="w-8 h-8 flex items-center justify-center bg-cyan-100 dark:bg-cyan-950 rounded-lg">
                    <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                    Apache Airflow
                  </span>
                </a>

                <a href="#sidekiq" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                  <div className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-950 rounded-lg">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.464 3.464C-.878 7.806-.878 14.68 3.464 19.022s11.216 4.342 15.558 0 4.342-11.216 0-15.558-11.216-4.342-15.558 0z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                    Sidekiq (Ruby)
                  </span>
                </a>

                <a href="#celery" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-950 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.25 2.1l-.5.9-.9.5h-1.7l-.9-.5-.5-.9V.4l.5-.9.9-.5h1.7l.9.5.5.9v1.7z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                    Celery (Python)
                  </span>
                </a>

                <a href="#heroku" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-100 dark:bg-purple-950 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.61 0H3.39C2.189 0 1.23.96 1.23 2.16v19.68c0 1.198.959 2.16 2.16 2.16h17.22c1.2 0 2.159-.962 2.159-2.16V2.16C22.77.96 21.811 0 20.61 0z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                    Heroku
                  </span>
                </a>

                <a href="#lambda" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                  <div className="w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-950 rounded-lg">
                    <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.52 14.72L2.08 12 6.52 9.28l1.67.96v-3.7L12 4l3.81 2.54v3.7l1.67-.96L21.92 12l-4.44 2.72-1.67-.96v3.7L12 20l-3.81-2.54v-3.7l-1.67.96z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                    AWS Lambda
                  </span>
                </a>

                <a href="#kubernetes" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-950 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011-1.528-2.043a5.156 5.156 0 0 0-.73 2.974l2.084.836zm.582-2.471a.44.44 0 0 0 .766-.115l.012-.001.15-2.564a5.161 5.161 0 0 0-2.865.956l1.936 1.724zm.013 2.127l-.001.005a.44.44 0 0 0 .611-.03l.003-.001 2.017-1.588a5.156 5.156 0 0 0-.987-2.81l-1.643 2.424zm4.655 4.655l-2.122-1.931-.004.001a.44.44 0 0 0-.653.483l-.002.011.464 2.516a5.166 5.166 0 0 0 2.317-1.08zm-2.401-5.946l-.01-.002a.44.44 0 0 0-.309.743l.004.011 1.854 1.693a5.165 5.165 0 0 0 .545-2.97l-2.084.526zm-2.009-1.29a.44.44 0 0 0 .766.114l.012.001 1.543-2.054a5.156 5.156 0 0 0-2.76-1.098l.438 3.036zm6.213 8.09l-2.664-.911-.003.004a.44.44 0 0 0-.452.73l-.006.011 1.117 2.325a5.17 5.17 0 0 0 2.008-2.159z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                    Kubernetes
                  </span>
                </a>

                <a href="#jenkins" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                  <div className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-950 rounded-lg">
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.015 0c-.403 0-.78.166-1.105.436l-.023.022a1.606 1.606 0 0 0-.487 1.14c0 .042.003.084.008.125a6.913 6.913 0 0 0-2.024 1.348"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                    Jenkins
                  </span>
                </a>

                <a href="#nodejs" className="flex items-center gap-3 p-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all group">
                  <div className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-950 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.276-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm">
                    Node.js
                  </span>
                </a>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>

      {/* 1. Cron */}
      <Card id="cron" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-zinc-900 dark:bg-zinc-800 rounded-xl">
              <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <CardTitle>Cron (Unix/Linux/Mac)</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                The classic Unix scheduler
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Add a curl command after your cron job to ping TaskAlive on success:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-sm">
            <div className="text-zinc-500"># Ping only on success</div>
            <div className="text-zinc-300 mt-2">
              <span className="text-purple-400">0 2 * * *</span>
              <span className="text-zinc-300"> /path/to/backup.sh </span>
              <span className="text-blue-400">&& </span>
              <span className="text-green-400">curl -X POST https://taskalive.io/api/ping/YOUR_PING_URL</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Windows Task Scheduler */}
      <Card id="windows" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                <path className="text-blue-500" d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
              </svg>
            </div>
            <div>
              <CardTitle>Windows Task Scheduler</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Built-in Windows scheduler
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Create a wrapper batch file that runs your task and pings on success:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-green-400">@echo off</div>
            <div className="text-zinc-300">call C:\path\to\your-script.bat</div>
            <div className="text-blue-400 mt-2">if %ERRORLEVEL% EQU 0 (</div>
            <div className="text-green-400 ml-4">  curl -X POST https://taskalive.io/api/ping/YOUR_PING_URL</div>
            <div className="text-blue-400">)</div>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks & Alerts */}
      <Card id="webhooks" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-950 rounded-xl">
              <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div>
              <CardTitle>Webhooks & Alert Channels</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Configure where you receive failure notifications
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <p className="text-zinc-600 dark:text-zinc-400">
            TaskAlive can send alerts through multiple channels. Configure these in your monitor settings.
          </p>

          {/* Slack */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Slack</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400 ml-1">
              <li>Go to <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">api.slack.com/messaging/webhooks</a></li>
              <li>Create a new app and enable "Incoming Webhooks"</li>
              <li>Add webhook to your workspace and select alert channel</li>
              <li>Copy the webhook URL and paste it in your monitor's Slack field</li>
            </ol>
          </div>

          {/* Discord */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Discord</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400 ml-1">
              <li>Open Discord server settings → Integrations → Webhooks</li>
              <li>Click "New Webhook" and give it a name</li>
              <li>Select the channel for alerts</li>
              <li>Copy the webhook URL and paste it in your monitor's Discord field</li>
            </ol>
          </div>

          {/* Microsoft Teams */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                  <circle cx="16.5" cy="7.5" r="5.5" fill="#5059C9"/>
                  <path d="M10 13H3a3 3 0 0 0-3 3v5a1 1 0 0 0 1 1h9v-9z" fill="#7B83EB"/>
                  <rect x="11" y="13" width="10" height="9" rx="1" fill="#5059C9"/>
                  <path d="M10 0H4a4 4 0 0 0-4 4v6h10V0z" fill="#7B83EB"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Microsoft Teams</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400 ml-1">
              <li>In Teams, go to your channel → "..." menu → Connectors</li>
              <li>Search for "Incoming Webhook" and configure it</li>
              <li>Give it a name like "TaskAlive Alerts"</li>
              <li>Copy the webhook URL and paste it in your monitor's Teams field</li>
            </ol>
          </div>

          {/* Email */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-10 h-10 text-zinc-700 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Email</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Email alerts are sent to your account email automatically. Add additional recipients (comma-separated) in your monitor's "Additional Email Addresses" field.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* More Platforms Section */}
      <div id="more-platforms" className="pt-8">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
            More Platforms
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Quick integration snippets for additional scheduling platforms
          </p>
        </div>
      </div>

      {/* 3. Apache Airflow */}
      <Card id="airflow" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-cyan-100 dark:bg-cyan-950 rounded-xl">
              <svg className="w-7 h-7 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Apache Airflow</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Python-based workflow orchestration
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Add a SimpleHttpOperator or BashOperator as the final task in your DAG:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-blue-400">from</div>
            <div className="text-zinc-300"> airflow.operators.http_operator </div>
            <div className="text-blue-400">import</div>
            <div className="text-zinc-300"> SimpleHttpOperator</div>
            <div className="mt-2 text-zinc-500"># Add as final task in your DAG</div>
            <div className="text-zinc-300">ping_taskalive = SimpleHttpOperator(</div>
            <div className="text-zinc-300 ml-4">task_id=<span className="text-green-400">'ping_taskalive'</span>,</div>
            <div className="text-zinc-300 ml-4">http_conn_id=<span className="text-green-400">'taskalive'</span>,</div>
            <div className="text-zinc-300 ml-4">endpoint=<span className="text-green-400">'/api/ping/YOUR_PING_URL'</span>,</div>
            <div className="text-zinc-300 ml-4">method=<span className="text-green-400">'POST'</span></div>
            <div className="text-zinc-300">)</div>
            <div className="mt-2 text-zinc-500"># Set dependencies</div>
            <div className="text-zinc-300">your_task &gt;&gt; ping_taskalive</div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Sidekiq (Ruby) */}
      <Card id="sidekiq" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-950 rounded-xl">
              <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.464 3.464C-.878 7.806-.878 14.68 3.464 19.022s11.216 4.342 15.558 0 4.342-11.216 0-15.558-11.216-4.342-15.558 0z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Sidekiq (Ruby/Rails)</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Background job processor for Ruby
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Add an HTTP request at the end of your Sidekiq job's perform method:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-blue-400">class</div>
            <div className="text-zinc-300"> BackupJob</div>
            <div className="text-blue-400 ml-2">include</div>
            <div className="text-zinc-300"> Sidekiq::Worker</div>
            <div className="mt-2 ml-2 text-blue-400">def</div>
            <div className="text-zinc-300"> perform</div>
            <div className="text-zinc-500 ml-4"># Your job logic here</div>
            <div className="text-zinc-300 ml-4">run_backup</div>
            <div className="mt-2 text-zinc-500 ml-4"># Ping TaskAlive on success</div>
            <div className="text-zinc-300 ml-4">HTTParty.post(<span className="text-green-400">'https://taskalive.io/api/ping/YOUR_PING_URL'</span>)</div>
            <div className="text-blue-400 ml-2">end</div>
            <div className="text-blue-400">end</div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Celery (Python) */}
      <Card id="celery" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-950 rounded-xl">
              <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.25 2.1l-.5.9-.9.5h-1.7l-.9-.5-.5-.9V.4l.5-.9.9-.5h1.7l.9.5.5.9v1.7z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Celery (Python)</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Distributed task queue for Python
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Add an HTTP request at the end of your Celery task:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-blue-400">from</div>
            <div className="text-zinc-300"> celery </div>
            <div className="text-blue-400">import</div>
            <div className="text-zinc-300"> shared_task</div>
            <div className="text-blue-400">import</div>
            <div className="text-zinc-300"> requests</div>
            <div className="mt-2 text-zinc-300">@shared_task</div>
            <div className="text-blue-400">def</div>
            <div className="text-zinc-300"> backup_database():</div>
            <div className="text-zinc-500 ml-4"># Your task logic here</div>
            <div className="text-zinc-300 ml-4">perform_backup()</div>
            <div className="mt-2 text-zinc-500 ml-4"># Ping TaskAlive on success</div>
            <div className="text-zinc-300 ml-4">requests.post(<span className="text-green-400">'https://taskalive.io/api/ping/YOUR_PING_URL'</span>)</div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Heroku Scheduler */}
      <Card id="heroku" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-950 rounded-xl">
              <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.61 0H3.39C2.189 0 1.23.96 1.23 2.16v19.68c0 1.198.959 2.16 2.16 2.16h17.22c1.2 0 2.159-.962 2.159-2.16V2.16C22.77.96 21.811 0 20.61 0z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Heroku Scheduler</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Simple cloud-based scheduler
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Add a curl command after your rake task or script in the Heroku Scheduler dashboard:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-sm">
            <div className="text-zinc-300">rake your:task && curl -X POST https://taskalive.io/api/ping/YOUR_PING_URL</div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Or in your Ruby script:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-zinc-500"># At the end of your script</div>
            <div className="text-zinc-300">require <span className="text-green-400">'net/http'</span></div>
            <div className="text-zinc-300">Net::HTTP.post_form(</div>
            <div className="text-zinc-300 ml-4">URI(<span className="text-green-400">'https://taskalive.io/api/ping/YOUR_PING_URL'</span>), {}</div>
            <div className="text-zinc-300">)</div>
          </div>
        </CardContent>
      </Card>

      {/* 7. AWS Lambda */}
      <Card id="lambda" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-950 rounded-xl">
              <svg className="w-7 h-7 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.52 14.72L2.08 12 6.52 9.28l1.67.96v-3.7L12 4l3.81 2.54v3.7l1.67-.96L21.92 12l-4.44 2.72-1.67-.96v3.7L12 20l-3.81-2.54v-3.7l-1.67.96z"/>
              </svg>
            </div>
            <div>
              <CardTitle>AWS Lambda + EventBridge</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Serverless scheduled functions
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Add an HTTP request at the end of your Lambda function:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-blue-400">const</div>
            <div className="text-zinc-300"> https = require(<span className="text-green-400">'https'</span>);</div>
            <div className="mt-2 text-blue-400">exports.handler =</div>
            <div className="text-zinc-300"> async (event) =&gt; {'{'}</div>
            <div className="text-zinc-500 ml-4">// Your Lambda logic here</div>
            <div className="text-zinc-300 ml-4">await performTask();</div>
            <div className="mt-2 text-zinc-500 ml-4">// Ping TaskAlive</div>
            <div className="text-zinc-300 ml-4">await fetch(<span className="text-green-400">'https://taskalive.io/api/ping/YOUR_PING_URL'</span>, {'{'}</div>
            <div className="text-zinc-300 ml-8">method: <span className="text-green-400">'POST'</span></div>
            <div className="text-zinc-300 ml-4">{'}'});</div>
            <div className="text-zinc-300">{'}'};</div>
          </div>
        </CardContent>
      </Card>

      {/* 8. Kubernetes CronJobs */}
      <Card id="kubernetes" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-950 rounded-xl">
              <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011-1.528-2.043a5.156 5.156 0 0 0-.73 2.974l2.084.836zm.582-2.471a.44.44 0 0 0 .766-.115l.012-.001.15-2.564a5.161 5.161 0 0 0-2.865.956l1.936 1.724z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Kubernetes CronJobs</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Container-orchestrated scheduled tasks
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Add curl to your container's command or use an init/sidecar container:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-blue-400">apiVersion:</div>
            <div className="text-zinc-300"> batch/v1</div>
            <div className="text-blue-400">kind:</div>
            <div className="text-zinc-300"> CronJob</div>
            <div className="text-blue-400">spec:</div>
            <div className="text-blue-400 ml-2">jobTemplate:</div>
            <div className="text-blue-400 ml-4">spec:</div>
            <div className="text-blue-400 ml-6">template:</div>
            <div className="text-blue-400 ml-8">spec:</div>
            <div className="text-blue-400 ml-10">containers:</div>
            <div className="text-zinc-300 ml-10">- name: task</div>
            <div className="text-zinc-300 ml-12">image: your-image</div>
            <div className="text-zinc-300 ml-12">command:</div>
            <div className="text-zinc-300 ml-14">- /bin/sh</div>
            <div className="text-zinc-300 ml-14">- -c</div>
            <div className="text-zinc-300 ml-14">- |</div>
            <div className="text-zinc-500 ml-16"># Run your task</div>
            <div className="text-zinc-300 ml-16">/app/backup.sh</div>
            <div className="text-zinc-500 ml-16"># Ping on success</div>
            <div className="text-zinc-300 ml-16">curl -X POST https://taskalive.io/api/ping/YOUR_PING_URL</div>
          </div>
        </CardContent>
      </Card>

      {/* 9. Jenkins */}
      <Card id="jenkins" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-950 rounded-xl">
              <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.015 0c-.403 0-.78.166-1.105.436l-.023.022a1.606 1.606 0 0 0-.487 1.14c0 .042.003.084.008.125a6.913 6.913 0 0 0-2.024 1.348"/>
              </svg>
            </div>
            <div>
              <CardTitle>Jenkins</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                CI/CD automation server
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            Add a post-build action or final pipeline stage:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-zinc-300">pipeline {'{'}</div>
            <div className="text-zinc-300 ml-4">stages {'{'}</div>
            <div className="text-zinc-300 ml-8">stage(<span className="text-green-400">'Your Task'</span>) {'{'}</div>
            <div className="text-zinc-300 ml-12">steps {'{'}</div>
            <div className="text-zinc-500 ml-16">// Your build steps</div>
            <div className="text-zinc-300 ml-12">{'}'}</div>
            <div className="text-zinc-300 ml-8">{'}'}</div>
            <div className="text-zinc-300 ml-4">{'}'}</div>
            <div className="text-zinc-300 ml-4 mt-2">post {'{'}</div>
            <div className="text-zinc-300 ml-8">success {'{'}</div>
            <div className="text-zinc-300 ml-12">sh <span className="text-green-400">'curl -X POST https://taskalive.io/api/ping/YOUR_PING_URL'</span></div>
            <div className="text-zinc-300 ml-8">{'}'}</div>
            <div className="text-zinc-300 ml-4">{'}'}</div>
            <div className="text-zinc-300">{'}'}</div>
          </div>
        </CardContent>
      </Card>

      {/* 10. Node.js (node-cron / Bull) */}
      <Card id="nodejs" hover>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-950 rounded-xl">
              <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.276-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z"/>
              </svg>
            </div>
            <div>
              <CardTitle>Node.js (node-cron / Bull)</CardTitle>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                JavaScript-based job scheduling
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-400">
            <strong>node-cron:</strong> Add an HTTP request in your scheduled function:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-blue-400">const</div>
            <div className="text-zinc-300"> cron = require(<span className="text-green-400">'node-cron'</span>);</div>
            <div className="text-blue-400">const</div>
            <div className="text-zinc-300"> axios = require(<span className="text-green-400">'axios'</span>);</div>
            <div className="mt-2 text-zinc-300">cron.schedule(<span className="text-green-400">'0 2 * * *'</span>, async () =&gt; {'{'}</div>
            <div className="text-zinc-500 ml-4">// Your task logic</div>
            <div className="text-zinc-300 ml-4">await runBackup();</div>
            <div className="mt-2 text-zinc-500 ml-4">// Ping TaskAlive</div>
            <div className="text-zinc-300 ml-4">await axios.post(<span className="text-green-400">'https://taskalive.io/api/ping/YOUR_PING_URL'</span>);</div>
            <div className="text-zinc-300">{'}'});</div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mt-4">
            <strong>Bull:</strong> Add a completed event handler:
          </p>
          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 font-mono text-xs space-y-1">
            <div className="text-zinc-300">queue.on(<span className="text-green-400">'completed'</span>, async (job) =&gt; {'{'}</div>
            <div className="text-zinc-300 ml-4">await axios.post(<span className="text-green-400">'https://taskalive.io/api/ping/YOUR_PING_URL'</span>);</div>
            <div className="text-zinc-300">{'}'});</div>
          </div>
        </CardContent>
      </Card>

      {/* Success Card */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
              Ready to Get Started?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-2xl mx-auto">
              Create your first monitor in the dashboard and get your unique ping URL. Then add a simple HTTP request to any of these platforms.
            </p>
            <div className="flex gap-3 justify-center">
              <a href="/dashboard/monitors" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Monitor
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
