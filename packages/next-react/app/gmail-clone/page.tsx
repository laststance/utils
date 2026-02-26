import { getEmails, getStarredCount, getUnreadCount } from './actions'
import { GmailClient } from './gmail-client'

export const dynamic = 'force-dynamic'

/**
 * Gmail Clone page - Server Component that fetches initial data
 * and passes it to the client component for interactive UI
 */
export default async function GmailClonePage() {
  const [emails, unreadCount, starredCount] = await Promise.all([
    getEmails(),
    getUnreadCount(),
    getStarredCount(),
  ])

  return (
    <GmailClient
      initialEmails={emails}
      initialUnreadCount={unreadCount}
      initialStarredCount={starredCount}
    />
  )
}
