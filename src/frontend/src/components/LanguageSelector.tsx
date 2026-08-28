import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type LanguageCode, SUPPORTED_LANGUAGES, languageLabels } from "@/i18n";
import { useLanguage } from "@/i18n/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages className="size-4 text-muted-foreground" aria-hidden="true" />
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as LanguageCode)}
      >
        <SelectTrigger
          className="h-9 w-[7.5rem] rounded-full border-border bg-background"
          aria-label="Select language"
          data-ocid="language.select"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent data-ocid="language.menu">
          {SUPPORTED_LANGUAGES.map((code) => (
            <SelectItem
              key={code}
              value={code}
              data-ocid={`language.option.${code}`}
            >
              {languageLabels[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
