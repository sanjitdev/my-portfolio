import { Globe, Linkedin, Mail, Phone } from 'lucide-react';
import type { PublicContact } from '@/lib/cv-types';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { ContactRow } from './ContactRow';

interface ContactSectionProps {
  contact: PublicContact;
}

/**
 * Contact section — shows Email, Phone, LinkedIn, and Website as clickable
 * rows. Crucially, the prop type is `PublicContact` which excludes `address`
 * — TypeScript will refuse to compile any code that tries to access it.
 *
 * The address is also absent from rendered output by construction: even if
 * it leaked into `PublicContact`, no row renders it.
 */
export function ContactSection({ contact }: ContactSectionProps) {
  const websiteHref = contact.website
    ? contact.website.startsWith('http')
      ? contact.website
      : `https://${contact.website}`
    : null;

  const linkedinHref = contact.linkedin
    ? contact.linkedin.startsWith('http')
      ? contact.linkedin
      : `https://${contact.linkedin}`
    : null;

  return (
    <Section id="contact" ariaLabelledBy="contact-heading">
      <Container>
        <Heading as="h2" id="contact-heading">
          Contact
        </Heading>
        <div className="grid gap-6 sm:grid-cols-2">
          <ContactRow
            icon={Mail}
            label="Email"
            value={contact.email}
            href={`mailto:${contact.email}`}
          />
          <ContactRow
            icon={Phone}
            label="Phone"
            value={contact.phone}
            href={`tel:${contact.phone.replace(/\s+/g, '')}`}
          />
          <ContactRow
            icon={Linkedin}
            label="LinkedIn"
            value={contact.linkedin}
            href={linkedinHref}
          />
          <ContactRow icon={Globe} label="Website" value={contact.website} href={websiteHref} />
        </div>
      </Container>
    </Section>
  );
}
