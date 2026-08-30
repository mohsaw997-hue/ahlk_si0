import { TailSpin } from "react-loader-spinner";
import { useLanguage } from "../../hooks/useLanguage";

export default function ProcessingOverlay() {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 w-full">
      <div className="bg-white rounded-md p-3 w-3/4 py-10 h-fit flex items-center justify-center gap-x-3">
        <TailSpin
          height="30"
          width="30"
          color="green"
          ariaLabel="tail-spin-loading"
          radius="1"
          visible={true}
        />
        <span className="text-lg">{t("processing")}</span>
      </div>
    </div>
  );
}
