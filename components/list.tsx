import { Heart, Circle } from "lucide-react";

interface ListItem {
  parent: string;
  children?: Array<string | { text: string; symbol?: "dot" | "star"; weight?: number; domain?: string }>;
}

interface ListProps {
  items: ListItem[];
}

export default function List({ items }: ListProps) {
  return (
    <ul className="text-black dark:text-white list-none">
      {items.map((item, index) => (
        <li key={index} className={item.parent === "Building" ? "mb-6" : "mb-2"}>
          <div className="font-normal">{item.parent}</div>
          {item.children && item.children.length > 0 && (
            <ul className="list-none mt-1 ml-6">
              {item.children.map((child, childIndex) => {
                const childText = typeof child === "string" ? child : child.text;
                const symbol = typeof child === "string" ? undefined : child.symbol;
                const weight = typeof child === "string" ? undefined : child.weight;
                const domain = typeof child === "string" ? undefined : child.domain;
                return (
                  <li key={childIndex} className="mb-1 flex items-center">
                    {domain ? (
                      <a 
                        href={`https://${domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-70"
                        style={{ fontWeight: weight }}
                      >
                        {childText}
                      </a>
                    ) : (
                      <span style={{ fontWeight: weight }}>{childText}</span>
                    )}
                    {symbol === "dot" && (
                      <Circle className="ml-2 inline-block" size={7} fill="currentColor" />
                    )}
                    {symbol === "star" && (
                      <Heart className="ml-2 inline-block" size={8} fill="currentColor" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

