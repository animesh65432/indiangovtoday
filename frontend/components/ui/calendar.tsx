import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-[#f8f7f2] group/calendar p-3 [--cell-size:--spacing(8)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "flex gap-4 flex-col md:flex-row relative",
          defaultClassNames.months
        ),
        month: cn("flex flex-col w-full gap-4 text-[#2D4870]", defaultClassNames.month),
        nav: cn(
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          "text-[#2D4870] hover:bg-stone-200 hover:text-[#2D4870]",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          "text-[#2D4870] hover:bg-stone-200 hover:text-[#2D4870]",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative has-focus:border-stone-400 border border-stone-300 shadow-xs has-focus:ring-stone-300/50 has-focus:ring-[3px] rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute bg-[#f8f7f2] inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-semibold text-[#2D4870]",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-stone-400 [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-[#2D4870] rounded-md flex-1 font-medium text-[0.75rem] select-none",
          defaultClassNames.weekday
        ),
        // Remove any gap between week cells so range bg is continuous
        week: cn("flex w-full mt-1.5", defaultClassNames.week),
        week_number_header: cn(
          "select-none w-(--cell-size)",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] select-none text-[#2D4870]",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative flex-1 h-full p-0 text-center group/day aspect-square select-none",
          defaultClassNames.day
        ),
        // These outer wrappers carry the continuous background strip
        range_start: cn(
          "bg-[#fef3c7] rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "bg-[#fef3c7] rounded-none",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "bg-[#fef3c7] rounded-r-md",
          defaultClassNames.range_end
        ),
        today: cn(
          "bg-stone-200 text-[#2D4870] rounded-md font-semibold",
          // Don't let "today" background override range highlight
          "data-[selected=true]:bg-transparent",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[#2D4870] aria-selected:text-stone-400",
          defaultClassNames.outside
        ),
        disabled: cn("text-[#2D4870] opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(className)}
            {...props}
          />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left")
            return <ChevronLeftIcon className={cn("size-4 text-[#2D4870]", className)} {...props} />
          if (orientation === "right")
            return <ChevronRightIcon className={cn("size-4 text-[#2D4870]", className)} {...props} />
          return <ChevronDownIcon className={cn("size-4 text-[#2D4870]", className)} {...props} />
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => (
          <td {...props}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isRangeEndpoint = modifiers.range_start || modifiers.range_end
  const isRangeMiddle = modifiers.range_middle
  const isSingleSelected =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSingleSelected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={isRangeMiddle}
      className={cn(
        // Base layout — fill the outer day wrapper
        "flex aspect-square size-full w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
        "text-[#2D4870] text-sm",

        // Default hover
        "hover:bg-[#d8dee7] hover:text-[#2D4870]",

        // ── Single selected day ──
        "data-[selected-single=true]:bg-[#d8dee7]",
        "data-[selected-single=true]:text-[#3a4f6e]",
        "data-[selected-single=true]:font-semibold",
        "data-[selected-single=true]:rounded-md",
        "data-[selected-single=true]:hover:bg-[#d8dee7]",

        // ── Range START: yellow pill, square on right edge ──
        "data-[range-start=true]:bg-[#2D4870]",
        "data-[range-start=true]:text-[#2D4870]",
        "data-[range-start=true]:font-semibold",
        "data-[range-start=true]:rounded-l-md",
        "data-[range-start=true]:rounded-r-none",
        "data-[range-start=true]:hover:bg-[#d8dee7]",

        // ── Range MIDDLE: transparent so outer wrapper bg shows ──
        "data-[range-middle=true]:bg-[#d8dee7]",
        "data-[range-middle=true]:text-[#2D4870]",
        "data-[range-middle=true]:rounded-none",
        "data-[range-middle=true]:hover:bg-[#d8dee7]",

        // ── Range END: yellow pill, square on left edge ──
        "data-[range-end=true]:bg-[#d8dee7]",
        "data-[range-end=true]:text-[#2D4870]",
        "data-[range-end=true]:font-semibold",
        "data-[range-end=true]:rounded-r-md",
        "data-[range-end=true]:rounded-l-none",
        "data-[range-end=true]:hover:bg-[#d8dee7]",

        // Focus ring
        "group-data-[focused=true]/day:relative",
        "group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:ring-2",
        "group-data-[focused=true]/day:ring-[#d8dee7]/60",
        "group-data-[focused=true]/day:border-[#d8dee7]",

        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }