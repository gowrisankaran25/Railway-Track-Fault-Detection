import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ className, children, style, ...props }, ref) => (
  <div style={{ position: 'relative', display: 'inline-block', minWidth: '150px' }}>
    <select
      ref={ref}
      className={cn("text-input", className)}
      style={{ margin: 0, height: '44px', cursor: 'pointer', paddingRight: '32px', appearance: 'auto', ...style }}
      {...props}
    >
      {children}
    </select>
  </div>
))
Select.displayName = "Select"

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <option ref={ref} className={cn(className)} {...props}>
    {children}
  </option>
))
SelectItem.displayName = "SelectItem"

export { Select, SelectItem }
