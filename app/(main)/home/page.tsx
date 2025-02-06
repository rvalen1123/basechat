"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

type Status = "online" | "processing" | "error";

const statuses: Record<Status, string> = {
  online: "text-green-400 bg-green-400/10",
  processing: "text-blue-400 bg-blue-400/10",
  error: "text-rose-400 bg-rose-400/10",
};

const recentConversations = [
  {
    id: 1,
    title: "Project Research",
    status: "online" as Status,
    statusText: "Last message 2m ago",
    description: "Research on AI implementation strategies",
  },
  {
    id: 2,
    title: "Technical Documentation",
    status: "processing" as Status,
    statusText: "Processing documents",
    description: "API documentation review",
  },
];

const activityItems = [
  {
    id: 1,
    type: "conversation",
    content: "New response in Project Research",
    timestamp: "2m ago",
  },
  {
    id: 2,
    type: "document",
    content: "Technical Documentation updated",
    timestamp: "1h ago",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function HomePage() {
  return (
    <>
      <main className="lg:pr-96">
        <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="text-base/7 font-semibold text-white">Recent Conversations</h1>

          {/* Sort dropdown */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-x-1 text-sm/6 font-medium text-white">
              Sort by
              <ChevronUpDownIcon aria-hidden="true" className="size-5 text-gray-500" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900",
                    )}
                  >
                    Date
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900",
                    )}
                  >
                    Status
                  </a>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </header>

        {/* Conversations list */}
        <ul role="list" className="divide-y divide-white/5">
          {recentConversations.map((conversation) => (
            <li key={conversation.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="min-w-0 flex-auto">
                <div className="flex items-center gap-x-3">
                  <div className={classNames(statuses[conversation.status], "flex-none rounded-full p-1")}>
                    <div className="size-2 rounded-full bg-current" />
                  </div>
                  <h2 className="min-w-0 text-sm/6 font-semibold text-white">
                    <a href="#" className="flex gap-x-2">
                      <span className="truncate">{conversation.title}</span>
                      <span className="absolute inset-0" />
                    </a>
                  </h2>
                </div>
                <div className="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                  <p className="truncate">{conversation.description}</p>
                  <svg viewBox="0 0 2 2" className="size-0.5 flex-none fill-gray-300">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="whitespace-nowrap">{conversation.statusText}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Activity feed */}
      <aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
        <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h2 className="text-base/7 font-semibold text-white">Activity</h2>
          <a href="#" className="text-sm/6 font-semibold text-indigo-400">
            View all
          </a>
        </header>
        <ul role="list" className="divide-y divide-white/5">
          {activityItems.map((item) => (
            <li key={item.id} className="px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{item.content}</p>
                <time dateTime={item.timestamp} className="flex-none text-xs text-gray-600">
                  {item.timestamp}
                </time>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
