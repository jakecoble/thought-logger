import React, { ReactElement } from "react";

export default function TypeaheadDropdown({
    value,
    onChange,
    items,
}: {
    value: string;
    onChange: (item: string) => void;
    items: string[];
}): ReactElement {
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
            />
            <ul>
                {items
                    .filter((item) => item.includes(value))
                    .map((item) => (
                        <li>{item}</li>
                    ))}
            </ul>
        </div>
    );
}
