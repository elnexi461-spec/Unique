import { useAuth } from "@/lib/auth-context";
import { useGetStudentCredential, getGetStudentCredentialQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function StudentCredential() {
  const { user } = useAuth();
  const { data: cred, isLoading } = useGetStudentCredential(user?.id ?? 0, {
    query: {
      enabled: !!user?.id,
      queryKey: getGetStudentCredentialQueryKey(user?.id ?? 0),
    },
  });
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (cred) {
      navigator.clipboard.writeText(cred.credentialToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading)
    return <div className="text-center py-20 text-primary animate-pulse">Retrieving cryptographic ledger...</div>;
  if (!cred)
    return <div className="text-center py-20 text-muted-foreground">Credential not generated yet.</div>;

  const verifyUrl = `${window.location.origin}/verify/${cred.credentialToken}`;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Proof of Skill</h1>
        <p className="text-muted-foreground mt-1">Cryptographically verified academic passport</p>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="bg-card border-primary/50 shadow-[0_0_40px_rgba(100,255,218,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <CardContent className="p-8 flex flex-col items-center">
            <div className="mb-8 p-4 bg-white rounded-xl shadow-inner">
              <QRCodeSVG
                value={verifyUrl}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#0A192F"}
                level={"Q"}
                includeMargin={false}
              />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-1">{cred.name}</h2>
            <p className="text-primary font-medium mb-6">{cred.department}</p>

            <div className="w-full space-y-4 text-sm mb-8">
              <div className="flex justify-between p-3 rounded bg-background border border-border">
                <span className="text-muted-foreground">Scholar ID</span>
                <span className="font-mono text-foreground">{cred.studentId}</span>
              </div>
              <div className="flex justify-between p-3 rounded bg-background border border-border">
                <span className="text-muted-foreground">Verified Skills</span>
                <span className="font-medium text-primary text-right max-w-[200px] truncate">{cred.skills}</span>
              </div>
              <div className="flex justify-between p-3 rounded bg-background border border-border">
                <span className="text-muted-foreground">Issue Date</span>
                <span className="font-medium text-foreground">{new Date(cred.issuedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="w-full flex gap-3">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied Hash" : "Copy Token"}
              </Button>
              <Button
                onClick={() => window.open(verifyUrl, "_blank")}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> Public Gateway
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
