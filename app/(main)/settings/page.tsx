"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const secondaryNavigation = [
  { name: "Profile", href: "#profile", current: true },
  { name: "Password", href: "#password", current: false },
  { name: "Sessions", href: "#sessions", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Implement profile update
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Implement password update
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutOtherSessions = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // TODO: Implement session logout
      toast.success("Other sessions logged out successfully");
    } catch (error) {
      toast.error("Failed to log out other sessions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1 className="sr-only">Settings</h1>

      <header className="border-b border-white/5">
        {/* Secondary navigation */}
        <nav className="flex overflow-x-auto py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <a href={item.href} className={item.current ? "text-primary" : ""}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Settings forms */}
      <div className="divide-y divide-white/5">
        <div
          id="profile"
          className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
        >
          <div>
            <h2 className="text-base/7 font-semibold text-white">Profile</h2>
            <p className="mt-1 text-sm/6 text-gray-400">Update your personal information.</p>
          </div>

          <form className="md:col-span-2" onSubmit={handleProfileSubmit}>
            <div className="col-span-full flex items-center gap-x-8">
              <Image
                src="/logos/PNG-01.png"
                alt=""
                width={96}
                height={96}
                className="size-24 flex-none rounded-lg bg-gray-800 object-cover"
              />
              <div>
                <div>
                  <button
                    type="button"
                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                  >
                    Change avatar
                  </button>
                  <p className="mt-2 text-xs/5 text-gray-400">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="first-name" className="block text-sm/6 font-medium text-white">
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="last-name" className="block text-sm/6 font-medium text-white">
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="timezone" className="block text-sm/6 font-medium text-white">
                  Timezone
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="timezone"
                    name="timezone"
                    className="col-start-1 row-start-1 w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 [&_*]:text-black"
                  >
                    <option>Pacific Standard Time</option>
                    <option>Eastern Standard Time</option>
                    <option>Greenwich Mean Time</option>
                  </select>
                  <ChevronDownIcon
                    className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 justify-self-end self-center text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        <div
          id="password"
          className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
        >
          <div>
            <h2 className="text-base/7 font-semibold text-white">Change password</h2>
            <p className="mt-1 text-sm/6 text-gray-400">Update your password associated with your account.</p>
          </div>

          <form className="md:col-span-2" onSubmit={handlePasswordSubmit}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="current-password" className="block text-sm/6 font-medium text-white">
                  Current password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="current_password"
                    id="current-password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="new-password" className="block text-sm/6 font-medium text-white">
                  New password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="new_password"
                    id="new-password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-white">
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm-password"
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        <div
          id="sessions"
          className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
        >
          <div>
            <h2 className="text-base/7 font-semibold text-white">Log out other sessions</h2>
            <p className="mt-1 text-sm/6 text-gray-400">
              Please enter your password to confirm you would like to log out of your other sessions across all of your
              devices.
            </p>
          </div>

          <form className="md:col-span-2" onSubmit={handleLogoutOtherSessions}>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="logout-password" className="block text-sm/6 font-medium text-white">
                  Your password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="password"
                    id="logout-password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 bg-white/5 px-3 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
              >
                Log out other sessions
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
