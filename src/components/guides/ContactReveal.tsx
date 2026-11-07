"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { revealGuideContact } from "@/app/guide-connect/actions";
import type { Guide, GuideContact } from "@/lib/types";

const METHOD_LABELS: Record<Guide["contactMethods"][number], string> = {
  phone: "phone",
  whatsapp: "WhatsApp",
  email: "email",
};

/**
 * wa.me wants the full international number with no "+". Nepali mobile
 * numbers are written locally as ten digits starting with 9 ("98xxxxxxxx"),
 * so those get the 977 country code.
 */
function whatsappHref(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("9")) digits = `977${digits}`;
  return `https://wa.me/${digits}`;
}

const linkClass =
  "flex items-center justify-between gap-4 border-t border-line py-4 text-sm text-ink transition-colors hover:text-accent-ink";

/**
 * Contact details stay off the prerendered page. Signed-in visitors fetch
 * them through a server action; everyone else is asked to sign in first.
 */
export function ContactReveal({ guide }: { guide: Pick<Guide, "id" | "name" | "contactMethods"> }) {
  const { status } = useSession();
  const [contact, setContact] = useState<GuideContact>();
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  const methods = guide.contactMethods.map((m) => METHOD_LABELS[m]);
  const firstName = guide.name.split(" ")[0];

  if (contact) {
    return (
      <div>
        {contact.phone && (
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className={linkClass}>
            <span className="text-muted">Call</span>
            <span className="font-medium">{contact.phone}</span>
          </a>
        )}
        {contact.phone && contact.whatsapp && (
          <a href={whatsappHref(contact.phone)} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <span className="text-muted">WhatsApp</span>
            <span className="font-medium">
              Message {firstName} <span aria-hidden>↗</span>
            </span>
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className={linkClass}>
            <span className="text-muted">Email</span>
            <span className="truncate font-medium">{contact.email}</span>
          </a>
        )}
        <p className="border-t border-line pt-4 text-xs leading-relaxed text-muted">
          Say you found {firstName} on Drishya, and agree on the route, dates and price before
          you set out.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-muted">
        {firstName} can be reached by {methods.join(" or ")}. Contact details are shown to
        signed-in travelers only, to keep guides&apos; numbers away from spam.
      </p>
      {status === "authenticated" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(undefined);
              const result = await revealGuideContact(guide.id);
              if (result.ok) setContact(result.contact);
              else setError(result.error);
            })
          }
          className="w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Loading…" : "Show contact details"}
        </button>
      ) : (
        <Link
          href={`/signin?callbackUrl=${encodeURIComponent(`/guide-connect/${guide.id}`)}`}
          aria-disabled={status === "loading"}
          className="block w-full rounded-full bg-ink px-6 py-3 text-center text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          Sign in to contact {firstName}
        </Link>
      )}
      {error && (
        <p role="alert" className="text-sm text-accent-ink">
          {error}
        </p>
      )}
    </div>
  );
}
