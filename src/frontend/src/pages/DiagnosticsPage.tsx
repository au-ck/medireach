import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/i18n/useTranslation";
import { api } from "@/lib/api";
import { mockPatients } from "@/lib/mockData";
import type { DiagnosticResult } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CheckCircle2,
  ClipboardPlus,
  Clock,
  Eye,
  FlaskConical,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type StatusFilter = "all" | DiagnosticResult["status"];

const TEST_OPTIONS = [
  "Blood Glucose (Fasting)",
  "Hemoglobin",
  "ECG",
  "Peak Flow",
  "Blood Pressure",
  "Lipid Profile",
  "Urine Analysis",
  "Chest X-Ray",
];

const statusVariant: Record<
  DiagnosticResult["status"],
  "default" | "secondary" | "outline"
> = {
  pending: "outline",
  ready: "default",
  reviewed: "secondary",
};

export function DiagnosticsPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["diagnostics"],
    queryFn: api.getDiagnostics,
  });

  const [ordered, setOrdered] = useState<DiagnosticResult[]>([]);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const [orderOpen, setOrderOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [selected, setSelected] = useState<DiagnosticResult | null>(null);

  const [patient, setPatient] = useState("");
  const [test, setTest] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [orderedId, setOrderedId] = useState<string | null>(null);
  const [reviewedId, setReviewedId] = useState<string | null>(null);

  const allResults = useMemo(() => {
    const base = data ?? [];
    return [...ordered, ...base];
  }, [data, ordered]);

  const effectiveStatus = useCallback(
    (r: DiagnosticResult): DiagnosticResult["status"] =>
      reviewed.has(r.id) ? "reviewed" : r.status,
    [reviewed],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allResults.filter((r) => {
      const status = effectiveStatus(r);
      const matchesTab = activeTab === "all" || status === activeTab;
      const matchesSearch =
        q.length === 0 ||
        r.patientName.toLowerCase().includes(q) ||
        r.test.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [allResults, activeTab, search, effectiveStatus]);

  const counts = useMemo(() => {
    let pending = 0;
    let ready = 0;
    let reviewedCount = 0;
    for (const r of allResults) {
      const s = effectiveStatus(r);
      if (s === "pending") pending += 1;
      else if (s === "ready") ready += 1;
      else reviewedCount += 1;
    }
    return {
      total: allResults.length,
      pending,
      ready,
      reviewed: reviewedCount,
    };
  }, [allResults, effectiveStatus]);

  const handleOrder = () => {
    if (!patient || !test) return;
    const newResult: DiagnosticResult = {
      id: `D-${Date.now()}`,
      patientName: patient,
      test,
      result: "Pending analysis",
      date,
      status: "pending",
    };
    setOrdered((prev) => [newResult, ...prev]);
    setOrderedId(newResult.id);
    setPatient("");
    setTest("");
    setDate(new Date().toISOString().slice(0, 10));
    setOrderOpen(false);
  };

  const handleMarkReviewed = (r: DiagnosticResult) => {
    setReviewed((prev) => new Set(prev).add(r.id));
    setReviewedId(r.id);
  };

  const handleView = (r: DiagnosticResult) => {
    setSelected(r);
    setResultOpen(true);
  };

  const kpis = [
    {
      label: t("diagnostics.totalTests"),
      value: counts.total,
      icon: FlaskConical,
    },
    {
      label: t("diagnostics.pendingTests"),
      value: counts.pending,
      icon: Clock,
    },
    { label: t("diagnostics.readyTests"), value: counts.ready, icon: Activity },
    {
      label: t("diagnostics.reviewedTests"),
      value: counts.reviewed,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="font-display text-2xl font-semibold text-foreground"
            data-ocid="diagnostics.title"
          >
            {t("diagnostics.title")}
          </h1>
          <p
            className="mt-1 text-muted-foreground"
            data-ocid="diagnostics.subtitle"
          >
            {t("diagnostics.subtitle")}
          </p>
        </div>
        <Button
          onClick={() => setOrderOpen(true)}
          data-ocid="diagnostics.order_button"
        >
          <ClipboardPlus className="size-4" aria-hidden="true" />
          {t("diagnostics.orderNewTest")}
        </Button>
      </header>

      <section
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        aria-label={t("diagnostics.title")}
      >
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              className="bg-gradient-subtle"
              data-ocid={`diagnostics.kpi.${index + 1}`}
            >
              <CardContent className="flex items-center gap-3 px-5 py-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-2xl font-semibold text-foreground">
                    {kpi.value}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {kpi.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card data-ocid="diagnostics.results_card">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-display text-lg">
                {t("diagnostics.title")}
              </CardTitle>
              <CardDescription>{t("diagnostics.subtitle")}</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("diagnostics.searchPlaceholder")}
                className="pl-9"
                aria-label={t("common.search")}
                data-ocid="diagnostics.search_input"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as StatusFilter)}
            data-ocid="diagnostics.filter_tabs"
          >
            <TabsList>
              <TabsTrigger value="all" data-ocid="diagnostics.filter.all">
                {t("diagnostics.all")}
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                data-ocid="diagnostics.filter.pending"
              >
                {t("status.pending")}
              </TabsTrigger>
              <TabsTrigger value="ready" data-ocid="diagnostics.filter.ready">
                {t("status.ready")}
              </TabsTrigger>
              <TabsTrigger
                value="reviewed"
                data-ocid="diagnostics.filter.reviewed"
              >
                {t("status.reviewed")}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-4">
            {isLoading ? (
              <div className="space-y-3" data-ocid="diagnostics.loading_state">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : isError ? (
              <div
                className="flex flex-col items-center gap-2 py-10 text-center"
                data-ocid="diagnostics.error_state"
              >
                <p className="text-sm text-muted-foreground">
                  {t("common.error")}
                </p>
                <Button variant="outline" onClick={() => void refetch()}>
                  {t("common.retry")}
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col items-center gap-2 py-10 text-center"
                data-ocid="diagnostics.empty_state"
              >
                <FlaskConical
                  className="size-10 text-muted-foreground/40"
                  aria-hidden="true"
                />
                <p className="font-medium text-foreground">
                  {t("diagnostics.emptyTitle")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("diagnostics.emptyDesc")}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("diagnostics.patient")}</TableHead>
                    <TableHead>{t("diagnostics.test")}</TableHead>
                    <TableHead>{t("diagnostics.result")}</TableHead>
                    <TableHead>{t("diagnostics.date")}</TableHead>
                    <TableHead>{t("diagnostics.status")}</TableHead>
                    <TableHead className="text-right">
                      {t("diagnostics.action")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, index) => {
                    const status = effectiveStatus(r);
                    return (
                      <TableRow
                        key={r.id}
                        data-ocid={`diagnostics.row.${index + 1}`}
                      >
                        <TableCell className="font-medium text-foreground">
                          {r.patientName}
                        </TableCell>
                        <TableCell>{r.test}</TableCell>
                        <TableCell className="max-w-[12rem] truncate">
                          {r.result}
                        </TableCell>
                        <TableCell>{r.date}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant[status]}>
                            {t(`status.${status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(r)}
                              data-ocid={`diagnostics.view_button.${index + 1}`}
                            >
                              <Eye className="size-4" aria-hidden="true" />
                              {t("diagnostics.viewResult")}
                            </Button>
                            {status === "ready" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleMarkReviewed(r)}
                                data-ocid={`diagnostics.review_button.${index + 1}`}
                              >
                                <CheckCircle2
                                  className="size-4"
                                  aria-hidden="true"
                                />
                                {t("diagnostics.markReviewed")}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>

          {orderedId && (
            <div
              className="mt-4 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
              data-ocid="diagnostics.order_success"
            >
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>
                {t("diagnostics.orderSuccess")} —{" "}
                {t("diagnostics.orderSuccessDesc")}
              </span>
            </div>
          )}
          {reviewedId && (
            <div
              className="mt-4 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm font-medium text-success"
              data-ocid="diagnostics.review_success"
            >
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
              <span>
                {t("diagnostics.reviewedSuccess")} —{" "}
                {t("diagnostics.reviewedSuccessDesc")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent data-ocid="diagnostics.order_modal">
          <DialogHeader>
            <DialogTitle>{t("diagnostics.orderDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("diagnostics.orderDialogDesc")}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOrder();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="diag-patient">
                {t("diagnostics.selectPatient")}
              </Label>
              <Select value={patient} onValueChange={setPatient}>
                <SelectTrigger
                  id="diag-patient"
                  className="w-full"
                  data-ocid="diagnostics.order.patient_select"
                >
                  <SelectValue placeholder={t("diagnostics.selectPatient")} />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!patient && (
                <p className="text-xs text-destructive">
                  {t("diagnostics.required")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="diag-test">{t("diagnostics.selectTest")}</Label>
              <Select value={test} onValueChange={setTest}>
                <SelectTrigger
                  id="diag-test"
                  className="w-full"
                  data-ocid="diagnostics.order.test_select"
                >
                  <SelectValue placeholder={t("diagnostics.selectTest")} />
                </SelectTrigger>
                <SelectContent>
                  {TEST_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!test && (
                <p className="text-xs text-destructive">
                  {t("diagnostics.required")}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="diag-date">{t("diagnostics.date")}</Label>
              <Input
                id="diag-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="diagnostics.order.date_input"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOrderOpen(false)}
                data-ocid="diagnostics.order.cancel_button"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!patient || !test}
                data-ocid="diagnostics.order.submit_button"
              >
                {t("diagnostics.orderSubmit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent data-ocid="diagnostics.result_modal">
          <DialogHeader>
            <DialogTitle>{t("diagnostics.resultDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("diagnostics.resultDialogDesc")}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <FlaskConical className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold text-foreground">
                    {selected.test}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {selected.patientName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("diagnostics.result")}
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {selected.result}
                  </p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">
                    {t("diagnostics.date")}
                  </p>
                  <p className="mt-1 font-medium text-foreground">
                    {selected.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <ShieldCheck
                  className="size-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                {t("privacy.authorizedAccess")}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResultOpen(false)}
              data-ocid="diagnostics.result.close_button"
            >
              {t("common.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
