import { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}

export function Badge({ 
  className = '', 
  children, 
  variant = 'default', 
  size = 'md',
  pulse = false,
  ...props 
}: BadgeProps) {
  const baseStyles = `
    inline-flex items-center gap-1.5 font-semibold rounded-full
    transition-all duration-200
  `
  
  const variants = {
    default: `
      bg-zinc-100 text-zinc-700
      dark:bg-zinc-800 dark:text-zinc-300
    `,
    success: `
      bg-green-100 text-green-700 ring-1 ring-inset ring-green-600/20
      dark:bg-green-950 dark:text-green-400 dark:ring-green-500/30
    `,
    warning: `
      bg-yellow-100 text-yellow-700 ring-1 ring-inset ring-yellow-600/20
      dark:bg-yellow-950 dark:text-yellow-400 dark:ring-yellow-500/30
    `,
    danger: `
      bg-red-100 text-red-700 ring-1 ring-inset ring-red-600/20
      dark:bg-red-950 dark:text-red-400 dark:ring-red-500/30
    `,
    info: `
      bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-600/20
      dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-500/30
    `,
    outline: `
      bg-transparent text-zinc-700 ring-1 ring-inset ring-zinc-300
      dark:text-zinc-300 dark:ring-zinc-700
    `
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  return (
    <span 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            variant === 'success' ? 'bg-green-500' :
            variant === 'warning' ? 'bg-yellow-500' :
            variant === 'danger' ? 'bg-red-500' :
            'bg-zinc-500'
          }`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            variant === 'success' ? 'bg-green-600' :
            variant === 'warning' ? 'bg-yellow-600' :
            variant === 'danger' ? 'bg-red-600' :
            'bg-zinc-600'
          }`}></span>
        </span>
      )}
      {children}
    </span>
  )
}
