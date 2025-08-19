// CDA-WEBSITE-PROJECT/CDA-WEBSITE/cda-frontend/src/lib/graphql/queries.js
export const GET_PAGE_CONTENT = `
  query GetPageContent($id: ID!) {
    page(id: $id, idType: DATABASE_ID) {
      id
      title
      date
      # Try to access the ACF field directly first
      acf {
        # Replace 'homepageFields' with your actual field group name
        # Check your ACF field group settings for the correct field name
        testContentFields {
          testText
          testNumber
        }
      }
    }
  }
`;