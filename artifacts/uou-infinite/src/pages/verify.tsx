import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useVerifyCredential, getVerifyCredentialQueryKey } from "@workspace/api-client-react";
import { ShieldCheck, ShieldAlert, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const { token } = useParams<{ token: string }>();

  const { data: result, isLoading, isError } = useVerifyCredential(token ?? "", {
    query: {
      enabled: !!token,
      queryKey: getVerifyCredentialQueryKey(token ?? ""),
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0" />

      <div className="z-10 w-full max-w-lg mx-auto mt-20">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 w-4 h-4" /> Return to Hub
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Credential Verification Gateway</h1>
            <p className="text-sm text-muted-foreground mt-2">UOU Cryptographic Ledger</p>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-primary font-mono text-sm animate-pulse">Validating hash signature...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-destructive mb-2">Verification Failed</h2>
              <p className="text-muted-foreground text-center text-sm">
                The provided token is invalid, expired, or corrupted. Please request a new cryptographic proof.
              </p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              {result.valid ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary mb-6 shadow-[0_0_30px_rgba(100,255,218,0.3)]">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Authentic Credential</h2>
                  <p className="text-muted-foreground text-sm mb-8 font-mono truncate max-w-full">{result.blockchainHash}</p>

                  <div className="w-full space-y-4 text-sm">
                    {[
                      { label: "Scholar Name", value: result.studentName },
                      { label: "Scholar ID", value: result.studentId, mono: true },
                      { label: "Department", value: result.department },
                      { label: "Verified Skills", value: result.skills, accent: true },
                      { label: "Timestamp", value: new Date(result.verifiedAt).toLocaleString() },
                    ].map(({ label, value, mono, accent }) => (
                      <div
                        key={label}
                        className="flex justify-between p-3 rounded-lg bg-background border border-border"
                      >
                        <span className="text-muted-foreground">{label}</span>
                        <span
                          className={`font-medium text-right max-w-[200px] truncate ${
                            accent ? "text-primary" : "text-foreground"
                          } ${mono ? "font-mono" : ""}`}
                        >
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center border border-destructive mb-6 shadow-[0_0_30px_rgba(255,0,0,0.3)]">
                    <ShieldAlert className="w-10 h-10 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-bold text-destructive mb-1">Forged Credential</h2>
                  <p className="text-muted-foreground text-sm mb-8">This token did not pass cryptographic validation.</p>
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
