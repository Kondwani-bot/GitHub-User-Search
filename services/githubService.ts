
import type { GitHubUser, GitHubSearchResponse } from '../types';

const API_BASE_URL = 'https://api.github.com';

export const searchUsers = async (query: string): Promise<GitHubUser[]> => {
  if (!query) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=20`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
        throw new Error('API rate limit exceeded. Please wait a moment and try again.');
    }
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data: GitHubSearchResponse = await response.json();
  return data.items;
};
