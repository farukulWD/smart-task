"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/hooks/use-locale";
import { locales, languageNames } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{languageNames[locale]}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {locales.map((lang) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => setLocale(lang)}
              className={`cursor-pointer ${
                locale === lang ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              <motion.div
                className="flex items-center justify-between w-full"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.1 }}
              >
                <span>{languageNames[lang]}</span>
                {locale === lang && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                  />
                )}
              </motion.div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
