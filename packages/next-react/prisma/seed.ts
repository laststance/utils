import { PrismaLibSql } from '@prisma/adapter-libsql'

import { PrismaClient } from '../generated/prisma'

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const prisma = new PrismaClient({ adapter })

/**
 * Email sender templates for realistic data generation
 */
const senders = [
  { from: 'GitHub', email: 'noreply@github.com', labels: ['github'] },
  { from: 'Vercel', email: 'notifications@vercel.com', labels: ['deployment'] },
  { from: 'Linear', email: 'notify@linear.app', labels: ['task'] },
  { from: 'Stripe', email: 'receipts@stripe.com', labels: ['receipt'] },
  { from: 'Slack', email: 'notification@slack.com', labels: ['slack'] },
  { from: 'Figma', email: 'no-reply@figma.com', labels: ['design'] },
  { from: 'AWS', email: 'no-reply@amazonaws.com', labels: ['billing'] },
  { from: 'Notion', email: 'team@makenotion.com', labels: [] },
  { from: 'npm', email: 'support@npmjs.com', labels: ['npm'] },
  { from: 'Docker', email: 'no-reply@docker.com', labels: ['docker'] },
  { from: 'Cloudflare', email: 'noreply@cloudflare.com', labels: ['hosting'] },
  { from: 'Supabase', email: 'notify@supabase.io', labels: ['database'] },
  { from: 'Prisma', email: 'hello@prisma.io', labels: ['database'] },
  { from: 'Tailwind CSS', email: 'team@tailwindcss.com', labels: ['design'] },
  { from: 'Next.js', email: 'newsletter@vercel.com', labels: ['newsletter'] },
  { from: 'React Team', email: 'react@meta.com', labels: ['newsletter'] },
  {
    from: 'TypeScript',
    email: 'typescript@microsoft.com',
    labels: ['typescript'],
  },
  { from: 'VS Code', email: 'vscode@microsoft.com', labels: ['tools'] },
  { from: 'Jira', email: 'jira@atlassian.com', labels: ['task'] },
  { from: 'Confluence', email: 'confluence@atlassian.com', labels: ['docs'] },
]

/**
 * Email subject templates by sender type
 */
const subjectTemplates: Record<string, string[]> = {
  GitHub: [
    '[next-react] Pull request merged: feat/new-feature',
    '[utils] Issue opened: Bug in production',
    '[monorepo] New release: v2.0.0',
    'Security alert: dependency vulnerability detected',
    '[next-react] Code review requested',
    'Your GitHub Sponsors payout is ready',
    '[prisma] Discussion: Best practices for migrations',
  ],
  Vercel: [
    'Deployment successful for utils-main',
    'Build failed: next-react-preview',
    'Domain verified: myapp.vercel.app',
    'Usage alert: Approaching bandwidth limit',
    'New team member joined your project',
    'Weekly deployment summary',
  ],
  Linear: [
    'Issue assigned: Implement email feature',
    'Comment on: Fix sidebar animation',
    'Issue completed: Setup Prisma',
    'Sprint planning reminder for next week',
    'Cycle 23 has started',
    'Issue priority changed to Urgent',
  ],
  Stripe: [
    'Your receipt from Acme Inc - $99.00',
    'Payment successful - Invoice #12345',
    'Subscription renewed: Pro Plan',
    'Payout of $1,234.56 initiated',
    'New customer signup notification',
    'Monthly revenue report available',
  ],
  Slack: [
    'New message in #general',
    'John mentioned you in #development',
    'Reminder: Team standup in 15 minutes',
    'New direct message from Sarah',
    'Weekly digest: 47 unread messages',
    'App notification: Build completed',
  ],
  Figma: [
    'You were added to project: Design System v2',
    'Sarah commented on your design',
    'New version published: Mobile App',
    'Team library updated',
    'Prototype ready for review',
    'Design critique scheduled',
  ],
  AWS: [
    'AWS Monthly Bill Available - $127.45',
    'EC2 Instance stopped: i-abc123',
    'Security Group modified',
    'CloudWatch Alert: High CPU usage',
    'S3 bucket created successfully',
    'Lambda function deployment complete',
  ],
  Notion: [
    'Weekly digest: Your workspace activity',
    'Page shared with you: Project Roadmap',
    'Database updated: Tasks',
    'Comment on: Meeting Notes',
    'New template available: Sprint Planning',
    'Workspace storage: 80% used',
  ],
  npm: [
    'Package published: my-package@1.0.0',
    'Security advisory for lodash',
    'Weekly download report',
    'New collaborator added',
    'Deprecated package notification',
    'npm Pro features overview',
  ],
  Docker: [
    'Image pushed: myapp:latest',
    'Build completed for repository',
    'Vulnerability scan results',
    'Docker Hub usage report',
    'New organization member added',
    'Rate limit approaching',
  ],
  Cloudflare: [
    'SSL certificate renewed',
    'DDoS attack mitigated',
    'Page Rule activated',
    'Analytics report ready',
    'Workers deployment successful',
    'DNS propagation complete',
  ],
  Supabase: [
    'Database backup completed',
    'New user signed up',
    'Edge Function deployed',
    'Storage quota: 75% used',
    'Realtime connections peak',
    'Weekly project metrics',
  ],
  Prisma: [
    'Prisma 7.0 released with breaking changes',
    'Accelerate: Query performance report',
    'Schema migration completed',
    'New blog post: Best Practices',
    'Prisma Day conference announcement',
    'Documentation updated',
  ],
  'Tailwind CSS': [
    'Tailwind CSS v4.0 released',
    'New component: Bento Grid',
    'Plugin spotlight: forms',
    'Community showcase',
    'Performance optimization tips',
    'Design system integration guide',
  ],
  'Next.js': [
    'Next.js 16 is now stable',
    'App Router migration guide',
    'Server Components best practices',
    'Vercel AI SDK integration',
    'Performance benchmarks',
    'Community template showcase',
  ],
  'React Team': [
    'React 19 release candidate',
    'New hooks: useOptimistic, useFormStatus',
    'Server Components deep dive',
    'React Conf 2025 tickets available',
    'Concurrent features explained',
    'Migration guide from React 18',
  ],
  TypeScript: [
    'TypeScript 5.9 released',
    'New feature: satisfies operator',
    'Performance improvements',
    'Strict mode recommendations',
    'Type inference enhancements',
    'ESM support updates',
  ],
  'VS Code': [
    'VS Code January 2025 update',
    'New extension: Copilot improvements',
    'Remote development features',
    'Debugging tips and tricks',
    'Theme marketplace highlights',
    'Workspace settings guide',
  ],
  Jira: [
    'Sprint 23 completed',
    'Issue JRA-456 assigned to you',
    'Release notes for v2.0',
    'Backlog grooming reminder',
    'Automation rule triggered',
    'Dashboard updated',
  ],
  Confluence: [
    'Page edited: Technical Specifications',
    'New comment on Architecture doc',
    'Space permissions updated',
    'Template shared: RFC',
    'Whiteboard session scheduled',
    'Knowledge base weekly digest',
  ],
}

