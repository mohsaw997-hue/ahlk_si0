import {
  TbCalendar,
  TbMapPin,
  TbArrowsExchange,
  TbCalculator,
  TbCoins,
  TbCurrencyDollar,
  TbBuildingBank,
} from "react-icons/tb";
import { useLanguage } from "../../hooks/useLanguage";

const cardConfig = [
  { key: "bookAppointment", icon: TbCalendar },
  { key: "atmBranch", icon: TbMapPin },
  { key: "forexCalc", icon: TbArrowsExchange },
  { key: "installmentCalc", icon: TbCalculator },
  { key: "depositsCalc", icon: TbCoins },
  { key: "loanCalc", icon: TbCurrencyDollar },
  { key: "currencies", icon: TbBuildingBank },
];

export default function QuickActionCards() {
  const { t } = useLanguage();

  return (
    <div className="w-full mt-8 overflow-x-auto scrollbar-hide self-end">
      <div className="flex gap-3 pb-2 min-w-min px-1">
        {cardConfig.map(({ key, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className="shrink-0 w-28 h-28 flex flex-col items-center justify-center gap-2 bg-nbe-light rounded-xl px-2 text-center"
          >
            <Icon className="text-3xl text-zinc-500" />
            <span className="text-xs text-zinc-600 leading-tight">{t(key)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
