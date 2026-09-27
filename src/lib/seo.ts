import type { Metadata } from "next"
import { components } from "@/lib/components"
import {
  SITE_ALT_NAMES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_REPO,
  SITE_URL,
} from "@/lib/site"

export const SITE_KEYWORDS = [
  "fern ui",
  "fernui",
  "fern-ui",
  "react components",
  "next.js components",
  "shadcn registry",
  "shadcn components",
  "animated ui components",
  "framer motion components",
  "motion react",
  "tailwind css components",
  "free ui components",
  "copy paste components",
  "ui component library",
  "orbit globe",
  "focus slider",
  "grid zoom strip",
  "mobbin stats reveal",
]

export function componentPageMetadata(href: string): Metadata {
  const item = components.find((c) => c.href === href || href.endsWith(c.slug))
  if (!item) return {}

  const name = item.name.toLowerCase()

  return {
    title: `${item.name} — ${item.subtitle || "Animated React Component"}`,
    description: item.description,
    keywords: [
      name,
      `${name} react`,
      `${name} component`,
      `animated ${name}`,
      `${name} shadcn`,
      ...SITE_KEYWORDS,
    ],
    alternates: {
      canonical: item.href,
    },
    openGraph: {
      title: `${item.name} | ${SITE_NAME}`,
      description: item.description,
      url: item.href,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.name} | ${SITE_NAME}`,
      description: item.description,
    },
  }
}

export function componentJsonLd(href: string) {
  const item = components.find((c) => c.href === href || href.endsWith(c.slug))
  if (!item) return null

  const url = `${SITE_URL}${item.href}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Components",
            item: `${SITE_URL}/components`,
          },
          { "@type": "ListItem", position: 3, name: item.name, item: url },
        ],
      },
      {
        "@type": "SoftwareSourceCode",
        name: item.name,
        description: item.description,
        url,
        codeRepository: `${SITE_REPO}/blob/main/${item.filePath}`,
        programmingLanguage: "TypeScript",
        runtimePlatform: "React",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        license: `${SITE_REPO}/blob/main/LICENSE`,
      },
    ],
  }
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_ALT_NAMES,
        url: SITE_URL,
        sameAs: [SITE_REPO],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: SITE_ALT_NAMES,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  }
}
