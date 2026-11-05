import { useId, useState, type FormEvent } from "react";
import { site } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { SocialIcon } from "@/components/ui/SocialIcon";

interface ContactProps {
  withForm?: boolean;
}

/**
 * EmailJS delivers the form to my inbox using the HTML template in docs/email-templates/.
 * The three IDs come from the EmailJS dashboard and live in .env (see .env.example).
 */
const EMAILJS = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
};
const FORM_READY = Boolean(EMAILJS.service && EMAILJS.template && EMAILJS.publicKey);
const FORM_URL = "https://api.emailjs.com/api/v1.0/email/send";

const topics = ["Internship or job", "Freelance project", "Collaboration", "Something else"];

type Status = "idle" | "sending" | "sent" | "error" | "invalid" | "wait";

/** Browser-side limits. They stop accidents and casual abuse; EmailJS enforces the real limits (see docs/DEPLOYMENT.md). */
const COOLDOWN_MS = 60_000;
const COOLDOWN_KEY = "contact-last-sent";
const EMAIL_PATTERN = /^[^\s@<>"',;:()]+@[^\s@<>"',;:()]+\.[^\s@<>"',;:()]+$/;

const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

const coolingDown = () => {
  try {
    return Date.now() - Number(localStorage.getItem(COOLDOWN_KEY) ?? 0) < COOLDOWN_MS;
  } catch {
    return false;
  }
};

const startCooldown = () => {
  try {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
  } catch {
    // Storage blocked: the form still works, just without the cooldown.
  }
};

interface Fields {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const empty: Fields = { name: "", email: "", topic: topics[0], message: "" };

const mailtoFor = (f: Fields) =>
  `mailto:${site.email}?subject=${encodeURIComponent(`${f.topic}: ${f.name || "hello"}`)}&body=${encodeURIComponent(
    `${f.message}\n\n${f.name}${f.email ? ` <${f.email}>` : ""}`,
  )}`;

function ContactForm() {
  const id = useId();
  const [fields, setFields] = useState<Fields>(empty);
  const [status, setStatus] = useState<Status>("idle");
  const set = (key: keyof Fields) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    // Not configured: hand the message to the visitor's mail app instead.
    if (!FORM_READY) {
      window.location.href = mailtoFor(fields);
      return;
    }

    // Honeypot ticked means a bot: act as if it worked, send nothing.
    if ((form.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked) {
      setStatus("sent");
      return;
    }

    const name = oneLine(fields.name);
    const email = fields.email.trim();
    const message = fields.message.trim();
    if (!name || !EMAIL_PATTERN.test(email) || message.length < 10 || !topics.includes(fields.topic)) {
      setStatus("invalid");
      return;
    }

    if (coolingDown()) {
      setStatus("wait");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          service_id: EMAILJS.service,
          template_id: EMAILJS.template,
          user_id: EMAILJS.publicKey,
          template_params: {
            from_name: name,
            from_email: email,
            reply_to: email,
            topic: fields.topic,
            message,
            sent_at: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
          },
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      startCooldown();
      setStatus("sent");
      setFields(empty);
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="contact-form contact-form--done" role="status">
        <span className="contact-form__tick" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="contact-form__title">Message sent</p>
        <p className="muted">Thanks for reaching out. It is in my inbox, and I will reply to the email you gave.</p>
        <button type="button" className="work-link" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate aria-label="Contact form" data-reveal>
      <div className="contact-form__head">
        <p className="contact-form__title">Send me a message</p>
        <p className="small muted">Every field is required. I reply by email.</p>
      </div>

      <div className="contact-form__row">
        <label className="field" htmlFor={`${id}-name`}>
          <span className="field__label">Name</span>
          <input
            id={`${id}-name`}
            name="name"
            value={fields.name}
            onChange={set("name")}
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Your full name"
          />
        </label>
        <label className="field" htmlFor={`${id}-email`}>
          <span className="field__label">Email</span>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            value={fields.email}
            onChange={set("email")}
            autoComplete="email"
            required
            maxLength={200}
            placeholder="you@company.com"
          />
        </label>
      </div>

      <fieldset className="field">
        <legend className="field__label">What is it about?</legend>
        <div className="topics">
          {topics.map((t) => (
            <label key={t} className="topic">
              <input type="radio" name="topic" value={t} checked={fields.topic === t} onChange={set("topic")} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field" htmlFor={`${id}-message`}>
        <span className="field__label">Message</span>
        <textarea
          id={`${id}-message`}
          name="message"
          value={fields.message}
          onChange={set("message")}
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Tell me about the role, the project or the idea, and any timeline."
        />
      </label>

      {/* Honeypot: hidden from people, ticked by bots, checked in onSubmit. */}
      <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="contact-form__foot">
        <button type="submit" className="btn btn--accent" disabled={sending}>
          <span className="btn__inner">
            <span className="btn__label">{sending ? "Sending…" : FORM_READY ? "Send message" : "Write the email"}</span>
            <span className="btn__icon">
              <Arrow />
            </span>
          </span>
        </button>
        <p className="small muted" aria-live="polite">
          {status === "error" ? (
            <span className="contact-form__error">
              The message did not go through.{" "}
              <a href={mailtoFor(fields)}>Send it from your email app instead</a>.
            </span>
          ) : status === "invalid" ? (
            <span className="contact-form__error">Please check your name, email and message.</span>
          ) : status === "wait" ? (
            <span className="contact-form__error">Please wait a minute before sending another message.</span>
          ) : FORM_READY ? (
            "Your details are only used to reply to you."
          ) : (
            "This opens your email app with the message filled in."
          )}
        </p>
      </div>
    </form>
  );
}

/** The ways to reach me, beside a form that lands straight in my inbox. */
export function Contact({ withForm = true }: ContactProps) {
  const rows: { label: string; text: string; href?: string; copy?: boolean; flag?: string }[] = [
    { label: "Email", text: site.email, href: `mailto:${site.email}`, copy: true },
    ...site.socials.map((s) => ({ label: s.label, text: s.href.replace(/^https?:[/][/](www[.])?/, "").replace(/[/]$/, "").replace("/in/", "/in/​"), href: s.href })),
    { label: "Based in", text: `${site.location}, ${site.timezone}`, flag: site.flag },
  ];

  return (
    <Section
      id="contact"
      kanji="連絡"
      kanjiMeaning="renraku: contact"
      title={
        <>
          Let&rsquo;s build
          <br />
          something
        </>
      }
      intro={`${site.availability}. Tell me about a role, a project or an idea.`}
      className="contact"
    >
      <div className={`contact__grid ${withForm ? "" : "contact__grid--solo"}`}>
        {withForm && <ContactForm />}

        <ul className="contact__rows">
          {rows.map((r) => (
            <li key={r.label} data-reveal>
              {r.copy ? (
                <div className="contact__row contact__row--copy">
                  <span className="small muted">{r.label}</span>
                  <a className="contact__value contact__mail" href={r.href}>
                    {r.text}
                  </a>
                  <CopyEmail />
                </div>
              ) : r.href ? (
                <a className="contact__row" href={r.href} target="_blank" rel="noreferrer">
                  <span className="contact__label small muted">
                    <SocialIcon name={r.label} />
                    {r.label}
                  </span>
                  <span className="contact__value">{r.text}</span>
                  <span className="contact__go" aria-hidden="true">
                    <Arrow />
                  </span>
                </a>
              ) : (
                <div className="contact__row">
                  <span className="small muted">{r.label}</span>
                  <span className="contact__value">
                    {r.flag && <img className="flag" src={r.flag} alt="" width={22} height={11} />}
                    {r.text}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
