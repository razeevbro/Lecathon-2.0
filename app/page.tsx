import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { buildSiteMetadata } from "@/lib/seo";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProblemThemes from "@/components/ProblemThemes";
import Partners from "@/components/Partners";
import Schedule from "@/components/Schedule";
import PrizesFAQ from "@/components/PrizesFAQ";
import Footer from "@/components/Footer";
import RegistrationBanner from "@/components/RegistrationBanner";
import StructuredData from "@/components/StructuredData";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return buildSiteMetadata(content.settings);
}

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <StructuredData settings={content.settings} faqs={content.faqs} />
      <main className="min-h-screen bg-[#0a0a0a]">
        <RegistrationBanner registration={content.registration} />
        <Navbar
          registrationThemes={content.registrationThemes}
          registration={content.registration}
        />
        <Hero
          registrationThemes={content.registrationThemes}
          participantsLabel={content.settings.participantsLabel}
          durationLabel={content.settings.durationLabel}
          prizePool={content.settings.prizePool}
          registrationDeadline={content.settings.registrationDeadline}
          registration={content.registration}
        />
        <About
          hackathonDate={content.settings.hackathonDate}
          venueName={content.settings.venueName}
          venueAddress={content.settings.venueAddress}
        />
        <ProblemThemes
          problemThemes={content.problemThemes}
          registrationThemes={content.registrationThemes}
          registration={content.registration}
        />
        <Partners sponsors={content.sponsors} />
        <Schedule
          lecaWeekSchedule={content.lecaWeekSchedule}
          hackathonSchedule={content.hackathonSchedule}
          scheduleDateLabel={content.settings.scheduleDateLabel}
          scheduleDay1Label={content.settings.scheduleDay1Label}
          scheduleDay2Label={content.settings.scheduleDay2Label}
        />
        <PrizesFAQ faqs={content.faqs} prizePool={content.settings.prizePool} />
        <Footer settings={content.settings} />
      </main>
    </>
  );
}
