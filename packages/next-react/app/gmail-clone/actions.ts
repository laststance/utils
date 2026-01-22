'use server'

import type { Email } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'

/**
 * Email type with parsed labels (JSON string → string array)
 */
export interface EmailWithParsedLabels extends Omit<Email, 'labels'> {
  labels: string[]
}

/**
 * Parses email labels from JSON string to array
 * @param email - Email with JSON string labels
 * @returns Email with parsed labels array
 */
const parseEmailLabels = (email: Email): EmailWithParsedLabels => ({
  ...email,
  labels: JSON.parse(email.labels) as string[],
})

/**
 * Fetches all non-archived emails ordered by date descending
 * @returns Array of emails with parsed labels
 * @example
 * const emails = await getEmails()
 * // => [{ id: '...', from: 'GitHub', labels: ['github'], ... }, ...]
 */
export async function getEmails(): Promise<EmailWithParsedLabels[]> {
  const emails = await prisma.email.findMany({
    where: { archived: false },
    orderBy: { date: 'desc' },
  })
  return emails.map(parseEmailLabels)
}

/**
 * Fetches a single email by ID
 * @param id - Email ID
 * @returns Email with parsed labels or null if not found
 * @example
 * const email = await getEmailById('clxx...')
 */
export async function getEmailById(
  id: string,
): Promise<EmailWithParsedLabels | null> {
  const email = await prisma.email.findUnique({
    where: { id },
  })
  return email ? parseEmailLabels(email) : null
}

/**
 * Toggles the starred status of an email
 * @param id - Email ID
 * @returns Updated email with new starred status
 * @example
 * const email = await toggleStar('clxx...')
 * // => { ...email, starred: true }
 */
export async function toggleStar(id: string): Promise<EmailWithParsedLabels> {
  const email = await prisma.email.findUnique({
    where: { id },
    select: { starred: true },
  })

  if (!email) {
    throw new Error(`Email not found: ${id}`)
  }

  const updated = await prisma.email.update({
    where: { id },
    data: { starred: !email.starred },
  })

  return parseEmailLabels(updated)
}

/**
 * Marks an email as read
 * @param id - Email ID
 * @returns Updated email with read: true
 * @example
 * const email = await markAsRead('clxx...')
 */
export async function markAsRead(id: string): Promise<EmailWithParsedLabels> {
  const updated = await prisma.email.update({
    where: { id },
    data: { read: true },
  })

  return parseEmailLabels(updated)
}

/**
 * Toggles the read status of an email
 * @param id - Email ID
 * @returns Updated email with toggled read status
 * @example
 * const email = await toggleRead('clxx...')
 */
export async function toggleRead(id: string): Promise<EmailWithParsedLabels> {
  const email = await prisma.email.findUnique({
    where: { id },
    select: { read: true },
  })

  if (!email) {
    throw new Error(`Email not found: ${id}`)
  }

  const updated = await prisma.email.update({
    where: { id },
    data: { read: !email.read },
  })

  return parseEmailLabels(updated)
}

/**
 * Archives an email (soft delete)
 * @param id - Email ID
 * @returns Updated email with archived: true
 * @example
 * const email = await archiveEmail('clxx...')
 */
export async function archiveEmail(id: string): Promise<EmailWithParsedLabels> {
  const updated = await prisma.email.update({
    where: { id },
    data: { archived: true },
  })

  return parseEmailLabels(updated)
}

/**
 * Archives multiple emails at once
 * @param ids - Array of email IDs
 * @returns Count of archived emails
 * @example
 * const result = await archiveEmails(['clxx...', 'clyy...'])
 * // => { count: 2 }
 */
export async function archiveEmails(ids: string[]): Promise<{ count: number }> {
  const result = await prisma.email.updateMany({
    where: { id: { in: ids } },
    data: { archived: true },
  })

  return { count: result.count }
}

/**
 * Unarchives an email (restore from archive)
 * @param id - Email ID
 * @returns Updated email with archived: false
 * @example
 * const email = await unarchiveEmail('clxx...')
 */
export async function unarchiveEmail(
  id: string,
): Promise<EmailWithParsedLabels> {
  const updated = await prisma.email.update({
    where: { id },
    data: { archived: false },
  })

  return parseEmailLabels(updated)
}

/**
 * Permanently deletes an email
 * @param id - Email ID
 * @returns Deleted email
 * @example
 * const email = await deleteEmail('clxx...')
 */
export async function deleteEmail(id: string): Promise<EmailWithParsedLabels> {
  const deleted = await prisma.email.delete({
    where: { id },
  })

  return parseEmailLabels(deleted)
}

/**
 * Permanently deletes multiple emails at once
 * @param ids - Array of email IDs
 * @returns Count of deleted emails
 * @example
 * const result = await deleteEmails(['clxx...', 'clyy...'])
 * // => { count: 2 }
 */
export async function deleteEmails(ids: string[]): Promise<{ count: number }> {
  const result = await prisma.email.deleteMany({
    where: { id: { in: ids } },
  })

  return { count: result.count }
}

/**
 * Gets count of unread emails
 * @returns Number of unread emails
 * @example
 * const count = await getUnreadCount()
 * // => 15
 */
export async function getUnreadCount(): Promise<number> {
  return prisma.email.count({
    where: { read: false, archived: false },
  })
}

/**
 * Gets count of starred emails
 * @returns Number of starred emails
 * @example
 * const count = await getStarredCount()
 * // => 8
 */
export async function getStarredCount(): Promise<number> {
  return prisma.email.count({
    where: { starred: true, archived: false },
  })
}
