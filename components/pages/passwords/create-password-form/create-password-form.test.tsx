import "@testing-library/jest-dom";
import "@/__mocks__";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { CreatePasswordForm } from "./create-password-form";
import { mockAddPassword } from "@/__mocks__/passwords-mock";

describe("Create Password Form Dialog", () => {
  it("should render form without errors", () => {
    render(<CreatePasswordForm uid="" />);

    expect(screen.getByText("Add Password")).toBeInTheDocument();
  });

  it("should toggle password on lock icon click", () => {
    render(<CreatePasswordForm uid="" />);

    act(() => {
      fireEvent.click(screen.getByTestId("addPasswordButton"));
    });

    const passwordInput = screen.getByTestId("passwordInput");
    expect(passwordInput).toHaveProperty("type", "password");

    act(() => {
      fireEvent.click(screen.getByTestId("passwordLockIcon"));
    });
    expect(passwordInput).toHaveProperty("type", "text");

    act(() => {
      fireEvent.click(screen.getByTestId("passwordUnlockIcon"));
    });
    expect(passwordInput).toHaveProperty("type", "password");
  });

  it("should submit the form on valid input", async () => {
    render(<CreatePasswordForm uid="" />);
    mockAddPassword.mockResolvedValue({ data: true, error: null });

    act(() => {
      fireEvent.click(screen.getByTestId("addPasswordButton"));
    });

    const siteInput = screen.getByTestId("siteInput");
    const usernameInput = screen.getByTestId("usernameInput");
    const passwordInput = screen.getByTestId("passwordInput");
    const passwordSubmitButton = screen.getByTestId("passwordSubmitButton");

    await act(async () => {
      fireEvent.change(siteInput, { target: { value: "site" } });
      fireEvent.change(usernameInput, { target: { value: "username" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });

      fireEvent.click(passwordSubmitButton);
    });

    expect(mockAddPassword).toHaveBeenCalledWith();
  });
});
