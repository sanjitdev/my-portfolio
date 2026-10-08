import type { LucideIcon } from 'lucide-react';

interface ContactRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string | null;
}

/**
 * One contact channel row (icon + label + value, with a clickable link if a
 * href is provided). The address channel is intentionally NOT in the design —
 * the prop type precludes it via `PublicContact`.
 */
export function ContactRow({ icon: Icon, label, value, href }: ContactRowProps) {
  const content = (
    <>
      <Icon
        aria-hidden="true"
        className="h-5 w-5 flex-shrink-0 text-accent-600 dark:text-accent-400"
      />
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="truncate text-slate-900 dark:text-slate-100">{value}</p>
      </div>
    </>
  );

  if (href === null) {
    return <div className="flex items-center gap-3">{content}</div>;
  }

  const isExternal = href.startsWith('http');

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 rounded-md p-2 -m-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {content}
    </a>
  );
}
