import { MetadataRoute } from "next";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

async function safeFetch(path) {
  try {
    const response = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const payload = await response.json();
    return payload?.data ?? payload ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/about", "/services", "/portfolio", "/contact"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const [services, portfolios, pages] = await Promise.all([
    safeFetch("/services"),
    safeFetch("/portfolios"),
    safeFetch("/pages"),
  ]);

  const serviceRoutes = (Array.isArray(services) ? services : []).map((item) => ({
    url: `${siteUrl}/services/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
  }));

  const portfolioRoutes = (Array.isArray(portfolios) ? portfolios : []).map((item) => ({
    url: `${siteUrl}/portfolio/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
  }));

  const pageRoutes = (Array.isArray(pages) ? pages : []).map((item) => ({
    url: `${siteUrl}/p/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes, ...pageRoutes];
}
