import JobsPage, { revalidate, dynamic, metadata as jobsMetadata } from '../jobs/page'

// Reuse Jobs page logic and data for /careers
export { revalidate, dynamic }

// Override canonical to /careers while keeping other metadata fields
export const metadata = {
  ...jobsMetadata,
  alternates: { canonical: '/careers' },
}

export default JobsPage
