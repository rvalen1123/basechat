"use client";

import { useActionState } from "react";

import { Button, Error } from "../common";

import { handleSignUp } from "./actions";

export default function SignUp({ redirectTo }: { redirectTo?: string }) {
  const [state, signUpAction, pending] = useActionState(handleSignUp, null);

  return (
    <form className="flex flex-col w-full" action={signUpAction} suppressHydrationWarning>
      <Error error={state?.error} />

      <div className="flex justify-between gap-4">
        <input
          name="firstName"
          type="text"
          placeholder="First name"
          autoComplete="given-name"
          className="w-full border rounded-[6px] text-[16px] placeholder-[#74747A] px-4 py-2 mb-4"
          suppressHydrationWarning
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last name"
          autoComplete="family-name"
          className="w-full border rounded-[6px] text-[16px] placeholder-[#74747A] px-4 py-2 mb-4"
          suppressHydrationWarning
        />
      </div>
      <input
        name="email"
        type="email"
        placeholder="Email"
        autoComplete="email"
        className="w-full border rounded-[6px] text-[16px] placeholder-[#74747A] px-4 py-2 mb-4"
        suppressHydrationWarning
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="new-password"
        className="w-full border rounded-[6px] text-[16px] placeholder-[#74747A] px-4 py-2 mb-4"
        suppressHydrationWarning
      />
      <input
        name="confirm"
        type="password"
        placeholder="Confirm password"
        autoComplete="new-password"
        className="w-full border rounded-[6px] text-[16px] placeholder-[#74747A] px-4 py-2 mb-8"
        suppressHydrationWarning
      />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <Button>Sign up</Button>
    </form>
  );
}
