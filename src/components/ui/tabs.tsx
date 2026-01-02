import * as React from "react"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

export interface TabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value: controlledValue, defaultValue, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')
  
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue
  
  const handleValueChange = React.useCallback((newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }, [isControlled, onValueChange])
  
  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}>
      {children}
    </div>
  )
}

export interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value: triggerValue, children, className = '' }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs')
  }
  
  const { value, onValueChange } = context
  const isActive = value === triggerValue
  
  return (
    <button
      type="button"
      role="tab"
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : ''
      } ${className}`}
      onClick={() => onValueChange(triggerValue)}
      data-state={isActive ? 'active' : 'inactive'}
      aria-selected={isActive}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({ value: contentValue, children, className = '' }: TabsContentProps) {
  const context = React.useContext(TabsContext)
  
  if (!context) {
    throw new Error('TabsContent must be used within Tabs')
  }
  
  const { value } = context
  
  if (value !== contentValue) {
    return null
  }
  
  return (
    <div
      role="tabpanel"
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      data-state="active"
    >
      {children}
    </div>
  )
}