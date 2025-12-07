
import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { searchUsers } from './services/githubService';
import type { GitHubUser } from './types';
import { SearchInput } from './components/SearchInput';
import { UserProfile } from './components/UserProfile';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';

const GitHubIcon = () => (
  <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" className="fill-white">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.19.01-.82.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21-.15.46-.55.38A8.013 8.013 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
  </svg>
);


const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim() === '') {
      setUsers([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchUsers(searchQuery);
      setUsers(results);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const renderContent = () => {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }
    
    if (!hasSearched) {
        return (
            <div className="text-center text-gray-400 mt-10">
                <p className="text-lg">Start by typing a username in the search bar above.</p>
            </div>
        );
    }

    if (users.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {users.map((user) => (
            <UserProfile key={user.id} user={user} />
          ))}
        </div>
      );
    }

    if (hasSearched && users.length === 0) {
        return (
            <div className="text-center text-gray-400 mt-10">
                <p className="text-lg">No users found for "{debouncedQuery}".</p>
                <p className="text-sm">Try a different search term.</p>
            </div>
        );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 flex flex-col items-center">
            <GitHubIcon />
            <h1 className="text-4xl md:text-5xl font-bold mt-4">GitHub User Search</h1>
            <p className="text-lg text-gray-400 mt-2">Find developers and contributors from all over the world.</p>
        </header>
        
        <div className="max-w-2xl mx-auto sticky top-4 z-10">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
        </div>
        
        <div className="mt-8">
            {renderContent()}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by the GitHub API</p>
      </footer>
    </div>
  );
};

export default App;
