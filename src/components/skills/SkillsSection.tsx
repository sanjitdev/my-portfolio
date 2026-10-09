import { Code2, Wrench, Cloud, Database } from 'lucide-react';
import { Section } from '@/components/shared/Section';
import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Tag } from '@/components/shared/Tag';
import { SectionEyebrow } from '@/components/sections/SectionEyebrow';

interface SkillsSectionProps {
  skills: string[];
}

type Category = 'Languages' | 'Frameworks' | 'Cloud & DevOps' | 'Tools & Databases' | 'Other';

interface CategoryDef {
  name: Category;
  icon: typeof Code2;
  keywords: string[];
}

const CATEGORIES: CategoryDef[] = [
  {
    name: 'Languages',
    icon: Code2,
    keywords: [
      'javascript',
      'typescript',
      'python',
      'go',
      'java',
      'c++',
      'rust',
      'ruby',
      'php',
      'swift',
      'kotlin',
      'c#',
      'scala',
    ],
  },
  {
    name: 'Frameworks',
    icon: Wrench,
    keywords: [
      'react',
      'next.js',
      'nextjs',
      'vue',
      'svelte',
      'angular',
      'node.js',
      'nodejs',
      'express',
      'django',
      'fastapi',
      'spring',
      'rails',
      'nestjs',
      'flask',
      'laravel',
      'remix',
    ],
  },
  {
    name: 'Cloud & DevOps',
    icon: Cloud,
    keywords: [
      'aws',
      'azure',
      'gcp',
      'docker',
      'kubernetes',
      'k8s',
      'terraform',
      'ansible',
      'jenkins',
      'github actions',
      'ci/cd',
      'cloudflare',
      'vercel',
      'netlify',
      'helm',
    ],
  },
  {
    name: 'Tools & Databases',
    icon: Database,
    keywords: [
      'postgresql',
      'postgres',
      'mysql',
      'mongodb',
      'redis',
      'elasticsearch',
      'git',
      'graphql',
      'rest',
      'kafka',
      'rabbitmq',
      'sqlite',
      'dynamodb',
      'firebase',
    ],
  },
];

function categorize(skill: string): Category {
  const lower = skill.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => lower.includes(kw))) {
      return cat.name;
    }
  }
  return 'Other';
}

/**
 * Skills section — groups skills into categories (Languages, Frameworks, Cloud
 * & DevOps, Tools & Databases) with a subtle icon next to each category. If
 * only one category has hits, falls back to the flat list to avoid an
 * awkward single-section grid.
 */
export function SkillsSection({ skills }: SkillsSectionProps) {
  if (skills.length === 0) {
    return (
      <Section id="skills" ariaLabelledBy="skills-heading">
        <Container>
          <SectionEyebrow>03 — Skills</SectionEyebrow>
          <Heading as="h2" id="skills-heading">
            Skills
          </Heading>
          <p className="text-slate-500 italic dark:text-slate-400">No skills listed.</p>
        </Container>
      </Section>
    );
  }

  // Group skills
  const grouped = new Map<Category, string[]>();
  for (const skill of skills) {
    const cat = categorize(skill);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(skill);
  }

  // If only 1 category has matches, render flat
  const useCategories = grouped.size > 1;

  return (
    <Section id="skills" ariaLabelledBy="skills-heading">
      <Container>
        <SectionEyebrow>03 — Skills</SectionEyebrow>
        <Heading as="h2" id="skills-heading">
          Skills
        </Heading>
        {useCategories ? (
          <div className="grid gap-8 sm:grid-cols-2">
            {CATEGORIES.filter(c => grouped.has(c.name)).map(cat => {
              const items = grouped.get(cat.name) ?? [];
              const Icon = cat.icon;
              return (
                <div key={cat.name}>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <Icon aria-hidden="true" className="h-4 w-4 text-accent-500" />
                    {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map(s => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                </div>
              );
            })}
            {grouped.has('Other') && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <Code2 aria-hidden="true" className="h-4 w-4 text-accent-500" />
                  Other
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(grouped.get('Other') ?? []).map(s => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
