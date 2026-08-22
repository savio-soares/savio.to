import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { MetaBlock } from "@/components/bio/MetaBlock";
import { ProjectWall } from "@/components/case-study/ProjectWall";
import { SocialLinks } from "@/components/social/SocialLinks";
import { TechStack } from "@/components/stack/TechStack";
import { ScrollGlobe } from "@/components/globe/ScrollGlobe";
import { ScrollProgressProvider } from "@/components/scroll/scroll-progress";
import { ProjectsHeading } from "@/components/case-study/ProjectsHeading";
import { FloatingCue } from "@/components/scroll/FloatingCue";
import { projects } from "@/content/projects";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // next-intl only opts a route into static rendering when every layout AND
  // page in the tree declares the locale; setting it on the layout alone
  // leaves this page server-rendered on demand.
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("hero");
  const tProjects = useTranslations("projects");
  const tStack = useTranslations("stack");

  return (
    <ScrollProgressProvider>
      <ScrollGlobe anchorId="globe-dock" />
      <FloatingNav />
      <FloatingCue targetId="projetos" label={tProjects("cue")} />
      <main className="flex flex-1 flex-col">
        {/* No min-height: pinning this to a fraction of the viewport meant
            hand-tuning a magic number every time the bio grew, and getting it
            wrong pushed the projects heading off the first screen. Letting the
            content set its own height makes the peek self-adjusting. pt clears
            the nav pill, which is fixed at every width and so reserves no
            space of its own. */}
        <section className="flex flex-col items-center gap-16 px-24 pt-105 pb-48 md:gap-32 md:pb-0">
          {/* Visually hidden: with the display line moved to the projects
              band, the page would otherwise ship without an h1. */}
          <h1 className="sr-only">{t("srTitle")}</h1>
          <SocialLinks />
          <p className="flex items-center gap-10 font-inter text-body-xs leading-body-xs text-silver">
            {t("age")}
            <span aria-hidden className="text-smoke">
              ·
            </span>
            <span className="flex items-center gap-6">
              <MapPin className="h-[16px] w-[16px] shrink-0" aria-hidden />
              {t("location")}
            </span>
          </p>
          {/* Two columns from md: side by side, the facts read as a data block
              rather than one more run of centred lines. */}
          <div className="grid w-full max-w-[860px] gap-24 border-t border-graphite pt-24 text-center md:pt-32 md:grid-cols-2 md:text-left">
            <MetaBlock label={t("education.label")}>
              <div>
                <p className="font-inter text-body-xs leading-body-xs text-bone">
                  {t("education.primary")}
                </p>
                <p className="font-inter text-ui-sm leading-body-xs text-fog">
                  {t("education.secondary")}
                </p>
              </div>
            </MetaBlock>
            <MetaBlock label={t("work.label")}>
              <div>
                <p className="font-inter text-body-xs leading-body-xs text-bone">
                  {t("work.primary")}
                </p>
                <p className="font-inter text-ui-sm leading-body-xs text-fog">
                  {t("work.secondary")}
                </p>
              </div>
            </MetaBlock>
            {/* Third item in a two-column grid, so it lands directly under
                the education block. */}
            <MetaBlock label={t("languages.label")}>
              <ul className="flex flex-col gap-4">
                {(t.raw("languages.items") as { name: string; level: string }[]).map(
                  (language) => (
                    <li
                      key={language.name}
                      className="font-inter text-body-xs leading-body-xs text-bone"
                    >
                      {language.name}{" "}
                      <span className="text-fog">— {language.level}</span>
                    </li>
                  ),
                )}
              </ul>
            </MetaBlock>
          </div>
          <div className="flex w-full max-w-[860px] flex-col gap-24 border-t border-graphite pt-24 text-center md:pt-32 md:text-left">
            <h2 className="font-ivy-presto italic text-subheading leading-subheading tracking-subheading text-paper-white">
              {tStack("title")}
            </h2>
            <TechStack />
          </div>
        </section>
        {/* No horizontal padding on the section — the wall runs full-bleed,
            so each child owns its own gutter. */}
        {/* scroll-mt, not more pt: the top padding decides where the heading
            peeks on the first screen, so it has to stay small. Clearing the
            nav pill is only needed when the cue jumps here, and that is what
            scroll margin is for — the two no longer fight each other. */}
        <section
          id="projetos"
          /* justify-center from md only: on desktop the band is now shorter
             than the viewport, and pinning it to the top left the slack as
             dead space under the wall. On phones the band is taller than the
             screen, where centring would just push the heading out of reach —
             there pt-105 keeps deciding where it peeks. */
          className="flex min-h-[100svh] scroll-mt-[100px] flex-col justify-start gap-24 pt-105 pb-24 md:justify-center md:gap-32 md:pt-24 md:pb-48"
        >
          <ProjectsHeading
            title={tProjects("title")}
            dockId="globe-dock"
            cue={{ href: "#projetos", label: tProjects("cue") }}
          />
          {/* Tags now ride in the wall's control row — see ProjectWall. */}
          <ProjectWall
            projects={projects}
            tags={tProjects.raw("tags") as string[]}
            prevLabel={tProjects("prev")}
            nextLabel={tProjects("next")}
          />
        </section>
      </main>
    </ScrollProgressProvider>
  );
}
