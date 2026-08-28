import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useTranslation } from "@/i18n/useTranslation";
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitState = "idle" | "sending" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactSection() {
  const { t } = useTranslation();
  const { isOnline } = useOnlineStatus();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<SubmitState>("idle");

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = t("landing.contact.required");
    if (!email.trim()) {
      next.email = t("landing.contact.required");
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = t("landing.contact.invalidEmail");
    }
    if (!message.trim()) next.message = t("landing.contact.required");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    if (!validate()) return;

    setState("sending");
    // Simulate a network round-trip; a real backend can be wired in later.
    window.setTimeout(() => {
      if (!isOnline) {
        setState("error");
        return;
      }
      setState("success");
      setName("");
      setEmail("");
      setMessage("");
    }, 900);
  }

  function handleSendAnother() {
    setState("idle");
    setErrors({});
  }

  return (
    <section className="bg-muted/30 py-16 md:py-24" data-ocid="landing.contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="secondary"
            className="rounded-full px-3 py-1 text-accent"
            data-ocid="landing.contact.badge"
          >
            {t("landing.contact.badge")}
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("landing.contact.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("landing.contact.subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-subtle">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display font-semibold text-foreground">
                  {t("landing.contact.email")}
                </p>
                <p className="text-sm text-muted-foreground">
                  care@medireach.example
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-subtle">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display font-semibold text-foreground">
                  {t("landing.contact.phone")}
                </p>
                <p className="text-sm text-muted-foreground">
                  +91 1800 123 4567
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border bg-card p-5 shadow-subtle">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display font-semibold text-foreground">
                  {t("landing.contact.location")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("landing.contact.locationValue")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-subtle sm:p-8 lg:col-span-3">
            {state === "success" ? (
              <div
                className="flex h-full flex-col items-center justify-center py-10 text-center"
                data-ocid="landing.contact.success_state"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="size-8" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                  {t("landing.contact.successTitle")}
                </h3>
                <p className="mt-2 max-w-sm text-muted-foreground">
                  {t("landing.contact.successBody")}
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full"
                  onClick={handleSendAnother}
                  data-ocid="landing.contact.send_another_button"
                >
                  {t("landing.contact.sendAnother")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">
                      {t("landing.contact.name")}
                    </Label>
                    <Input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("landing.contact.namePlaceholder")}
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? "contact-name-error" : undefined
                      }
                      data-ocid="landing.contact.name_input"
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        className="text-sm text-destructive"
                        data-ocid="landing.contact.name_error"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">
                      {t("landing.contact.email")}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("landing.contact.emailPlaceholder")}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "contact-email-error" : undefined
                      }
                      data-ocid="landing.contact.email_input"
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        className="text-sm text-destructive"
                        data-ocid="landing.contact.email_error"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="contact-message">
                    {t("landing.contact.message")}
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("landing.contact.messagePlaceholder")}
                    rows={5}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "contact-message-error" : undefined
                    }
                    data-ocid="landing.contact.message_input"
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="text-sm text-destructive"
                      data-ocid="landing.contact.message_error"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {state === "error" && (
                  <div
                    className="mt-5 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3"
                    data-ocid="landing.contact.error_state"
                  >
                    <p className="text-sm font-medium text-destructive">
                      {t("landing.contact.errorTitle")} —{" "}
                      {t("landing.contact.errorBody")}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={state === "sending"}
                  className="mt-6 h-12 w-full rounded-full bg-gradient-primary px-7 text-base shadow-subtle transition-smooth hover:shadow-elevated sm:w-auto"
                  data-ocid="landing.contact.submit_button"
                >
                  {state === "sending" ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      {t("landing.contact.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden="true" />
                      {t("landing.contact.submit")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
