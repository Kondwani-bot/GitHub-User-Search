
import React from 'react';
import type { GitHubUser } from '../types';

interface UserProfileProps {
  user: GitHubUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <a
      href={user.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={user.avatar_url}
          alt={`${user.login}'s avatar`}
          className="w-24 h-24 rounded-full border-4 border-gray-700"
        />
        <h3 className="mt-4 text-xl font-bold text-white truncate w-full">{user.login}</h3>
        <span className="mt-2 inline-block bg-teal-500 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
          View Profile
        </span>
      </div>
    </a>
  );
};
