import { KeyboardEvent, useRef, useState } from "react";

import { AutosizeTextarea, AutosizeTextAreaRef } from "../ui/autosize-textarea";

interface ChatInputProps {
  handleSubmit?: (text: string) => void;
}

export default function ChatInput(props: ChatInputProps) {
  const [value, setValue] = useState("");
  const ref = useRef<AutosizeTextAreaRef>(null);

  const handleSubmit = (value: string) => {
    setValue("");

    const v = value.trim();
    v && props.handleSubmit && props.handleSubmit(v);
    ref.current?.textArea.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || (event.key === "Enter" && event.shiftKey)) return;

    event.preventDefault();
    handleSubmit(value);
  };

  return (
    <div className="flex w-full items-end items-center">
      <AutosizeTextarea
        className="pt-1.5"
        ref={ref}
        placeholder="Send a message"
        minHeight={4}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
      <button onClick={() => handleSubmit(value)}>
        <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M24.3125 12L11.6731 12M6.34685 16.1693H3.91254M6.34685 12.1464H1.51254M6.34685 8.12356H3.91254M10.6199 4.59596L23.8753 11.0228C24.6916 11.4186 24.6916 12.5814 23.8753 12.9772L10.6199 19.4041C9.71186 19.8443 8.74666 18.9161 9.15116 17.9915L11.582 12.4353C11.7034 12.1578 11.7034 11.8422 11.582 11.5647L9.15116 6.00848C8.74666 5.08391 9.71186 4.15568 10.6199 4.59596Z"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
