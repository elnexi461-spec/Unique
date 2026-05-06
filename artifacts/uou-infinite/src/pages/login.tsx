import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLogin } from "@workspace/api-client-react";
import { setAuthToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2, Lock, Mail } from "lucide-react";

const loginSchema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast }        = useToast();
  const loginMutation    = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await loginMutation.mutateAsync({ data: values });
      setAuthToken(res.token);
      toast({ title: "Authorization granted", description: "Welcome back, Scholar." });
      const role = res.user.role;
      setLocation(role === "founder" ? "/founder" : `/${role}`);
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      toast({
        title: "Access denied",
        description: apiErr?.data?.error ?? "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "hsl(222 72% 6%)" }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(29,78,216,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width:  3 + (i % 3),
            height: 3 + (i % 3),
            left:   `${10 + i * 15}%`,
            top:    `${20 + (i % 3) * 25}%`,
            background: i % 2 === 0 ? "rgba(59,130,246,0.4)" : "rgba(245,158,11,0.3)",
          }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md z-10 px-4"
      >
        {/* Glassmorphism card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background:   "rgba(8,18,50,0.75)",
            border:       "1px solid rgba(59,130,246,0.25)",
            boxShadow:    "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(59,130,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Top gradient bar */}
          <div
            className="h-0.5 w-full"
            style={{ background: "linear-gradient(90deg, transparent, #3B82F6 40%, #60A5FA 60%, transparent)" }}
          />

          <div className="p-8">
            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                animate={{ boxShadow: ["0 0 12px rgba(59,130,246,0.4)", "0 0 28px rgba(59,130,246,0.7)", "0 0 12px rgba(59,130,246,0.4)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mb-4 rounded-2xl p-1"
                style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)" }}
              >
                <img
                  src="/uou-logo.png"
                  alt="Unique Open University"
                  className="w-14 h-14 object-contain"
                  style={{ filter: "drop-shadow(0 0 10px rgba(59,130,246,0.5))" }}
                />
              </motion.div>

              <div className="text-center">
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1"
                  style={{ color: "rgba(96,165,250,0.7)" }}>
                  Unique Open University
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">System Authorization</h2>
                <p className="text-muted-foreground text-sm mt-1.5">Enter your credentials to access the terminal</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="scholar@uou.edu.ng"
                            autoComplete="email"
                            {...field}
                            className="pl-9"
                            style={{
                              background: "rgba(8,18,50,0.6)",
                              borderColor: "rgba(59,130,246,0.2)",
                              color: "white",
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                        Access Key
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...field}
                            className="pl-9"
                            style={{
                              background: "rgba(8,18,50,0.6)",
                              borderColor: "rgba(59,130,246,0.2)",
                              color: "white",
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-11 font-bold text-sm tracking-wider"
                    disabled={loginMutation.isPending}
                    style={{
                      background: loginMutation.isPending
                        ? "rgba(59,130,246,0.4)"
                        : "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #60A5FA 100%)",
                      border: "1px solid rgba(96,165,250,0.4)",
                      boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
                      color: "white",
                    }}
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    {loginMutation.isPending ? "Authorizing..." : "Authorize Access"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div
            className="px-8 py-4 border-t text-center"
            style={{ borderColor: "rgba(59,130,246,0.12)", background: "rgba(4,11,36,0.4)" }}
          >
            <p className="text-xs text-muted-foreground">
              Access is restricted to authorized personnel only.
            </p>
            <p className="text-xs mt-1" style={{ color: "rgba(96,165,250,0.6)" }}>
              Contact{" "}
              <span
                className="font-semibold cursor-default"
                style={{ color: "#60A5FA" }}
                title="registrar@uou.edu.ng"
              >
                the Registrar
              </span>{" "}
              for access provisioning.
            </p>
          </div>
        </div>

        {/* Version tag */}
        <div className="text-center mt-4 text-[10px] font-mono text-muted-foreground opacity-40">
          UOU INFINITE v2.0 · SECURE TERMINAL
        </div>
      </motion.div>
    </div>
  );
}
