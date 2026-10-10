import { Show, SignUpButton } from "@clerk/nextjs";
import { CtaButton } from "./cta-button";

/** Sends signed-in users to the dashboard and opens Clerk sign-up for everyone else. */
export function PrimaryCta({ label }: { label: string }) {
  return (
    <Show
      when="signed-in"
      fallback={
        <SignUpButton>
          <CtaButton>{label}</CtaButton>
        </SignUpButton>
      }
    >
      <CtaButton href="/dashboard">{label}</CtaButton>
    </Show>
  );
}
