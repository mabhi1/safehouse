import "@testing-library/jest-dom";
import "@/__mocks__";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { EditPasswordForm } from "./edit-password-form";
import { mockEditPassword } from "@/__mocks__/passwords-mock";
import { passwordWithoutError } from "@/__data__/passwords-data";

const data = passwordWithoutError.data[0];

describe("Edit Password Form Dialog", () => {
  it("should render form without errors", () => {
    render(<EditPasswordForm password={data} uid="" />);

    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("should toggle password on lock icon click", async () => {
    render(<EditPasswordForm password={data} uid="" />);

    act(() => {
      fireEvent.click(screen.getByTestId("editPasswordButton"));
    });

    const passwordInput = screen.getByTestId("passwordInput");
    expect(passwordInput).toHaveProperty("type", "password");

    await act(async () => {
      fireEvent.click(screen.getByTestId("passwordLockIcon"));
    });
    await waitFor(() => expect(passwordInput).toHaveProperty("type", "text"));

    act(() => {
      fireEvent.click(screen.getByTestId("passwordUnlockIcon"));
    });
    await waitFor(() => expect(passwordInput).toHaveProperty("type", "password"));
  });

  it("should submit the form on valid input", async () => {
    render(<EditPasswordForm password={data} uid="" />);
    mockEditPassword.mockResolvedValue({ data: true, error: null });

    act(() => {
      fireEvent.click(screen.getByTestId("editPasswordButton"));
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

    expect(mockEditPassword).toHaveBeenCalledWith();
  });
});
