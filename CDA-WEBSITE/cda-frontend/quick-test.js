const GRAPHQL_URL = 'http://localhost/CDA-WEBSITE-PROJECT/CDA-WEBSITE/wordpress-backend/graphql';

const testQuery = `
  {
    jobListing(id: "test-1", idType: SLUG) {
      id
      title
      jobDetails {
        location
        salary
      }
      jobStatus
    }
  }
`;

fetch(GRAPHQL_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: testQuery })
})
.then(r => r.json())
.then(d => {
  if (d.errors) {
    d.errors.forEach(e => {
      const match = e.message.match(/Did you mean "([^"]+)"/);
      if (match) console.log(`TRY: ${match[1]}`);
      else console.log(e.message);
    });
  }
  if (d.data) console.log('SUCCESS:', JSON.stringify(d.data, null, 2));
});
