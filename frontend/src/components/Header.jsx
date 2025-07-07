function Header({ repoUrl }) {
  return (
    <header className="text-center">
      <h1 className="text-3xl font-bold text-gray-800">🧪 Test Insight Dashboard</h1>
      {repoUrl && (
        <p className="mt-2 text-blue-600 text-sm truncate">
          <span className="font-semibold">Latest Repo:</span> {repoUrl}
        </p>
      )}
    </header>
  );
}

export default Header;
