// components/Header.js (server wrapper)
import HeaderClient from './HeaderClient'
import { executeGraphQLQuery } from '../lib/graphql-queries'

const MENU_BY_DBID = `
  query MenuByDbId($id: ID!) {
    menu(id: $id, idType: DATABASE_ID) {
      id
      name
      menuItems(first: 100) {
        nodes {
          id
          databaseId
          label
          url
          path
          parentId
          order
        }
      }
    }
  }
`

const MENU_BY_NAME = `
  query MenuByName($name: ID!) {
    menu(id: $name, idType: NAME) {
      id
      name
      menuItems(first: 100) {
        nodes {
          id
          databaseId
          label
          url
          path
          parentId
          order
        }
      }
    }
  }
`

const LIST_MENUS = `
  query ListMenus {
    menus(first: 100) { nodes { id databaseId name } }
  }
`

function normalize(nodes) {
  return (nodes || [])
    .map((n, idx) => ({
      id: n?.id || `node-${idx}`,
      label: n?.label || '',
      url: n?.path || n?.url || '#',
      parentId: n?.parentId ?? null,
      order: n?.order ?? (idx + 1),
    }))
    .filter(n => n.label && n.url)
}

async function fetchMenuSmart({ id, name, autoMatch }) {
  // Try by DB ID
  try {
    const res = await executeGraphQLQuery(MENU_BY_DBID, { id: String(id) })
    const nodes = res?.data?.menu?.menuItems?.nodes || []
    const norm = normalize(nodes)
    if (norm.length) return norm
  } catch (err) {
    console.warn(`Failed to fetch menu by DB ID ${id}:`, err.message)
  }

  // Try by name
  try {
    const res = await executeGraphQLQuery(MENU_BY_NAME, { name })
    const nodes = res?.data?.menu?.menuItems?.nodes || []
    const norm = normalize(nodes)
    if (norm.length) return norm
  } catch (err) {
    console.warn(`Failed to fetch menu by name ${name}:`, err.message)
  }

  // Auto-resolve from list
  try {
    const res = await executeGraphQLQuery(LIST_MENUS)
    const menus = res?.data?.menus?.nodes || []
    const match = menus.find(m => typeof m?.name === 'string' && autoMatch.test(m.name))
    if (match?.databaseId) {
      const res2 = await executeGraphQLQuery(MENU_BY_DBID, { id: String(match.databaseId) })
      const nodes = res2?.data?.menu?.menuItems?.nodes || []
      return normalize(nodes)
    }
  } catch (err) {
    console.warn('Failed to auto-resolve menu:', err.message)
  }

  return []
}

export default async function Header({ backButton = null }) {
  let primary = []
  let company = []

  try {
    [primary, company] = await Promise.all([
      fetchMenuSmart({ id: '4', name: 'primary', autoMatch: /primary/i }),
      fetchMenuSmart({ id: '18', name: 'company', autoMatch: /company|sidebar/i }),
    ])
  } catch (err) {
    console.error('Failed to fetch menu data in Header:', err.message)
    // Continue with empty arrays - HeaderClient will handle the fallback
  }

  return (
    <HeaderClient
      initialPrimaryLinks={primary}
      initialCompanyLinks={company}
      backButton={backButton}
    />
  )
}
