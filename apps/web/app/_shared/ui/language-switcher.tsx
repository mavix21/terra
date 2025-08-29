"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@myapp/ui/components/select";

import { usePathname, useRouter } from "@/shared/i18n";

import { locales } from "../i18n/locales";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("languages");

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const getLanguageName = (localeCode: string) => {
    // Try to get the translated name, fallback to uppercase locale code
    try {
      return t(localeCode);
    } catch {
      return localeCode.toUpperCase();
    }
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="h-9 w-fit">
        <SelectValue>{getLanguageName(locale)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {getLanguageName(loc)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
