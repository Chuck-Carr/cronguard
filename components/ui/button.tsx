import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold rounded-xl
      transition-all duration-200 ease-out
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      active:scale-[0.98] transform
    `
    
    const variants = {
      primary: `
        bg-gradient-to-br from-blue-600 to-blue-700 text-white
        hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/30
        focus-visible:ring-blue-500
      `,
      secondary: `
        bg-zinc-100 text-zinc-900 
        hover:bg-zinc-200 hover:shadow-md
        focus-visible:ring-zinc-500
        dark:bg-zinc-800 dark:text-zinc-100
        dark:hover:bg-zinc-700
      `,
      outline: `
        border-2 border-zinc-200 text-zinc-700 bg-transparent
        hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm
        focus-visible:ring-zinc-500
        dark:border-zinc-700 dark:text-zinc-300
        dark:hover:bg-zinc-800 dark:hover:border-zinc-600
      `,
      ghost: `
        text-zinc-700 bg-transparent
        hover:bg-zinc-100 hover:text-zinc-900
        focus-visible:ring-zinc-500
        dark:text-zinc-300
        dark:hover:bg-zinc-800 dark:hover:text-zinc-100
      `,
      danger: `
        bg-gradient-to-br from-red-600 to-red-700 text-white
        hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/30
        focus-visible:ring-red-500
      `,
      success: `
        bg-gradient-to-br from-green-600 to-green-700 text-white
        hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:shadow-green-500/30
        focus-visible:ring-green-500
      `
    }
    
    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs gap-1',
      sm: 'px-3 py-2 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-2.5'
    }
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
