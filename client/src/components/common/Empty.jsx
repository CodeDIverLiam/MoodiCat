export default function Empty({ message = "No data found", action, actionText, onAction }) {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">📝</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      {action && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
