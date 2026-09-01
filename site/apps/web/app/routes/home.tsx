import { useRouteLoaderData } from "react-router";

import {
  CallToAction,
  ControlPlanesSection,
  Deliverables,
  Hero,
  HowItWorks,
  NewEra,
  Outcome,
  WhyGovOps,
} from "~/features/marketing/sections";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, absoluteUrl } from "~/lib/site";

export function meta() {
  const title = `${SITE_NAME}: ${SITE_TAGLINE}`;
  return [
    { title },
    { name: "description", content: SITE_DESCRIPTION },
    { property: "og:title", content: title },
    { property: "og:description", content: SITE_DESCRIPTION },
    { property: "og:url", content: absoluteUrl("/") },
    { tagName: "link", rel: "canonical", href: absoluteUrl("/") },
  ];
}

export default function Home() {
  const root = useRouteLoaderData<{ version: string | null }>("root");

  return (
    <>
      <Hero version={root?.version ?? null} />
      <WhyGovOps />
      <NewEra />
      <ControlPlanesSection />
      <Outcome />
      <HowItWorks />
      <Deliverables />
      <CallToAction />
    </>
  );
}
