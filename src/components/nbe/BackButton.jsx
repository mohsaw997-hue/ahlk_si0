import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useLanguage } from "../../hooks/useLanguage";

export default function BackButton({ to = "/" }) {
  const navigate = useNavigate();
  const { isRtl } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      className="p-2 text-zinc-400 text-2xl"
      aria-label="Go back"
    >
      {isRtl ? <IoChevronForward /> : <IoChevronBack />}
    </button>
  );
}
