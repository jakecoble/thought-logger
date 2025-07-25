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
        <div>
            <input
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
                <ul>
                    {items
                        .filter((item) => item.includes(value))
                        .map((item) => (
                            <li>{item}</li>
                        ))}
                </ul>
            )}
        </div>
    );
}
