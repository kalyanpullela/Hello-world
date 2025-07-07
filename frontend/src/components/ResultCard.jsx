function ResultCard({ data }) {
  const { test_code, intent, implementation } = data;

  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">🧪 Test Case</h2>
      <pre className="bg-gray-100 text-sm p-3 rounded overflow-x-auto">{test_code}</pre>

      <h2 className="text-lg font-semibold text-gray-700 mt-4">🧠 Intent</h2>
      <p className="bg-yellow-50 p-3 rounded text-gray-800 text-sm border border-yellow-200">{intent}</p>

      <h2 className="text-lg font-semibold text-gray-700 mt-4">💻 Generated Implementation</h2>
      <pre className="bg-gray-100 text-sm p-3 rounded overflow-x-auto">{implementation}</pre>
    </div>
  );
}

export default ResultCard;
