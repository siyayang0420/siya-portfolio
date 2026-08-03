import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { projects, getProject, BRAVO_SLUG } from '@/content/projects';
import { cn } from '@/lib/cn';
import { BravoActs } from '@/components/work/sections/BravoActs';
import { ScrollLink } from '@/components/ui/ScrollLink';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Next 15 hands `params` in as a Promise; the Next 14 source took it as a
// plain object, so both entry points are async here.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Not found' };
  return {
    title: `${project.title} — Siya`,
    description: project.heading,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    // The landing sets a dark body; this route is a light document, so it
    // carries its own ground rather than flipping the global.
    <main className="min-h-screen bg-[#f8f8f8] font-light text-[#0a0a0a]">
      {/* Hero — inset so the side rulers stay visible at the page edges. */}
      <div className="mt-[61px] px-2.5 md:px-11">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: '58vh', background: project.heroBg }}
        >
          <div
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'max-w-[calc(100%-32px)] text-center',
              'font-display tracking-[0.12em]',
              'text-[clamp(28px,5.5vw,72px)]',
              project.imgTitleDark
                ? 'text-black/55'
                : 'text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.4)]',
            )}
          >
            {project.imgTitle}
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto pt-12 pb-24 px-4 md:px-0">
        <div className="text-[14px] tracking-[0.18em] uppercase text-muted mb-[18px]">
          <span>{project.breadcrumb}</span>
        </div>
        <h1 className="font-semibold text-[clamp(28px,3vw,32px)]  mb-6">
          {project.heading}
        </h1>
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] tracking-[0.1em] uppercase text-neutral-500 border-neutral-300 border border-line px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        {project.overview && (
          <div>
            <div className="text-[12px] tracking-[0.14em] uppercase text-muted mb-3">
              TL;DR
            </div>
            {project.slug === BRAVO_SLUG ? (
              <p className="text-[16px] text-ink">
                Bravo is a QR-based payments and dining rewards app operating
                across a network of restaurant partners in Metro Vancouver. The
                rewards system originally consisted of 4 separate mechanisms,
                each with its own logic.{' '}
                <strong className="font-bold">
                  I led the redesign to consolidate them into a single scalable
                  model
                </strong>
                : $1 in cashback equals $1 toward a future meal — creating a
                system that worked for users, marketing, finance, and the
                business at the same time.
              </p>
            ) : (
              <p className="text-[16px] text-ink">{project.overview}</p>
            )}
            {project.slug === BRAVO_SLUG && (
              <div className="flex flex-wrap gap-3 mt-6">
                <ScrollLink
                  href="#prototype-demo"
                  className="inline-flex items-center gap-2 text-[14px] tracking-[0.1em] text-regular underline underline-offset-4 hover:text-muted transition-colors"
                >
                  View BEFORE demo
                  {/* <span aria-hidden="true">↓</span> */}
                </ScrollLink>
                <ScrollLink
                  href="#admin-demo"
                  className="inline-flex items-center gap-2 text-[14px] tracking-[0.1em]  text-regular underline underline-offset-4 hover:text-muted transition-colors"
                >
                  View AFTER demo
                  {/* <span aria-hidden="true">↓</span> */}
                </ScrollLink>
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-line pt-8 mt-8 gap-6">
          <div>
            <div className="text-[12px] tracking-[0.14em] uppercase text-muted mb-2">
              Role
            </div>
            <div className="font-display text-[14px] tracking-[0.04em]">
              {project.role}
            </div>
          </div>
          <div>
            <div className="text-[12px] tracking-[0.14em] uppercase text-muted mb-2">
              Year
            </div>
            <div className="font-display text-[14px] tracking-[0.04em]">
              {project.year}
            </div>
          </div>
          <div>
            <div className="text-[12px] tracking-[0.14em] uppercase text-muted mb-2">
              Collaborators
            </div>
            <div className="font-display text-[14px] tracking-[0.04em]">
              {project.collaborators}
            </div>
          </div>
        </div>
        {project.slug === BRAVO_SLUG && <BravoActs />}
      </div>
    </main>
  );
}
