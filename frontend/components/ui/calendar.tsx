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
        "group/calendar p-3 [--cell-size:--spacing(8)]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        "rounded-md border border-[#FF9933]",
        className
      )}
      style={{ backgroundColor: "#1A1A1A" }}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn(defaultClassNames.root, "w-fit"),
        months: cn(
          defaultClassNames.months,
          "flex gap-4 flex-col md:flex-row relative"
        ),
        month: cn(
          defaultClassNames.month,
          "flex flex-col w-full gap-4"
        ),
        nav: cn(
          defaultClassNames.nav,
          "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between"
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          defaultClassNames.button_previous,
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          "!text-[#FF9933] !bg-transparent hover:!bg-[#FF9933]/10"
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          defaultClassNames.button_next,
          "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
          "!text-[#FF9933] !bg-transparent hover:!bg-[#FF9933]/10"
        ),
        month_caption: cn(
          defaultClassNames.month_caption,
          "flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)"
        ),
        dropdowns: cn(
          defaultClassNames.dropdowns,
          "w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5"
        ),
        dropdown_root: cn(
          defaultClassNames.dropdown_root,
          "relative border border-[#FF9933]/40 rounded-md has-focus:border-[#FF9933] has-focus:ring-[#FF9933]/30 has-focus:ring-[3px]"
        ),
        dropdown: cn(
          defaultClassNames.dropdown,
          "absolute inset-0 opacity-0"
        ),
        caption_label: cn(
          defaultClassNames.caption_label,
          "select-none font-semibold !text-white",
          captionLayout === "label"
            ? "text-sm"
            : "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:!text-[#FF9933] [&>svg]:size-3.5"
        ),
        table: "w-full border-collapse",
        weekdays: cn(defaultClassNames.weekdays, "flex"),
        weekday: cn(
          defaultClassNames.weekday,
          "!text-white/50 rounded-md flex-1 font-medium text-[0.75rem] select-none"
        ),
        week: cn(defaultClassNames.week, "flex w-full mt-1.5"),
        week_number_header: cn(
          defaultClassNames.week_number_header,
          "select-none w-(--cell-size)"
        ),
        week_number: cn(
          defaultClassNames.week_number,
          "text-[0.8rem] select-none !text-white/40"
        ),
        day: cn(
          defaultClassNames.day,
          "relative flex-1 h-full p-0 text-center group/day aspect-square select-none"
        ),
        range_start: cn(
          defaultClassNames.range_start,
          "!bg-[#FF9933]/20 rounded-l-md"
        ),
        range_middle: cn(
          defaultClassNames.range_middle,
          "!bg-[#FF9933]/20 rounded-none"
        ),
        range_end: cn(
          defaultClassNames.range_end,
          "!bg-[#FF9933]/20 rounded-r-md"
        ),
        today: cn(
          defaultClassNames.today,
          "ring-1 ring-[#FF9933]/60 !bg-transparent !text-white rounded-md font-semibold",
          "data-[selected=true]:ring-0"
        ),
        outside: cn(
          defaultClassNames.outside,
          "!text-white/25 aria-selected:!text-white/15"
        ),
        disabled: cn(defaultClassNames.disabled, "!text-white/20"),
        hidden: cn(defaultClassNames.hidden, "invisible"),
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
            return <ChevronLeftIcon className={cn("size-4 !text-[#FF9933]", className)} {...props} />
          if (orientation === "right")
            return <ChevronRightIcon className={cn("size-4 !text-[#FF9933]", className)} {...props} />
          return <ChevronDownIcon className={cn("size-4 !text-[#FF9933]", className)} {...props} />
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
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-full w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
        "!text-white text-sm !bg-transparent",

        // Default hover
        "hover:!bg-[#FF9933]/15 hover:!text-white",

        // Single selected — solid saffron pill
        "data-[selected-single=true]:!bg-[#FF9933]",
        "data-[selected-single=true]:!text-black",
        "data-[selected-single=true]:font-semibold",
        "data-[selected-single=true]:rounded-md",
        "data-[selected-single=true]:hover:!bg-[#FF9933]/90",

        // Range START
        "data-[range-start=true]:!bg-[#FF9933]",
        "data-[range-start=true]:!text-black",
        "data-[range-start=true]:font-semibold",
        "data-[range-start=true]:rounded-l-md",
        "data-[range-start=true]:!rounded-r-none",
        "data-[range-start=true]:hover:!bg-[#FF9933]/90",

        // Range MIDDLE
        "data-[range-middle=true]:!bg-[#FF9933]/20",
        "data-[range-middle=true]:!text-white",
        "data-[range-middle=true]:!rounded-none",
        "data-[range-middle=true]:hover:!bg-[#FF9933]/30",

        // Range END
        "data-[range-end=true]:!bg-[#FF9933]",
        "data-[range-end=true]:!text-black",
        "data-[range-end=true]:font-semibold",
        "data-[range-end=true]:!rounded-r-md",
        "data-[range-end=true]:!rounded-l-none",
        "data-[range-end=true]:hover:!bg-[#FF9933]/90",

        // Focus ring — saffron only
        "group-data-[focused=true]/day:relative",
        "group-data-[focused=true]/day:z-10",
        "group-data-[focused=true]/day:ring-2",
        "group-data-[focused=true]/day:!ring-[#FF9933]/60",

        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }