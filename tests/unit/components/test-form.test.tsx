import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TestForm, { FormData } from "@/components/test-form";

import { render } from "../../helpers";

describe("TestForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it("renders all form fields", () => {
    render(<TestForm onSubmit={mockSubmit} />);

    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("age-input")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("shows validation errors for invalid input", async () => {
    render(<TestForm onSubmit={mockSubmit} />);

    // Submit with empty fields
    fireEvent.click(screen.getByTestId("submit-button"));

    // Wait for validation messages
    await waitFor(() => {
      expect(screen.getByText("Username must be at least 3 characters")).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });

    // Enter invalid data
    await userEvent.clear(screen.getByTestId("username-input"));
    await userEvent.clear(screen.getByTestId("email-input"));
    await userEvent.clear(screen.getByTestId("age-input"));

    await userEvent.type(screen.getByTestId("username-input"), "ab");
    await userEvent.type(screen.getByTestId("email-input"), "invalid-email");
    await userEvent.type(screen.getByTestId("age-input"), "15");

    await userEvent.click(screen.getByTestId("submit-button"));

    // Wait for validation messages to appear
    await waitFor(() => {
      expect(screen.getByText("Username must be at least 3 characters")).toBeInTheDocument();
      expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    });

    // Check age validation
    expect(screen.getByTestId("age-input")).toHaveValue(15);
    expect(screen.getByText("Must be at least 18 years old")).toBeInTheDocument();

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    render(<TestForm onSubmit={mockSubmit} />);

    const validData: FormData = {
      username: "testuser",
      email: "test@example.com",
      age: 25,
    };

    // Fill in valid data
    await userEvent.clear(screen.getByTestId("username-input"));
    await userEvent.clear(screen.getByTestId("email-input"));
    await userEvent.clear(screen.getByTestId("age-input"));

    await userEvent.type(screen.getByTestId("username-input"), validData.username);
    await userEvent.type(screen.getByTestId("email-input"), validData.email);
    await userEvent.type(screen.getByTestId("age-input"), validData.age.toString());

    // Submit form
    const submitButton = screen.getByTestId("submit-button");
    await userEvent.click(submitButton);

    // Wait for validation to pass and form to submit
    await waitFor(
      () => {
        expect(mockSubmit).toHaveBeenCalledTimes(1);
        expect(mockSubmit).toHaveBeenCalledWith(validData);
      },
      { timeout: 3000 },
    );
  });

  it("initializes with default values", () => {
    const defaultValues: Partial<FormData> = {
      username: "defaultuser",
      email: "default@example.com",
      age: 30,
    };

    render(<TestForm onSubmit={mockSubmit} defaultValues={defaultValues} />);

    expect(screen.getByTestId("username-input")).toHaveValue(defaultValues.username);
    expect(screen.getByTestId("email-input")).toHaveValue(defaultValues.email);
    expect(screen.getByTestId("age-input")).toHaveValue(defaultValues.age);
  });

  it("validates maximum constraints", async () => {
    render(<TestForm onSubmit={mockSubmit} />);

    // Test username max length
    await userEvent.type(screen.getByTestId("username-input"), "a".repeat(21));
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Username must be less than 20 characters")).toBeInTheDocument();
    });

    // Test age maximum
    await userEvent.clear(screen.getByTestId("age-input"));
    await userEvent.type(screen.getByTestId("age-input"), "121");
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByText("Invalid age")).toBeInTheDocument();
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
