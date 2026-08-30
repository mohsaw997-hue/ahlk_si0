import { GoPerson } from "react-icons/go";
import { IoPeopleSharp } from "react-icons/io5";
import { useLanguage } from "../../hooks/useLanguage";

export default function UserTypeToggle() {
  const { t, isRtl } = useLanguage();
  const userType = "retail"

  const tabs = [
    { id: "corporate", label: t("corporate"), icon: IoPeopleSharp },
    { id: "retail", label: t("retail"), icon: GoPerson },
  ];

  const orderedTabs = isRtl ? [...tabs].reverse() : tabs;

  return (
    <div className={`w-full flex gap-2 ${isRtl ? "flex-row" : "flex-row-reverse"}`}>
      {orderedTabs.map(({ id, label, icon: Icon }) => {
        const active = userType === id;
        return (
          <button
            key={id}
            type="button"
            className={`flex-1 flex items-center justify-center gap-x-2 rounded-xl px-4 py-3 text-lg font-semibold ${
              active
                ? "bg-nbe-grey text-white"
                : "bg-nbe-light text-zinc-700"
            } ${isRtl ? "flex-row-reverse" : "flex-row"}`}
          >
            <span>{label}</span>
            <Icon className="text-xl shrink-0" />
          </button>
        );
      })}
    </div>
  );
}
