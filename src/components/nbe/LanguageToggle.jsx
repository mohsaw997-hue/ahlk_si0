import { TbWorld } from "react-icons/tb";
import { useLanguage } from "../../hooks/useLanguage";

export default function LanguageToggle({ compact = false }) {
  const { language, toggleLanguage, t, isRtl } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      dir={isRtl ? "rtl" : "ltr"}
      className={`flex p-2 items-center gap-x-2 text-lg text-gray-400 ${
        compact ? "w-auto" : `w-full justify-end`
      }`}
    >
      <span>
        {language === "ar" ? t("switchToEnglish") : t("switchToArabic")}
      </span>
      <TbWorld className="text-3xl shrink-0" />
    </button>
  );
}
