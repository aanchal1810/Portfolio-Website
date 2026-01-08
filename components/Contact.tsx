"use client";

import { useState } from "react";
import {
    Mail,
    Github,
    Linkedin,
    Copy,
    MessageCircle,
    Check,
} from "lucide-react";

const contacts = [
    {
        name: "Email",
        value: "aanchalshah1810@gmail.com",
        icon: Mail,
        link: "mailto:anchalshah1810@gmail.com",
    },
    {
        name: "GitHub",
        value: "https://github.com/aanchal1810",
        icon: Github,
        link: "https://github.com/aanchal1810",
    },
    {
        name: "LinkedIn",
        value: "https://in.linkedin.com/in/aanchal-shah18",
        icon: Linkedin,
        link: "https://in.linkedin.com/in/aanchal-shah18",
    },
];

export default function Floating() {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = async (text: string, name: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(name);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="fixed font-urbane cursor-pointer bottom-6 right-6 z-50 w-36 flex flex-col items-end">
            {/* Menu */}
            {open && (
                <div className="mb-4 cursor-pointer flex flex-col gap-3 w-full">
                    {contacts.map((item) => (
                        <div
                            key={item.name}
                            className="
                w-full
                flex items-center justify-between
                bg-brand-black text-white
                px-4 py-2
                rounded-full shadow-lg
              "
                        >
                            <a
                                href={item.link}
                                target="_blank"
                                className="flex items-center gap-3"
                            >
                                <item.icon size={16} />
                                <span className="text-sm">{item.name}</span>
                            </a>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => copyToClipboard(item.value, item.name)}
                                    className="cursor-pointer"
                                >
                                    {copied === item.name ? (
                                        <Check size={16} className="text-green-400" />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="
          h-14 w-14
          rounded-full
          bg-brand-black text-white
          flex items-center justify-center
          shadow-xl
          cursor-pointer
          hover:scale-105
          transition
          self-end
        "
            >
                <MessageCircle />
            </button>
        </div>
    );
}