/**
 * Email body templates
 */
const bodyTemplates = [
  `Thank you for using our service. This email contains important information about your account.

We wanted to let you know about recent updates and changes that may affect you. Please review the details below and take any necessary action.

If you have any questions, feel free to reach out to our support team.

Best regards,
The Team`,

  `Your recent activity has been processed successfully.

Here's a summary of what happened:
- Changes have been applied to your account
- All systems are running normally
- No further action is required at this time

Thank you for your continued support.

Regards,
Support Team`,

  `This is a notification about your project.

We detected some activity that you might want to review. Please log in to your dashboard to see the full details.

Key highlights:
- New updates available
- Performance metrics improved
- Security status: All clear

Let us know if you need any assistance.

Best,
Platform Team`,

  `Weekly Summary Report

This week's highlights:
- 15 new items processed
- 3 issues resolved
- 2 pending reviews

Upcoming:
- Scheduled maintenance on Sunday
- New feature launch next week

Thank you for being a valued user.

Cheers,
The Team`,

  `Important Update

We've made some improvements to enhance your experience:

1. Faster loading times
2. New dashboard features
3. Improved mobile support
4. Enhanced security measures

These changes are now live and ready for you to explore.

Questions? Contact us anytime.

Best,
Product Team`,
]

/**
 * Generates a random date within the last 30 days
 * @returns Random Date object
 */
const randomDate = (daysAgo: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  return date
}

/**
 * Generates seed email data
 * @param count - Number of emails to generate
 * @returns Array of email objects
 */
const generateEmails = (count: number) => {
  const emails = []

  for (let i = 0; i < count; i++) {
    const sender = senders[Math.floor(Math.random() * senders.length)]!
    const subjects = subjectTemplates[sender.from] ?? ['Notification']
    const subject = subjects[Math.floor(Math.random() * subjects.length)]!
    const body =
      bodyTemplates[Math.floor(Math.random() * bodyTemplates.length)]!

    emails.push({
      from: sender.from,
      email: sender.email,
      subject,
      preview: body.substring(0, 80) + '...',
      body,
      date: randomDate(Math.floor(Math.random() * 30)),
      read: Math.random() > 0.3, // 70% read
      starred: Math.random() > 0.85, // 15% starred
      archived: false,
      labels: JSON.stringify(sender.labels),
    })
  }

  // Sort by date descending (newest first)
  return emails.sort((a, b) => b.date.getTime() - a.date.getTime())
}

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing emails
  await prisma.email.deleteMany()
  console.log('✓ Cleared existing emails')

  // Generate and insert 60 emails
  const emails = generateEmails(60)
  await prisma.email.createMany({ data: emails })
  console.log(`✓ Created ${emails.length} emails`)

  // Log some stats
  const stats = await prisma.email.aggregate({
    _count: true,
  })
  console.log(`📊 Total emails: ${stats._count}`)

  const unread = await prisma.email.count({ where: { read: false } })
  console.log(`📬 Unread: ${unread}`)

  const starred = await prisma.email.count({ where: { starred: true } })
  console.log(`⭐ Starred: ${starred}`)

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
