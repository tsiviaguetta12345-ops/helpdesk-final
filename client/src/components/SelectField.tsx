import { Select } from "radix-ui";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

interface SelectFieldProps<T extends string> {
    label: string;
    value: T | "";
    options: readonly T[];
    onChange: (value: T) => void;
    placeholder?: string;
    error?: string;
    optionLabel?: (option: T) => string;
}

// Radix Select with a typed value: onChange only receives one of the options.
export default function SelectField<T extends string>({
    label, value, options, onChange, placeholder = "Choose...", error, optionLabel
}: SelectFieldProps<T>) {
    const handleChange = (selected: string) => {
        const option = options.find((item) => item === selected);
        if (option !== undefined) {
            onChange(option);
        }
    };

    return (
        <div className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            <span>{label}</span>
            <Select.Root value={value === "" ? undefined : value} onValueChange={handleChange}>
                <Select.Trigger
                    aria-label={label}
                    className={`flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-left text-slate-900 outline-none focus:border-violet-500 ${error ? "border-red-400" : "border-slate-300"}`}
                >
                    <Select.Value placeholder={<span className="text-slate-400">{placeholder}</span>} />
                    <Select.Icon>
                        <ChevronDownIcon />
                    </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content position="popper" sideOffset={4} className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                        <Select.Viewport className="p-1">
                            {options.map((option) => (
                                <Select.Item
                                    key={option}
                                    value={option}
                                    className="relative flex cursor-pointer select-none items-center rounded-md py-2 pl-7 pr-3 text-sm text-slate-800 outline-none data-[highlighted]:bg-violet-50 data-[highlighted]:text-violet-700"
                                >
                                    <Select.ItemIndicator className="absolute left-2">
                                        <CheckIcon />
                                    </Select.ItemIndicator>
                                    <Select.ItemText>{optionLabel ? optionLabel(option) : option}</Select.ItemText>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
            {error !== undefined && <span className="text-xs font-normal text-red-600">{error}</span>}
        </div>
    );
}
