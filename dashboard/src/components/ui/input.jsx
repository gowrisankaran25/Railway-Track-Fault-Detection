import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, style, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn("text-input", className)}
      style={{ margin: 0, height: '44px', width: '100%', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.2s', ...style }}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
