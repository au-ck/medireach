import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import type { Teleconsultation } from "@/lib/types";
import {
  Activity,
  CalendarDays,
  Clock,
  MessageSquare,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Send,
  ShieldCheck,
  User,
  Video,
  VideoOff,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CallState = "idle" | "connecting" | "active" | "ended";

interface ChatMessage {
  id: number;
  sender: "you" | "doctor";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: "doctor",
    text: "Hello! I'm Dr. Nagesh Rao. How are you feeling today?",
    time: "09:31",
  },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function TeleconsultationPage() {
  const { t } = useTranslation();
  const [consultations, setConsultations] = useState<Teleconsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Teleconsultation | null>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    api.getTeleconsultations().then((data) => {
      if (!mounted) return;
      setConsultations(data);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const upcoming = consultations.filter(
    (c) => c.status === "scheduled" || c.status === "in-progress",
  );

  const startCall = (consultation: Teleconsultation) => {
    setActive(consultation);
    setCallState("connecting");
    setMessages(INITIAL_MESSAGES);
    setIsMuted(false);
    setIsCameraOn(true);
    setFeedback(t("teleconsultation.callStarted"));
    window.setTimeout(() => setCallState("active"), 1600);
  };

  const endCall = () => {
    setCallState("ended");
    setFeedback(t("teleconsultation.callEnded"));
  };

  const toggleMute = () => {
    setIsMuted((m) => {
      setFeedback(
        m ? t("teleconsultation.unmuted") : t("teleconsultation.muted"),
      );
      return !m;
    });
  };

  const toggleCamera = () => {
    setIsCameraOn((c) => {
      setFeedback(
        c
          ? t("teleconsultation.cameraDisabled")
          : t("teleconsultation.cameraEnabled"),
      );
      return !c;
    });
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "you", text, time: formatTime(new Date()) },
    ]);
    setDraft("");
    setFeedback(t("teleconsultation.messageSent"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const doctorInitials = active
    ? active.doctorName
        .replace("Dr. ", "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "DR";

  return (
    <div className="space-y-6" data-ocid="teleconsultation.page">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("teleconsultation.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("teleconsultation.subtitle")}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video call area */}
        <section
          className="lg:col-span-2"
          aria-label={t("teleconsultation.title")}
          data-ocid="teleconsultation.video_panel"
        >
          <Card className="overflow-hidden border-0 bg-gradient-subtle p-0">
            <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden bg-gradient-primary">
              {/* Decorative soft circles */}
              <div
                className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-white/10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-20 -right-10 size-64 rounded-full bg-white/10"
                aria-hidden="true"
              />

              {callState === "idle" && (
                <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center text-primary-foreground">
                  <span className="flex size-20 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/10">
                    <Video className="size-9" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold">
                      {t("teleconsultation.waitingRoom")}
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-primary-foreground/80">
                      {t("teleconsultation.waitingRoomDesc")}
                    </p>
                  </div>
                </div>
              )}

              {callState === "connecting" && (
                <div
                  className="relative z-10 flex flex-col items-center gap-4 px-6 text-center text-primary-foreground"
                  data-ocid="teleconsultation.connecting_state"
                >
                  <span className="flex size-20 animate-pulse items-center justify-center rounded-full bg-white/15 ring-4 ring-white/10">
                    <Activity className="size-9" aria-hidden="true" />
                  </span>
                  <p className="font-display text-lg font-semibold">
                    {t("teleconsultation.connecting")}
                  </p>
                </div>
              )}

              {callState === "active" && active && (
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center text-primary-foreground">
                  <Avatar className="size-28 ring-4 ring-white/25">
                    <AvatarFallback className="bg-white/20 text-2xl font-semibold text-primary-foreground">
                      {doctorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-display text-xl font-semibold">
                      {active.doctorName}
                    </p>
                    <div className="mt-1 flex items-center justify-center gap-2 text-sm text-primary-foreground/80">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full bg-emerald-300"
                          aria-hidden="true"
                        />
                        {t("teleconsultation.live")}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="size-4" aria-hidden="true" />
                        {t("teleconsultation.secureSession")}
                      </span>
                    </div>
                  </div>

                  {/* Self preview */}
                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-black/30 px-3 py-2 text-xs text-white backdrop-blur">
                    {isCameraOn ? (
                      <Video className="size-4" aria-hidden="true" />
                    ) : (
                      <VideoOff className="size-4" aria-hidden="true" />
                    )}
                    <span>{t("teleconsultation.you")}</span>
                  </div>
                </div>
              )}

              {callState === "ended" && (
                <div
                  className="relative z-10 flex flex-col items-center gap-4 px-6 text-center text-primary-foreground"
                  data-ocid="teleconsultation.ended_state"
                >
                  <span className="flex size-20 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/10">
                    <PhoneOff className="size-9" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-semibold">
                      {t("teleconsultation.callEnded")}
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-primary-foreground/80">
                      {t("teleconsultation.callEndedDesc")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Session controls */}
            <CardContent className="flex flex-wrap items-center justify-center gap-3 py-4">
              {callState === "idle" && (
                <Button
                  size="lg"
                  className="min-h-11 gap-2"
                  onClick={() => active && startCall(active)}
                  disabled={!active}
                  data-ocid="teleconsultation.start_call_button"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  {t("teleconsultation.startCall")}
                </Button>
              )}

              {callState === "connecting" && (
                <Button
                  size="lg"
                  variant="destructive"
                  className="min-h-11 gap-2"
                  onClick={endCall}
                  data-ocid="teleconsultation.cancel_call_button"
                >
                  <PhoneOff className="size-5" aria-hidden="true" />
                  {t("teleconsultation.endCall")}
                </Button>
              )}

              {callState === "active" && (
                <>
                  <Button
                    variant={isMuted ? "secondary" : "outline"}
                    size="lg"
                    className="min-h-11 gap-2"
                    onClick={toggleMute}
                    aria-pressed={isMuted}
                    aria-label={
                      isMuted
                        ? t("teleconsultation.unmute")
                        : t("teleconsultation.mute")
                    }
                    data-ocid="teleconsultation.mute_button"
                  >
                    {isMuted ? (
                      <MicOff className="size-5" aria-hidden="true" />
                    ) : (
                      <Mic className="size-5" aria-hidden="true" />
                    )}
                    {isMuted
                      ? t("teleconsultation.unmute")
                      : t("teleconsultation.mute")}
                  </Button>
                  <Button
                    variant={isCameraOn ? "outline" : "secondary"}
                    size="lg"
                    className="min-h-11 gap-2"
                    onClick={toggleCamera}
                    aria-pressed={isCameraOn}
                    aria-label={
                      isCameraOn
                        ? t("teleconsultation.cameraOff")
                        : t("teleconsultation.cameraOn")
                    }
                    data-ocid="teleconsultation.camera_button"
                  >
                    {isCameraOn ? (
                      <Video className="size-5" aria-hidden="true" />
                    ) : (
                      <VideoOff className="size-5" aria-hidden="true" />
                    )}
                    {isCameraOn
                      ? t("teleconsultation.cameraOff")
                      : t("teleconsultation.cameraOn")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="min-h-11 gap-2"
                    onClick={endCall}
                    data-ocid="teleconsultation.end_call_button"
                  >
                    <PhoneOff className="size-5" aria-hidden="true" />
                    {t("teleconsultation.endCall")}
                  </Button>
                </>
              )}

              {callState === "ended" && (
                <Button
                  size="lg"
                  className="min-h-11 gap-2"
                  onClick={() => setCallState("idle")}
                  data-ocid="teleconsultation.back_button"
                >
                  <CalendarDays className="size-5" aria-hidden="true" />
                  {t("common.back")}
                </Button>
              )}
            </CardContent>
          </Card>

          {feedback && (
            <output
              className="mt-3 block text-center text-sm font-medium text-primary"
              data-ocid="teleconsultation.feedback"
            >
              {feedback}
            </output>
          )}
        </section>

        {/* Chat panel */}
        <section
          aria-label={t("teleconsultation.chat")}
          data-ocid="teleconsultation.chat_panel"
        >
          <Card className="flex h-full flex-col p-0">
            <CardHeader className="border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <MessageSquare className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="font-display text-base">
                    {t("teleconsultation.chat")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {active ? active.doctorName : t("teleconsultation.doctor")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <p className="m-auto text-center text-sm text-muted-foreground">
                  {t("teleconsultation.emptyChat")}
                </p>
              ) : (
                messages.map((message) => {
                  const isYou = message.sender === "you";
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isYou ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                          isYou
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.text}
                        </p>
                        <p
                          className={`mt-1 text-[11px] ${
                            isYou
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </CardContent>

            <div className="border-t p-3">
              <div className="flex items-end gap-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("teleconsultation.chatPlaceholder")}
                  aria-label={t("teleconsultation.chatPlaceholder")}
                  className="min-h-11 resize-none"
                  rows={1}
                  data-ocid="teleconsultation.chat_input"
                />
                <Button
                  size="icon"
                  className="size-11 shrink-0"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                  aria-label={t("teleconsultation.send")}
                  data-ocid="teleconsultation.send_button"
                >
                  <Send className="size-5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Upcoming consultations */}
      <section
        aria-label={t("teleconsultation.upcoming")}
        data-ocid="teleconsultation.upcoming_section"
      >
        <div className="mb-3 flex items-center gap-2">
          <h2 className="font-display text-lg font-semibold">
            {t("teleconsultation.upcoming")}
          </h2>
          <Badge variant="secondary" className="rounded-full">
            {upcoming.length}
          </Badge>
        </div>

        {loading ? (
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            data-ocid="teleconsultation.loading_state"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl border bg-muted/50"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <Card
            className="border-dashed bg-gradient-subtle"
            data-ocid="teleconsultation.empty_state"
          >
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <CalendarDays className="size-6" aria-hidden="true" />
              </span>
              <p className="text-muted-foreground">
                {t("teleconsultation.noUpcoming")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((consultation, index) => {
              const isActive = active?.id === consultation.id;
              return (
                <Card
                  key={consultation.id}
                  className={`transition-smooth hover:shadow-md ${
                    isActive ? "ring-2 ring-primary" : ""
                  }`}
                  data-ocid={`teleconsultation.item.${index + 1}`}
                >
                  <CardHeader className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11">
                        <AvatarFallback className="bg-accent/15 text-accent">
                          <User className="size-5" aria-hidden="true" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <CardTitle className="truncate font-display text-base">
                          {consultation.patientName}
                        </CardTitle>
                        <CardDescription className="truncate text-xs">
                          {consultation.doctorName}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 px-5 pb-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-4" aria-hidden="true" />
                        {consultation.scheduledAt.slice(11, 16)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Activity className="size-4" aria-hidden="true" />
                        {consultation.durationMinutes}{" "}
                        {t("teleconsultation.minutes")}
                      </span>
                    </div>
                    <Button
                      variant={isActive ? "secondary" : "default"}
                      className="w-full gap-2"
                      onClick={() => startCall(consultation)}
                      data-ocid={`teleconsultation.join_button.${index + 1}`}
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {t("teleconsultation.joinCall")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
