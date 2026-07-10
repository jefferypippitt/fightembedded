"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInFormSchema } from "@/lib/auth-schema";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

const DEFAULT_RATE_LIMIT_MS = 15 * 60 * 1000;

function getRateLimitResetTime(offsetMs: number) {
  return Date.now() + offsetMs;
}

function getMinutesUntilReset(resetTime: number) {
  return Math.ceil((resetTime - Date.now()) / 1000 / 60);
}

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitResetTime, setRateLimitResetTime] = useState<number | null>(null);
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;
    setIsLoading(true);
    setIsRateLimited(false);
    setRateLimitResetTime(null);
    setMinutesRemaining(null);

    try {
      await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            // Loading state is handled by button spinner
          },
          onSuccess: () => {
            // No success toast - user will be redirected
            form.reset();
          },
          onError: (ctx) => {
            setIsLoading(false);

            // Check if it's a rate limit error
            if (ctx.error.code === "RATE_LIMIT_EXCEEDED" || ctx.error.message.includes("rate limit")) {
              setIsRateLimited(true);
              const resetMatch = ctx.error.message.match(/(\d+)\s*seconds?/i);
              const resetTime = resetMatch
                ? getRateLimitResetTime(parseInt(resetMatch[1], 10) * 1000)
                : getRateLimitResetTime(DEFAULT_RATE_LIMIT_MS);
              setRateLimitResetTime(resetTime);
              setMinutesRemaining(getMinutesUntilReset(resetTime));
              toast.error("Too many sign-in attempts. Please try again later.");
            } else {
              toast.error(ctx.error.message);
            }

            form.setError("email", {
              type: "manual",
              message: ctx.error.message,
            });
          },
        }
      );
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        if (error.message.includes("rate limit") || error.message.includes("429")) {
          setIsRateLimited(true);
          const resetTime = getRateLimitResetTime(DEFAULT_RATE_LIMIT_MS);
          setRateLimitResetTime(resetTime);
          setMinutesRemaining(getMinutesUntilReset(resetTime));
          toast.error("Too many sign-in attempts. Please try again later.");
        } else {
          toast.error(error.message || "An unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  }

  useEffect(() => {
    if (!isRateLimited || rateLimitResetTime === null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const remaining = getMinutesUntilReset(rateLimitResetTime);
      if (remaining <= 0) {
        setIsRateLimited(false);
        setRateLimitResetTime(null);
        setMinutesRemaining(null);
        return;
      }
      setMinutesRemaining(remaining);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRateLimited, rateLimitResetTime]);

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your credentials to access your account
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@mail.com"
                        type="email"
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isRateLimited && minutesRemaining !== null && (
                <div className="text-sm text-destructive text-center p-2 bg-destructive/10 rounded-md">
                  Rate limit exceeded. Please try again in{" "}
                  {minutesRemaining} minutes.
                </div>
              )}
              <Button
                className="w-full"
                type="submit"
                disabled={isLoading || isRateLimited}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : isRateLimited ? (
                  "Rate Limited"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
