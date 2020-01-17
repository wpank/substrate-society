import React, { useEffect, useState } from 'react';
import { Grid, Card } from 'semantic-ui-react';

import { useSubstrate } from '../substrate-lib';
import MemberCard from './Cards/MemberCard';

function Main (props) {
  const { api } = useSubstrate();
  const [members, setMembers] = useState([]);
  const [strikes, setStrikes] = useState([]);

  const { accountPair } = props;

  useEffect(() => {
    let unsubscribe = null;

    api.query.society
      .members(setMembers)
      .then(u => {
        unsubscribe = u;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.society]);

  useEffect(() => {
    let unsubscribe = null;

    api.query.society.strikes
      .multi(members, setStrikes)
      .then(u => {
        unsubscribe = u;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.society, members]);

  return (
    <Grid.Column>
      <h2>Members</h2>
      <Card.Group>
        <MemberCard
          users={members}
          strikes={strikes}
          accountPair={accountPair}
        />
      </Card.Group>
    </Grid.Column>
  );
}

export default function Members (props) {
  const { api } = useSubstrate();
  return api.query.society && api.query.society.members ? (
    <Main {...props} />
  ) : null;
}
