import React, { ReactElement, useState } from "react";

function getFirstMatch(haystack: string[], needle: string): string {
    return w;
}

export default function TypeaheadDropdown({
    initial,
    onChange,
    items,
}: {
    initial: string;
    onChange: (item: string) => void;
    items: string[];
}): ReactElement {
    const [input, setInput] = useState<string>(initial);
    return (
        <div>
            <input
                value={input}
                onChange={(e) => {
                    setInput(e.currentTarget.value);
                    onChange(
                        items.find((item) =>
                            item.includes(e.currentTarget.value),
                        ),
                    );
                }}
            />
            <ul>
                {items
                    .filter((item) => item.includes(input))
                    .map((item) => (
                        <li>{item}</li>
                    ))}
            </ul>
        </div>
    );
}
