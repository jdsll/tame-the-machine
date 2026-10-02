import { Html, Head, Preview, Body, Container, Text, Link, Hr } from '@react-email/components'

// Shared shell for nurture emails: deliberately plain and personal, unlike the
// designed day-0 results email. Reads like a note from Jeff, not a campaign.

const text = { color: '#333', fontSize: '15px', lineHeight: 1.75, margin: '0 0 16px' }

export function P({ children }: { children: React.ReactNode }) {
  return <Text style={text}>{children}</Text>
}

export default function NurtureShell({
  preview,
  greeting,
  children,
  cta,
  unsubscribeHref,
}: {
  preview: string
  greeting: string
  children: React.ReactNode
  cta?: { text: string; href: string }
  unsubscribeHref: string
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '36px 24px' }}>
          <Text style={text}>{greeting}</Text>
          {children}
          {cta && (
            <Text style={{ ...text, margin: '24px 0' }}>
              <Link
                href={cta.href}
                style={{ color: '#0a9e7f', fontWeight: 700, textDecoration: 'underline' }}
              >
                {cta.text}
              </Link>
            </Text>
          )}
          <Text style={{ ...text, margin: '28px 0 0' }}>
            Jeff
            <br />
            <span style={{ color: '#888', fontSize: '13px' }}>
              Tame the Machine · Healdsburg, CA
            </span>
          </Text>
          <Hr style={{ borderColor: '#eee', margin: '32px 0 16px' }} />
          <Text style={{ color: '#999', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
            You&apos;re getting this because you took the AI Impact Assessment at
            tamethemachine.com.{' '}
            <Link href={unsubscribeHref} style={{ color: '#999', textDecoration: 'underline' }}>
              Unsubscribe
            </Link>{' '}
            and you won&apos;t hear from me again.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
