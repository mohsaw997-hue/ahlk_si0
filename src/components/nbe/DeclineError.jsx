export default function DeclineError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="w-full text-red-700 py-2 text-center mt-2 text-sm font-medium"
    >
      {message}
    </div>
  );
}
