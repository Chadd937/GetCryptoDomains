"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ChevronRight,
  Key,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SessionResponse = {
  authenticated?: boolean;
  verified?: boolean;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Authentication request failed.";
}

export function AuthFlow({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [step, setStep] = useState<"terms" | "request" | "verify">("terms");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const response = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });
        const session = response.ok
          ? (await response.json() as SessionResponse)
          : null;

        if (!cancelled && session?.authenticated && session.verified) {
          setIsOpen(false);
          onAuthenticated();
          return;
        }
      } catch {
        // The login form remains available if the session check is offline.
      }

      if (!cancelled && localStorage.getItem("unlovable_terms_accepted") === "true") {
        setStep("request");
      }
    }

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, [onAuthenticated]);

  const handleAcceptTerms = () => {
    localStorage.setItem("unlovable_terms_accepted", "true");
    setStep("request");
  };

  const handleRequestCode = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/email/request", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Failed to request code");
      }
      setStep("verify");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/email/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Invalid code");
      }

      const sessionResponse = await fetch("/api/auth/session", {
        credentials: "include",
        cache: "no-store",
      });
      const session = sessionResponse.ok
        ? (await sessionResponse.json() as SessionResponse)
        : null;
      if (!session?.authenticated || !session.verified) {
        throw new Error("Your code was accepted, but the session could not be confirmed. Please try again.");
      }

      setIsOpen(false);
      onAuthenticated();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-background border-primary/20 text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center">
            {step === "terms" ? "The Pact" : "Conjure Your Identity"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {step === "terms"
              ? "Before you enter the workbench, you must agree to the terms of the void."
              : "Enter your email to receive a summoning code."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          {step === "terms" && (
            <div className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-lg text-xs leading-relaxed max-h-60 overflow-y-auto border border-primary/10">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="size-3 text-primary" /> Terms of Service
                </h4>
                <p>1. You agree that the creations summoned here are for creative exploration.</p>
                <p className="mt-2">2. You will not use Unlovable to generate malicious code or harmful content.</p>
                <p className="mt-2">3. You acknowledge that the AI is powered by your own Cloudflare account and quota.</p>
                <p className="mt-2">4. Unlovable is provided "as is" in the haunted gardens of the web.</p>
              </div>
              <Button className="w-full gap-2" onClick={handleAcceptTerms}>
                I Accept the Pact <ChevronRight className="size-4" />
              </Button>
            </div>
          )}

          {step === "request" && (
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-10 bg-secondary/50 border-primary/20"
                  placeholder="email@domain.com"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="size-3" /> {error}
                </div>
              )}
              <Button
                className="w-full gap-2"
                onClick={handleRequestCode}
                disabled={loading || !email.trim()}
              >
                {loading ? "Summoning..." : "Send Code"} <ChevronRight className="size-4" />
              </Button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-4">
              <div className="relative">
                <Key className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  className="pl-10 bg-secondary/50 border-primary/20"
                  placeholder="6-digit code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-xs text-destructive">
                  <AlertCircle className="size-3" /> {error}
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-xs"
                  onClick={() => setStep("request")}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  className="flex-2 gap-2"
                  onClick={handleVerifyCode}
                  disabled={loading || code.length !== 6}
                >
                  {loading ? "Verifying..." : "Awaken"} <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
