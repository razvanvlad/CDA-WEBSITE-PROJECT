'use client';
import { useEffect, useState } from 'react';
import client from '../../lib/graphql/client';
import { gql } from '@apollo/client';

const TEST_QUERY = gql`
  query TestAIDirect {
    page(id: "785", idType: DATABASE_ID) {
      id
      title  
      aiContent {
        __typename
      }
    }
  }
`;

export default function TestAIDirectPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.query({ query: TEST_QUERY, errorPolicy: 'all' })
      .then(response => {
        console.log('Direct test result:', response);
        setData(response);
      })
      .catch(err => {
        console.log('Direct test error:', err);
        setError(err);
      });
  }, []);

  return (
    <div className="p-8">
      <h1>Direct AI Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
}