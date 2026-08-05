import * as React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext({})

const Tabs = React.forwardRef(({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = (newValue) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, children, style, ...props }, ref) => (
  <div
    ref={ref}
    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px', gap: '8px', ...style }}
    className={className}
    {...props}
  >
    {children}
  </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { value: currentValue, onValueChange } = React.useContext(TabsContext)
  const isActive = currentValue === value

  return (
    <button
      ref={ref}
      type="button"
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', borderRadius: '6px', padding: '8px 16px', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.2s', background: isActive ? 'var(--accent)' : 'transparent', color: isActive ? 'white' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', ...props.style }}
      className={className}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { value: currentValue } = React.useContext(TabsContext)
  const isActive = currentValue === value

  if (!isActive) return null

  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
