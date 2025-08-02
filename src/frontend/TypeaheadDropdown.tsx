import React, { ReactElement, useState } from "react";

export default function TypeaheadDropdown({
    value,
    onChange,
    items,
}: {
    value: string;
    onChange: (item: string) => void;
    items: string[];
}): ReactElement {
    const [focused, setFocused] = useState<boolean>(false);
    return (
        <div className="inline-block relative w-fit">
            <input
                className="border-2 rounded p-2"
                value={value}
                onChange={(e) => {
                    onChange(e.currentTarget.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Tab") {
                        e.preventDefault();
                        onChange(items.find((item) => item.includes(value)));
                    }
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {focused && (
                <ul className="absolute left-0 bg-slate-50 border-2 rounded w-full">
                    {items
                        .filter((item) => item.includes(value))
                        .map((item) => (
                            <li className="p-2 first:bg-sky-200 w-full">
                                {item}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
}
