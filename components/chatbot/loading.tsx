export default function ChatbotLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-64 bg-gray-200 rounded"></div>
        <div className="h-4 w-52 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
