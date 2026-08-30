import { TbFaceId, TbLoader } from "react-icons/tb";

export default function LoginButtonRow({ loading, label }) {
  return (
    <div className={`w-full flex items-center gap-x-2 py-2 flex-row`}>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 bg-nbe-green rounded-xl text-white py-3 px-4 text-lg font-semibold disabled:opacity-70 flex items-center justify-center"
      >
        {loading ? <TbLoader className="animate-spin text-xl" /> : label}
      </button>
      <button
        type="button"
        className="shrink-0 w-14 h-14 flex items-center justify-center bg-stone-200 rounded-xl"
        aria-label="Biometric login"
      >
        <TbFaceId className="text-3xl text-stone-500" />
      </button>
    </div>
  );
}
