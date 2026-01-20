import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { LoginForm } from './LoginForm';
import { UserInfo } from './UserInfo';
import { GameList } from './GameList';
import { Leaderboard } from './Leaderboard';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const loggingIn = useTracker(() => Meteor.loggingIn());

  if (loggingIn) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Tic-Tac-Toe</h1>
        <LoginForm />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tic-Tac-Toe</h1>
      <UserInfo />
      <Leaderboard />
      <GameList />
    </div>
  );
};
