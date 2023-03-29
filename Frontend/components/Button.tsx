export default function Button({ children, onClick }: any) {
  return (
    <button
      className="flex gap-1 p-1 bg-gray-100 hover:bg-gray-200 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
