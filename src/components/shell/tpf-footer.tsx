import Image from "next/image";

/**
 * Footer from the main Product (Un)Conference '26 page
 * (theproductfolks.com/product-unconference-2026), rebuilt on this app's
 * tokens: same logo, three link columns and Creative Partners row, but on
 * the dark green with cream text instead of the main site's crimson.
 *
 * Every link is absolute. TPF pages open with target="_top" so they replace
 * the Webflow page when this app is embedded in its iframe; outside sites
 * open in a new tab. Mail links carry no target.
 */
type FooterLink = { label: string; href: string; kind: "tpf" | "external" | "mail" };

const TPF_SITE = "https://www.theproductfolks.com";

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Previous Editions",
    links: [
      { label: "2023", href: `${TPF_SITE}/product-unconference-2023`, kind: "tpf" },
      { label: "2024", href: `${TPF_SITE}/product-unconference-2024`, kind: "tpf" },
      { label: "2025", href: `${TPF_SITE}/product-unconference-2025`, kind: "tpf" },
    ],
  },
  {
    title: "Passes",
    links: [
      { label: "Community Pass", href: `${TPF_SITE}/unconference-26-community-form`, kind: "tpf" },
      { label: "Reserve Pass", href: `${TPF_SITE}/unconference-26-reserve-form`, kind: "tpf" },
      { label: "Tribe Pass", href: `${TPF_SITE}/unconference-26-tribe-form`, kind: "tpf" },
    ],
  },
  {
    title: "Partner with us",
    links: [
      { label: "Join as a Sponsor", href: "mailto:team@theproductfolks.com", kind: "mail" },
      { label: "Apply as a Speaker", href: "mailto:team@theproductfolks.com", kind: "mail" },
      {
        label: "Join as a Volunteer",
        href: "https://docs.google.com/forms/d/1Uo9jHU-NrHNYhlfL5nJ1b6uNl240FDgB4CgK73Qtwds/viewform",
        kind: "external",
      },
    ],
  },
];

const CREATIVE = [
  { name: "Lemon Fizz Studio", href: "https://www.lemonfizz.studio/", src: "/brand/footer/lemonfizz-white.png", w: 558, h: 107, cls: "h-[26px]" },
  { name: "Spacekayak", href: "https://www.spacekayak.xyz/", src: "/brand/footer/spacekayak-white.png", w: 359, h: 42, cls: "h-[17px]" },
];

function linkProps(kind: FooterLink["kind"]) {
  if (kind === "tpf") return { target: "_top" };
  if (kind === "external") return { target: "_blank", rel: "noopener" };
  return {};
}

export function TpfFooter() {
  return (
    <footer className="bg-deep text-ink">
      <div className="frame py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <a href={`${TPF_SITE}/`} target="_top" aria-label="The Product Folks" className="inline-block">
              <Image
                src="/brand/footer/tpf-logo-white.png"
                alt="The Product Folks"
                width={1200}
                height={703}
                className="h-auto w-[120px]"
              />
            </a>
          </div>
          <nav aria-label="Product (Un)Conference" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:col-span-7">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-ink">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-1">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...linkProps(l.kind)}
                        className="inline-flex min-h-11 items-center text-[15px] md:min-h-9 text-muted transition-colors duration-200 ease-soft hover:text-ink"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-rule pt-8 md:mt-20">
          <p className="text-[14px] text-muted">Creative Partners</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {CREATIVE.map((c) => (
              <li key={c.name}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  className="block opacity-80 transition-opacity duration-200 ease-soft hover:opacity-100"
                >
                  <Image src={c.src} alt={c.name} width={c.w} height={c.h} className={`${c.cls} w-auto`} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
