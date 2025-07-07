import React, { useEffect, useState } from "react";
import axios from "axios";
import { Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const App = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [repoURL, setRepoURL] = useState("");
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/results");
        setResults(response.data.results);
        setRepoURL(response.data.repo_url);
        setTimestamp(new Date().toLocaleString());
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter((r) =>
    r.test_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.implementation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen px-6 py-4`}>
      <header className="sticky top-0 z-10 shadow-sm rounded-xl px-6 py-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Test Intent Analyzer</h1>
          <p className="text-sm mt-1">
            Latest Repo:{" "}
            <a
              href={repoURL}
              className="text-blue-500 underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {repoURL}
            </a>{" "}
            — {timestamp}
          </p>
        </div>
        <div className="mt-2 sm:mt-0">
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-2 text-sm text-gray-600 dark:text-gray-300">Dark Mode</span>
            <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
          </label>
        </div>
      </header>

      <Input
        placeholder="Search tests, intent, or implementation..."
        className="mb-6 border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid gap-6">
            {filteredResults.map((result, index) => (
              <Card key={index} className="p-4 space-y-4">
                <div>
                  <Label className="font-semibold">Test Code</Label>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto text-sm whitespace-pre-wrap font-mono">
                    {result.test_code}
                  </pre>
                </div>

                <div>
                  <Label className="font-semibold">Inferred Intent</Label>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{result.intent}</p>
                </div>

                <div>
                  <Label className="font-semibold">Generated Implementation</Label>
                  <div className="relative">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto text-sm whitespace-pre-wrap font-mono">
                      {result.implementation}
                    </pre>
                    <Button
                      onClick={() => handleCopy(result.implementation)}
                      className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default App;
