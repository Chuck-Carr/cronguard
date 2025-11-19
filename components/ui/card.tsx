import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hover?: boolean
  gradient?: boolean
}

export function Card({ className = '', children, hover = false, gradient = false, ...props }: CardProps) {
  return (
    <div 
      className={`
        bg-white dark:bg-zinc-900 rounded-2xl
        border border-zinc-200/80 dark:border-zinc-800
        transition-all duration-300 ease-out
        ${hover ? 'hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-950/50 hover:-translate-y-0.5 cursor-pointer' : 'shadow-sm'}
        ${gradient ? 'bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div className={`px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 ${className}`} {...props}>
      {children}
    </div>
  )
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function CardTitle({ className = '', children, ...props }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-bold text-zinc-900 dark:text-white tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  )
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export function CardDescription({ className = '', children, ...props }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  )
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardContent({ className = '', children, ...props }: CardContentProps) {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 rounded-b-2xl ${className}`} {...props}>
      {children}
    </div>
  )
}
