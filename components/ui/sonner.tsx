import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-500" />,
        info: <InfoIcon className="size-5 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,
        error: <OctagonXIcon className="size-5 text-red-500" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white/70 group-[.toaster]:dark:bg-black/50 group-[.toaster]:backdrop-blur-2xl group-[.toaster]:border-white/40 group-[.toaster]:dark:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:text-black group-[.toaster]:dark:text-white group-[.toaster]:rounded-2xl font-semibold px-4 py-3 gap-3 text-[14px]",
          description: "group-[.toast]:text-black/70 group-[.toast]:dark:text-white/70 font-medium",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-bold",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
