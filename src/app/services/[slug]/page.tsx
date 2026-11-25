import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EXPERTISE_LIST, getExpertiseBySlug } from "@/config/expertise";
import ServiceDetailClient from "./ServiceDetailClient";

export function generateStaticParams() {
  return EXPERTISE_LIST.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getExpertiseBySlug(slug);

  if (!service) {
    return { title: "Service Not Found | Antor Creative Studio" };
  }

  return {
    title: `${service.en.title} | Antor Creative Studio`,
    description: service.en.tagline,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = EXPERTISE_LIST.findIndex((item) => item.slug === slug);

  if (index === -1) {
    notFound();
  }

  const service = EXPERTISE_LIST[index];
  const nextService = EXPERTISE_LIST[(index + 1) % EXPERTISE_LIST.length];

  return <ServiceDetailClient service={service} nextService={nextService} />;
}
