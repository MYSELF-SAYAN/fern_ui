import { FloatingNavbar } from "@/components/home/floating-navbar"
import { HeroSection } from "@/components/home/hero-section"
import { ShowcaseSection } from "@/components/home/showcase-section"
import { FooterSection } from "@/components/home/footer-section"

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#080808] text-neutral-900 dark:text-neutral-100 selection:bg-neutral-200 dark:selection:bg-neutral-800">
      {/* Sticky Floating Glassmorphic Navbar */}
      <FloatingNavbar />

      {/* 1. Minimal Hero */}
      <HeroSection />

      {/* 2. Components Showcase — Bento Grid */}
      <ShowcaseSection />

      {/* 3. Minimal Footer */}
      <FooterSection />
    </div>
  )
}
