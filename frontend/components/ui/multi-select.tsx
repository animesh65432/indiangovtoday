import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
    CheckIcon,
    ChevronDown,
    XIcon,
    XCircle,
    WandSparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";

/**
 * Animation types and configurations
 */
export interface AnimationConfig {
    badgeAnimation?: "bounce" | "pulse" | "wiggle" | "fade" | "slide" | "none";
    popoverAnimation?: "scale" | "slide" | "fade" | "flip" | "none";
    optionHoverAnimation?: "highlight" | "scale" | "glow" | "none";
    duration?: number;
    delay?: number;
}

const multiSelectVariants = cva("m-1 transition-all duration-300 ease-in-out", {
    variants: {
        variant: {
            default: "border-[#FF9933]/40 text-white bg-black hover:bg-black/80",
            secondary:
                "border-[#FF9933]/40 bg-black text-white hover:bg-black/80",
            destructive:
                "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
            inverted: "inverted",
        },
        badgeAnimation: {
            bounce: "hover:-translate-y-1 hover:scale-110",
            pulse: "hover:animate-pulse",
            wiggle: "hover:animate-wiggle",
            fade: "hover:opacity-80",
            slide: "hover:translate-x-1",
            none: "",
        },
    },
    defaultVariants: {
        variant: "default",
        badgeAnimation: "bounce",
    },
});

interface MultiSelectOption {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
    style?: {
        badgeColor?: string;
        iconColor?: string;
        gradient?: string;
    };
}

interface MultiSelectGroup {
    heading: string;
    options: MultiSelectOption[];
}

interface MultiSelectProps
    extends Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        "animationConfig"
    >,
    VariantProps<typeof multiSelectVariants> {
    options: MultiSelectOption[] | MultiSelectGroup[];
    onValueChange: (value: string[]) => void;
    defaultValue?: string[];
    placeholder?: string;
    animation?: number;
    animationConfig?: AnimationConfig;
    maxCount?: number;
    modalPopover?: boolean;
    asChild?: boolean;
    className?: string;
    hideSelectAll?: boolean;
    searchable?: boolean;
    emptyIndicator?: React.ReactNode;
    autoSize?: boolean;
    singleLine?: boolean;
    popoverClassName?: string;
    disabled?: boolean;
    responsive?:
    | boolean
    | {
        mobile?: { maxCount?: number; hideIcons?: boolean; compactMode?: boolean };
        tablet?: { maxCount?: number; hideIcons?: boolean; compactMode?: boolean };
        desktop?: { maxCount?: number; hideIcons?: boolean; compactMode?: boolean };
    };
    minWidth?: string;
    maxWidth?: string;
    deduplicateOptions?: boolean;
    resetOnDefaultValueChange?: boolean;
    closeOnSelect?: boolean;
    mobile?: boolean;
}

export interface MultiSelectRef {
    reset: () => void;
    getSelectedValues: () => string[];
    setSelectedValues: (values: string[]) => void;
    clear: () => void;
    focus: () => void;
}

