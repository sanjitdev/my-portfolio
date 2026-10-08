import { z } from 'zod';

/**
 * Personal info from the CV. Includes the home address field, which is
 * present in the source JSON but should NEVER be exposed to UI components.
 *
 * Use `PublicContactSchema` (defined below) for any prop that's rendered to
 * the user. The omission of `address` is enforced at the type level — TS will
 * refuse to compile code that tries to access it.
 */
export const PersonalInfoSchema = z.object({
  name: z.string().min(1),
  current_title: z.string().min(1),
  headline: z.string().min(1),
  location: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string(),
  linkedin: z.string().min(1),
  website: z.string().min(1),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;

/**
 * Privacy-safe contact subset. `address` is intentionally omitted.
 * Pass this type (not `PersonalInfo`) to any UI component that renders
 * contact info.
 */
export const PublicContactSchema = PersonalInfoSchema.omit({ address: true });

export type PublicContact = z.infer<typeof PublicContactSchema>;

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  duration: z.string().min(1),
  location: z.string().min(1),
  responsibilities: z.array(z.string().min(1)),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const EducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().optional(),
  program: z.string().optional(),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type Education = z.infer<typeof EducationSchema>;

export const LanguageSchema = z.object({
  language: z.string().min(1),
  proficiency: z.string().min(1),
});

export type Language = z.infer<typeof LanguageSchema>;

/**
 * Top-level CV schema. Validates every required field. Optional fields use
 * `.optional()` so the CV can grow without breaking the build.
 */
export const CvDataSchema = z.object({
  personal_information: PersonalInfoSchema,
  summary: z.string().min(1),
  top_skills: z.array(z.string().min(1)),
  languages: z.array(LanguageSchema),
  certifications: z.array(z.string().min(1)),
  honors_awards: z.array(z.string().min(1)),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
});

export type CvData = z.infer<typeof CvDataSchema>;
