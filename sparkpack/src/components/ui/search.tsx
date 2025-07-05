"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input"; // or your component lib
import { Button } from "@/components/ui/button";

export function SearchComponent() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(""); // "users", "pets", etc.
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${query}&type=${type}`);
      const json = await res.json();
      setResults(json.data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-2 py-1 rounded-md"
        >
          <option value="">All</option>
          <option value="users">Users</option>
          <option value="pets">Pets</option>
          <option value="applications">Applications</option>
          <option value="claims">Claims</option>
        </select>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {results && (
        <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto text-sm">
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
