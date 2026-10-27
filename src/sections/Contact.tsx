import { useId, useState, type FormEvent } from "react";
import { site } from "@/data/site";
import { Section } from "@/components/ui/Section";
import { Arrow } from "@/components/ui/Button";

interface ContactProps {
  withForm?: boolean;
}

/** Web3Forms delivers the form to my inbox. Get a key at https://web3forms.com and set it in .env. */
const FORM_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const FORM_URL = "https://api.web3forms.com/submit";

const topics = ["Internship or job", "Freelance project", "Collaboration", "Something else"];

type Status = "idle" | "sending" | "sent" | "error";

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

    // Without a key there is no inbox to post to: hand the message to the visitor's mail app instead.
    if (!FORM_KEY) {
      window.location.href = mailtoFor(fields);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: `Portfolio: ${fields.topic} from ${fields.name}`,
          from_name: "Portfolio contact form",
          name: fields.name,
          email: fields.email,
          replyto: fields.email,
          topic: fields.topic,
          message: fields.message,
          botcheck: (form.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked ?? false,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || !data.success) throw new Error("Form service refused the message");
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

      {/* Honeypot: hidden from people, filled in by bots, rejected by the form service. */}
      <input type="checkbox" name="botcheck" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="contact-form__foot">
        <button type="submit" className="btn btn--accent" disabled={sending}>
          <span className="btn__inner">
            <span className="btn__label">{sending ? "Sending…" : FORM_KEY ? "Send message" : "Write the email"}</span>
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
          ) : FORM_KEY ? (
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
  const rows = [
    { label: "Email", text: site.email, href: `mailto:${site.email}` },
    ...site.socials.map((s) => ({ label: s.label, text: s.href.replace(/^https?:[/][/]/, ""), href: s.href })),
    { label: "Based in", text: `${site.location}, ${site.timezone}` },
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
              {r.href ? (
                <a className="contact__row" href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  <span className="small muted">{r.label}</span>
                  <span className="contact__value">{r.text}</span>
                  <span className="contact__go" aria-hidden="true">
                    <Arrow />
                  </span>
                </a>
              ) : (
                <div className="contact__row">
                  <span className="small muted">{r.label}</span>
                  <span className="contact__value">{r.text}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
