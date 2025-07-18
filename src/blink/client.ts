import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'admin-portal-property-management-gixhr3i4',
  authRequired: true
})

// Disable analytics to prevent network errors
if (blink.analytics && blink.analytics.disable) {
  blink.analytics.disable()
}

export default blink