export const MultiSelect = React.forwardRef<MultiSelectRef, MultiSelectProps>(
    (
        {
            options,
            onValueChange,
            variant,
            defaultValue = [],
            placeholder = "Select options",
            animation = 0,
            animationConfig,
            maxCount = 2,
            modalPopover = false,
            asChild = false,
            className,
            hideSelectAll = false,
            searchable = true,
            emptyIndicator,
            autoSize = false,
            singleLine = false,
            popoverClassName,
            disabled = false,
            responsive,
            minWidth,
            maxWidth,
            deduplicateOptions = false,
            resetOnDefaultValueChange = true,
            closeOnSelect = false,
            mobile = false,
            ...props
        },
        ref
    ) => {
        const [selectedValues, setSelectedValues] =
            React.useState<string[]>(defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
        const [isAnimating, setIsAnimating] = React.useState(false);
        const [searchValue, setSearchValue] = React.useState("");

        const [politeMessage, setPoliteMessage] = React.useState("");
        const [assertiveMessage, setAssertiveMessage] = React.useState("");
        const prevSelectedCount = React.useRef(selectedValues.length);
        const prevIsOpen = React.useRef(isPopoverOpen);
        const prevSearchValue = React.useRef(searchValue);

        const announce = React.useCallback(
            (message: string, priority: "polite" | "assertive" = "polite") => {
                if (priority === "assertive") {
                    setAssertiveMessage(message);
                    setTimeout(() => setAssertiveMessage(""), 100);
                } else {
                    setPoliteMessage(message);
                    setTimeout(() => setPoliteMessage(""), 100);
                }
            },
            []
        );

        const multiSelectId = React.useId();
        const listboxId = `${multiSelectId}-listbox`;
        const triggerDescriptionId = `${multiSelectId}-description`;
        const selectedCountId = `${multiSelectId}-count`;

        const prevDefaultValueRef = React.useRef<string[]>(defaultValue);

        const isGroupedOptions = React.useCallback(
            (opts: MultiSelectOption[] | MultiSelectGroup[]): opts is MultiSelectGroup[] => {
                return opts.length > 0 && "heading" in opts[0];
            },
            []
        );

        const arraysEqual = React.useCallback(
            (a: string[], b: string[]): boolean => {
                if (a.length !== b.length) return false;
                const sortedA = [...a].sort();
                const sortedB = [...b].sort();
                return sortedA.every((val, index) => val === sortedB[index]);
            },
            []
        );

        const resetToDefault = React.useCallback(() => {
            setSelectedValues(defaultValue);
            setIsPopoverOpen(false);
            setSearchValue("");
            onValueChange(defaultValue);
        }, [defaultValue, onValueChange]);

        const buttonRef = React.useRef<HTMLButtonElement>(null);

        React.useImperativeHandle(
            ref,
            () => ({
                reset: resetToDefault,
                getSelectedValues: () => selectedValues,
                setSelectedValues: (values: string[]) => {
                    setSelectedValues(values);
                    onValueChange(values);
                },
                clear: () => {
                    setSelectedValues([]);
                    onValueChange([]);
                },
                focus: () => {
                    if (buttonRef.current) {
                        buttonRef.current.focus();
                        const originalOutline = buttonRef.current.style.outline;
                        const originalOutlineOffset = buttonRef.current.style.outlineOffset;
                        buttonRef.current.style.outline = "2px solid #FF9933";
                        buttonRef.current.style.outlineOffset = "2px";
                        setTimeout(() => {
                            if (buttonRef.current) {
                                buttonRef.current.style.outline = originalOutline;
                                buttonRef.current.style.outlineOffset = originalOutlineOffset;
                            }
                        }, 1000);
                    }
                },
            }),
            [resetToDefault, selectedValues, onValueChange]
        );

        const [screenSize, setScreenSize] = React.useState<"mobile" | "tablet" | "desktop">("desktop");

        React.useEffect(() => {
            if (typeof window === "undefined") return;
            const handleResize = () => {
                const width = window.innerWidth;
                if (width < 640) setScreenSize("mobile");
                else if (width < 1024) setScreenSize("tablet");
                else setScreenSize("desktop");
            };
            handleResize();
            window.addEventListener("resize", handleResize);
            return () => {
                if (typeof window !== "undefined") window.removeEventListener("resize", handleResize);
            };
        }, []);

        const getResponsiveSettings = () => {
            if (!responsive) return { maxCount, hideIcons: false, compactMode: false };
            if (responsive === true) {
                const defaultResponsive = {
                    mobile: { maxCount: 2, hideIcons: false, compactMode: true },
                    tablet: { maxCount: 4, hideIcons: false, compactMode: false },
                    desktop: { maxCount: 6, hideIcons: false, compactMode: false },
                };
                const s = defaultResponsive[screenSize];
                return { maxCount: s?.maxCount ?? maxCount, hideIcons: s?.hideIcons ?? false, compactMode: s?.compactMode ?? false };
            }
            const s = responsive[screenSize];
            return { maxCount: s?.maxCount ?? maxCount, hideIcons: s?.hideIcons ?? false, compactMode: s?.compactMode ?? false };
        };

        const responsiveSettings = getResponsiveSettings();

        const getBadgeAnimationClass = () => {
            if (animationConfig?.badgeAnimation) {
                switch (animationConfig.badgeAnimation) {
                    case "bounce": return isAnimating ? "animate-bounce" : "hover:-translate-y-1 hover:scale-110";
                    case "pulse": return "hover:animate-pulse";
                    case "wiggle": return "hover:animate-wiggle";
                    case "fade": return "hover:opacity-80";
                    case "slide": return "hover:translate-x-1";
                    case "none": return "";
                    default: return "";
                }
            }
            return isAnimating ? "animate-bounce" : "";
        };

        const getPopoverAnimationClass = () => {
            if (animationConfig?.popoverAnimation) {
                switch (animationConfig.popoverAnimation) {
                    case "scale": return "animate-scaleIn";
                    case "slide": return "animate-slideInDown";
                    case "fade": return "animate-fadeIn";
                    case "flip": return "animate-flipIn";
                    case "none": return "";
                    default: return "";
                }
            }
            return "";
        };

        const getAllOptions = React.useCallback((): MultiSelectOption[] => {
            if (options.length === 0) return [];
            let allOptions: MultiSelectOption[];
            if (isGroupedOptions(options)) {
                allOptions = options.flatMap((group) => group.options);
            } else {
                allOptions = options;
            }
            const valueSet = new Set<string>();
            const duplicates: string[] = [];
            const uniqueOptions: MultiSelectOption[] = [];
            allOptions.forEach((option) => {
                if (valueSet.has(option.value)) {
                    duplicates.push(option.value);
                    if (!deduplicateOptions) uniqueOptions.push(option);
                } else {
                    valueSet.add(option.value);
                    uniqueOptions.push(option);
                }
            });
            if (process.env.NODE_ENV === "development" && duplicates.length > 0) {
                const action = deduplicateOptions ? "automatically removed" : "detected";
                console.warn(
                    `MultiSelect: Duplicate option values ${action}: ${duplicates.join(", ")}. ` +
                    `${deduplicateOptions
                        ? "Duplicates have been removed automatically."
                        : "This may cause unexpected behavior. Consider setting 'deduplicateOptions={true}' or ensure all option values are unique."
                    }`
                );
            }
            return deduplicateOptions ? uniqueOptions : allOptions;
        }, [options, deduplicateOptions, isGroupedOptions]);

        const getOptionByValue = React.useCallback(
            (value: string): MultiSelectOption | undefined => {
                const option = getAllOptions().find((o) => o.value === value);
                if (!option && process.env.NODE_ENV === "development") {
                    console.warn(`MultiSelect: Option with value "${value}" not found in options list`);
                }
                return option;
            },
            [getAllOptions]
        );

        const filteredOptions = React.useMemo(() => {
            if (!searchable || !searchValue) return options;
            if (options.length === 0) return [];
            if (isGroupedOptions(options)) {
                return options
                    .map((group) => ({
                        ...group,
                        options: group.options.filter(
                            (option) =>
                                option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
                                option.value.toLowerCase().includes(searchValue.toLowerCase())
                        ),
                    }))
                    .filter((group) => group.options.length > 0);
            }
            return options.filter(
                (option) =>
                    option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
                    option.value.toLowerCase().includes(searchValue.toLowerCase())
            );
        }, [options, searchValue, searchable, isGroupedOptions]);

        const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                setIsPopoverOpen(true);
            } else if (event.key === "Backspace" && !event.currentTarget.value) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                setSelectedValues(newSelectedValues);
                onValueChange(newSelectedValues);
            }
        };

        const toggleOption = (optionValue: string) => {
            if (disabled) return;
            const option = getOptionByValue(optionValue);
            if (option?.disabled) return;
            const newSelectedValues = selectedValues.includes(optionValue)
                ? selectedValues.filter((v) => v !== optionValue)
                : [...selectedValues, optionValue];
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
            if (closeOnSelect) setIsPopoverOpen(false);
        };

        const handleClear = () => {
            if (disabled) return;
            setSelectedValues([]);
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            if (disabled) return;
            setIsPopoverOpen((prev) => !prev);
        };

        const clearExtraOptions = () => {
            if (disabled) return;
            const newSelectedValues = selectedValues.slice(0, responsiveSettings.maxCount);
            setSelectedValues(newSelectedValues);
            onValueChange(newSelectedValues);
        };

        const toggleAll = () => {
            if (disabled) return;
            const allOptions = getAllOptions().filter((o) => !o.disabled);
            if (selectedValues.length === allOptions.length) {
                handleClear();
            } else {
                const allValues = allOptions.map((o) => o.value);
                setSelectedValues(allValues);
                onValueChange(allValues);
            }
            if (closeOnSelect) setIsPopoverOpen(false);
        };

        React.useEffect(() => {
            if (!resetOnDefaultValueChange) return;
            const prevDefaultValue = prevDefaultValueRef.current;
            if (!arraysEqual(prevDefaultValue, defaultValue)) {
                if (!arraysEqual(selectedValues, defaultValue)) setSelectedValues(defaultValue);
                prevDefaultValueRef.current = [...defaultValue];
            }
        }, [defaultValue, selectedValues, arraysEqual, resetOnDefaultValueChange]);

        const getWidthConstraints = () => {
            const defaultMinWidth = screenSize === "mobile" ? "0px" : "200px";
            return {
                minWidth: minWidth || defaultMinWidth,
                maxWidth: maxWidth || "100%",
                width: autoSize ? "auto" : "100%",
            };
        };

        const widthConstraints = getWidthConstraints();

        React.useEffect(() => {
            if (!isPopoverOpen) setSearchValue("");
        }, [isPopoverOpen]);

        React.useEffect(() => {
            const selectedCount = selectedValues.length;
            const allOptions = getAllOptions();
            const totalOptions = allOptions.filter((opt) => !opt.disabled).length;
            if (selectedCount !== prevSelectedCount.current) {
                const diff = selectedCount - prevSelectedCount.current;
                if (diff > 0) {
                    const addedLabels = selectedValues
                        .slice(-diff)
                        .map((v) => allOptions.find((opt) => opt.value === v)?.label)
                        .filter(Boolean);
                    if (addedLabels.length === 1) {
                        announce(`${addedLabels[0]} selected. ${selectedCount} of ${totalOptions} options selected.`);
                    } else {
                        announce(`${addedLabels.length} options selected. ${selectedCount} of ${totalOptions} total selected.`);
                    }
                } else if (diff < 0) {
                    announce(`Option removed. ${selectedCount} of ${totalOptions} options selected.`);
                }
                prevSelectedCount.current = selectedCount;
            }
            if (isPopoverOpen !== prevIsOpen.current) {
                if (isPopoverOpen) announce(`Dropdown opened. ${totalOptions} options available. Use arrow keys to navigate.`);
                else announce("Dropdown closed.");
                prevIsOpen.current = isPopoverOpen;
            }
            if (searchValue !== prevSearchValue.current && searchValue !== undefined) {
                if (searchValue && isPopoverOpen) {
                    const filteredCount = allOptions.filter(
                        (opt) =>
                            opt.label.toLowerCase().includes(searchValue.toLowerCase()) ||
                            opt.value.toLowerCase().includes(searchValue.toLowerCase())
                    ).length;
                    announce(`${filteredCount} option${filteredCount === 1 ? "" : "s"} found for "${searchValue}"`);
                }
                prevSearchValue.current = searchValue;
            }
        }, [selectedValues, isPopoverOpen, searchValue, announce, getAllOptions]);

        return (
            <>
                <div className="sr-only">
                    <div aria-live="polite" aria-atomic="true" role="status">{politeMessage}</div>
                    <div aria-live="assertive" aria-atomic="true" role="alert">{assertiveMessage}</div>
                </div>

                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
                    <div id={triggerDescriptionId} className="sr-only">
                        Multi-select dropdown. Use arrow keys to navigate, Enter to select, and Escape to close.
                    </div>
                    <div id={selectedCountId} className="sr-only" aria-live="polite">
                        {selectedValues.length === 0
                            ? "No options selected"
                            : `${selectedValues.length} option${selectedValues.length === 1 ? "" : "s"} selected: ${selectedValues
                                .map((v) => getOptionByValue(v)?.label)
                                .filter(Boolean)
                                .join(", ")}`}
                    </div>

                    <PopoverTrigger asChild>
                        <Button
                            ref={buttonRef}
                            {...props}
                            onClick={handleTogglePopover}
                            disabled={disabled}
                            role="combobox"
                            aria-expanded={isPopoverOpen}
                            aria-haspopup="listbox"
                            aria-controls={isPopoverOpen ? listboxId : undefined}
                            aria-describedby={`${triggerDescriptionId} ${selectedCountId}`}
                            aria-label={`Multi-select: ${selectedValues.length} of ${getAllOptions().length} options selected. ${placeholder}`}
                            className={cn(
                                // ── KEY CHANGE: black bg, saffron border, saffron text ──
                                "flex p-1 rounded-md border border-[#FF9933] min-h-10 h-auto items-center justify-between",
                                "bg-[#1A1A1A]  text-white",
                                "[&_svg]:pointer-events-auto",
                                autoSize ? "w-auto" : "w-full",
                                responsiveSettings.compactMode && "min-h-8 text-sm",
                                screenSize === "mobile" && "min-h-12 text-base",
                                disabled && "opacity-50 cursor-not-allowed",
                                className
                            )}
                            style={{ ...widthConstraints, maxWidth: `min(${widthConstraints.maxWidth}, 100%)` }}>
                            {selectedValues.length > 0 ? (
                                <div className="flex justify-between items-center w-full">
                                    <div
                                        className={cn(
                                            "flex items-center gap-1",
                                            singleLine ? "overflow-x-auto multiselect-singleline-scroll" : "flex-wrap",
                                            responsiveSettings.compactMode && "gap-0.5"
                                        )}
                                        style={singleLine ? { paddingBottom: "4px" } : {}}>
                                        {selectedValues
                                            .slice(0, responsiveSettings.maxCount)
                                            .map((value) => {
                                                const option = getOptionByValue(value);
                                                const IconComponent = option?.icon;
                                                const customStyle = option?.style;
                                                if (!option) return null;
                                                const badgeStyle: React.CSSProperties = {
                                                    animationDuration: `${animation}s`,
                                                    ...(customStyle?.badgeColor && { backgroundColor: customStyle.badgeColor }),
                                                    ...(customStyle?.gradient && { background: customStyle.gradient, color: "white" }),
                                                };
                                                return (
                                                    <Badge
                                                        key={value}
                                                        className={cn(
                                                            getBadgeAnimationClass(),
                                                            multiSelectVariants({ variant }),
                                                            // badge: black bg, saffron border + text
                                                            "bg-[#1A1A1A]  border border-[#FF9933] text-white py-1",
                                                            responsiveSettings.compactMode && "text-xs px-1.5",
                                                            screenSize === "mobile" && "max-w-[120px] truncate",
                                                            singleLine && "flex-shrink-0 whitespace-nowrap",
                                                            "[&>svg]:pointer-events-auto"
                                                        )}
                                                        style={{
                                                            ...badgeStyle,
                                                            animationDuration: `${animationConfig?.duration || animation}s`,
                                                            animationDelay: `${animationConfig?.delay || 0}s`,
                                                        }}>
                                                        {IconComponent && !responsiveSettings.hideIcons && (
                                                            <IconComponent
                                                                className={cn(
                                                                    "h-4 w-4 mr-2 text-[#FF9933]",
                                                                    responsiveSettings.compactMode && "h-3 w-3 mr-1",
                                                                )}
                                                                {...(customStyle?.iconColor && { style: { color: customStyle.iconColor } })}
                                                            />
                                                        )}
                                                        <span className={cn(screenSize === "mobile" && "truncate")}>
                                                            {option.label}
                                                        </span>
                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={(event) => { event.stopPropagation(); toggleOption(value); }}
                                                            onKeyDown={(event) => {
                                                                if (event.key === "Enter" || event.key === " ") {
                                                                    event.preventDefault();
                                                                    event.stopPropagation();
                                                                    toggleOption(value);
                                                                }
                                                            }}
                                                            aria-label={`Remove ${option.label} from selection`}
                                                            className="ml-2 h-4 w-4 cursor-pointer hover:bg-[#FF9933]/20 rounded-sm p-0.5 -m-0.5 focus:outline-none focus:ring-1 focus:ring-[#FF9933]/50">
                                                            <XCircle className={cn("h-3 w-3 text-[#FF9933]", responsiveSettings.compactMode && "h-2.5 w-2.5")} />
                                                        </div>
                                                    </Badge>
                                                );
                                            })
                                            .filter(Boolean)}
                                        {selectedValues.length > responsiveSettings.maxCount && (
                                            <Badge
                                                className={cn(
                                                    "bg-[#1A1A1A]  border border-[#FF9933] text-white flex items-center py-1",
                                                    getBadgeAnimationClass(),
                                                    responsiveSettings.compactMode && "text-xs px-2",
                                                    singleLine && "flex-shrink-0 whitespace-nowrap",
                                                    "[&>svg]:pointer-events-auto"
                                                )}
                                                style={{
                                                    animationDuration: `${animationConfig?.duration || animation}s`,
                                                    animationDelay: `${animationConfig?.delay || 0}s`,
                                                }}>
                                                {`+ ${selectedValues.length - responsiveSettings.maxCount} more`}
                                                <XCircle
                                                    className={cn("ml-2 h-4 w-4 cursor-pointer text-[#FF9933]", responsiveSettings.compactMode && "ml-1 h-3 w-3")}
                                                    onClick={(event) => { event.stopPropagation(); clearExtraOptions(); }}
                                                />
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={(event) => { event.stopPropagation(); handleClear(); }}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    handleClear();
                                                }
                                            }}
                                            aria-label={`Clear all ${selectedValues.length} selected options`}
                                            className="flex items-center justify-center h-4 w-4 mx-2 cursor-pointer text-[#FF9933] hover:text-[#FF9933]/70 focus:outline-none focus:ring-2 focus:ring-[#FF9933] focus:ring-offset-1 rounded-sm">
                                            <XIcon className="h-4 w-4 text-[#FF9933]" />
                                        </div>
                                        <Separator orientation="vertical" className="flex min-h-6 h-full bg-[#FF9933]" />
                                        <ChevronDown className="h-4 mx-2 text-[#FF9933] cursor-pointer" aria-hidden="true" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full mx-auto">
                                    {/* placeholder in saffron */}
                                    <span className="text-sm text-white/50 mx-3">{placeholder}</span>
                                    <ChevronDown className="h-4 cursor-pointer text-[#FF9933] mx-2" />
                                </div>
                            )}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent
                        id={listboxId}
                        role="listbox"
                        aria-multiselectable="true"
                        aria-label="Available options"
                        className={cn(
                            // popover: black bg, saffron border, saffron text
                            "w-auto p-0 font-satoshi multiselect-popover",
                            "bg-[#1A1A1A]  z-[999] border border-[#FF9933] text-[#FF9933]",
                            getPopoverAnimationClass(),
                            screenSize === "mobile" && "w-[85vw] max-w-[280px]",
                            screenSize === "tablet" && "w-[70vw] max-w-md",
                            screenSize === "desktop" && "min-w-[100px]",
                            popoverClassName
                        )}
                        style={{
                            animationDuration: `${animationConfig?.duration || animation}s`,
                            animationDelay: `${animationConfig?.delay || 0}s`,
                            maxWidth: `min(${widthConstraints.maxWidth}, 85vw)`,
                            maxHeight: screenSize === "mobile" ? "70vh" : "60vh",
                            touchAction: "manipulation",
                            // cascade white text into all shadcn children
                            color: "white",
                        }}
                        align="start"
                        onEscapeKeyDown={() => setIsPopoverOpen(false)}>
                        <Command className="bg-[#1A1A1A]  text-white [&_[cmdk-input]]:text-white [&_[cmdk-input]::placeholder]:text-white/50 [&_[cmdk-item]]:text-white [&_[cmdk-group-heading]]:text-white/50 [&_[cmdk-item][aria-selected=true]]:bg-[#FF9933]/10 [&_[cmdk-item]:hover]:bg-[#FF9933]/10">
                            {searchable && (
                                <CommandInput
                                    placeholder="Search options..."
                                    onKeyDown={handleInputKeyDown}
                                    value={searchValue}
                                    onValueChange={setSearchValue}
                                    aria-label="Search through available options"
                                    aria-describedby={`${multiSelectId}-search-help`}
                                    className="text-white placeholder:text-white/50 border-b border-[#FF9933]/30"
                                />
                            )}
                            {searchable && (
                                <div id={`${multiSelectId}-search-help`} className="sr-only">
                                    Type to filter options. Use arrow keys to navigate results.
                                </div>
                            )}
                            <CommandList
                                className={cn(
                                    "max-h-[40vh] overflow-y-auto multiselect-scrollbar",
                                    screenSize === "mobile" && "max-h-[50vh]",
                                    "overscroll-behavior-y-contain"
                                )}>
                                <CommandEmpty className="text-white/50 py-4 text-center text-sm">
                                    {emptyIndicator || "No results found."}
                                </CommandEmpty>
                                {!hideSelectAll && !searchValue && (
                                    <CommandGroup>
                                        <CommandItem
                                            key="all"
                                            onSelect={toggleAll}
                                            role="option"
                                            aria-selected={
                                                selectedValues.length === getAllOptions().filter((opt) => !opt.disabled).length
                                            }
                                            aria-label={`Select all ${getAllOptions().length} options`}
                                            className="cursor-pointer text-white hover:bg-[#FF9933]/10 data-[selected=true]:bg-[#FF9933]/10">
                                            <div
                                                className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-[#FF9933]",
                                                    selectedValues.length === getAllOptions().filter((opt) => !opt.disabled).length
                                                        ? "bg-[#FF9933] text-black"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}
                                                aria-hidden="true">
                                                <CheckIcon className="h-4 w-4 text-black" />
                                            </div>
                                            <span>
                                                (Select All{getAllOptions().length > 20 ? ` - ${getAllOptions().length} options` : ""})
                                            </span>
                                        </CommandItem>
                                    </CommandGroup>
                                )}
                                {isGroupedOptions(filteredOptions) ? (
                                    filteredOptions.map((group) => (
                                        <CommandGroup key={group.heading} heading={group.heading} className="[&_[cmdk-group-heading]]:text-white/50">
                                            {group.options.map((option) => {
                                                const isSelected = selectedValues.includes(option.value);
                                                return (
                                                    <CommandItem
                                                        key={option.value}
                                                        onSelect={() => toggleOption(option.value)}
                                                        role="option"
                                                        aria-selected={isSelected}
                                                        aria-disabled={option.disabled}
                                                        aria-label={`${option.label}${isSelected ? ", selected" : ", not selected"}${option.disabled ? ", disabled" : ""}`}
                                                        className={cn(
                                                            "cursor-pointer text-white hover:bg-[#FF9933]/10 data-[selected=true]:bg-[#FF9933]/10",
                                                            option.disabled && "opacity-50 cursor-not-allowed"
                                                        )}
                                                        disabled={option.disabled}>
                                                        <div
                                                            className={cn(
                                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-[#FF9933]",
                                                                isSelected ? "bg-[#FF9933] text-black" : "opacity-50 [&_svg]:invisible"
                                                            )}
                                                            aria-hidden="true">
                                                            <CheckIcon className="h-4 w-4 text-black" />
                                                        </div>
                                                        {option.icon && (
                                                            <option.icon className="mr-2 h-4 w-4 text-white" aria-hidden="true" />
                                                        )}
                                                        <span>{option.label}</span>
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                    ))
                                ) : (
                                    <CommandGroup>
                                        {(filteredOptions as MultiSelectOption[]).map((option) => {
                                            const isSelected = selectedValues.includes(option.value);
                                            return (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => toggleOption(option.value)}
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    aria-disabled={option.disabled}
                                                    aria-label={`${option.label}${isSelected ? ", selected" : ", not selected"}${option.disabled ? ", disabled" : ""}`}
                                                    className={cn(
                                                        "cursor-pointer text-white hover:bg-[#FF9933]/10 data-[selected=true]:bg-[#FF9933]/10",
                                                        option.disabled && "opacity-50 cursor-not-allowed"
                                                    )}
                                                    disabled={option.disabled}>
                                                    <div
                                                        className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-[#FF9933]",
                                                            isSelected ? "bg-[#FF9933] text-black" : "opacity-50 [&_svg]:invisible"
                                                        )}
                                                        aria-hidden="true">
                                                        <CheckIcon className="h-4 w-4 text-black" />
                                                    </div>
                                                    {option.icon && (
                                                        <option.icon className="mr-2 h-4 w-4 text-white" aria-hidden="true" />
                                                    )}
                                                    <span>{option.label}</span>
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                )}
                                <CommandSeparator className="bg-[#FF9933]" />
                                <CommandGroup>
                                    <div className="flex items-center justify-between">
                                        {selectedValues.length > 0 && (
                                            <>
                                                <CommandItem
                                                    onSelect={handleClear}
                                                    className="flex-1 justify-center cursor-pointer text-white hover:bg-[#FF9933]/10">
                                                    Clear
                                                </CommandItem>
                                                <Separator orientation="vertical" className="flex min-h-6 h-full bg-[#FF9933]" />
                                            </>
                                        )}
                                        <CommandItem
                                            onSelect={() => setIsPopoverOpen(false)}
                                            className="flex-1 justify-center cursor-pointer text-white hover:bg-[#FF9933]/10 max-w-full">
                                            Close
                                        </CommandItem>
                                    </div>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>

                    {animation > 0 && selectedValues.length > 0 && (
                        <WandSparkles
                            className={cn(
                                "cursor-pointer my-2 w-3 h-3 text-[#FF9933]",
                                isAnimating ? "" : "text-[#FF9933]/50"
                            )}
                            onClick={() => setIsAnimating(!isAnimating)}
                        />
                    )}
                </Popover>
            </>
        );
    }
);

MultiSelect.displayName = "MultiSelect";
export type { MultiSelectOption, MultiSelectGroup, MultiSelectProps };