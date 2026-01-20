import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useSubscribe } from 'meteor/react-meteor-data';

interface LeaderboardEntry {
  userId: string;
  wins: number;
}

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useSubscribe('leaderboardUsers');

  useEffect(() => {
    Meteor.call('games.getLeaderboard', (error: any, result: LeaderboardEntry[]) => {
      if (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      } else {
        setLeaderboard(result || []);
        setLoading(false);
      }
    });
  }, []);

  const getUserEmail = (userId: string) => {
    const user = Meteor.users.findOne({ _id: userId });
    return user?.emails?.[0]?.address || 'Unknown';
  };

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>🏆 Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No games finished yet. Be the first to win!</p>
      ) : (
        <ol style={{ paddingLeft: '20px' }}>
          {leaderboard.map((entry, index) => (
            <li key={entry.userId} style={{ marginBottom: '10px', padding: '8px', backgroundColor: index < 3 ? '#f0f8ff' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{index + 1}. {getUserEmail(entry.userId)}</strong>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                  {entry.wins} {entry.wins === 1 ? 'win' : 'wins'}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
