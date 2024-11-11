import "@testing-library/jest-dom";
import "@/__mocks__";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { passwordWithoutError } from "@/__data__/passwords-data";
import PasswordText from "./password-text";

const data = passwordWithoutError.data[0].password;

describe("Password Text", () => {
  it("renders password text without errors", () => {
    render(<PasswordText password={data} />);
    expect(screen.getByTestId("togglePassword")).toHaveTextContent(data);
  });

  it("toggles password on click", async () => {
    render(<PasswordText password={data} />);
    const passwordText = screen.getByTestId("togglePassword");

    await act(async () => {
      fireEvent.click(screen.getByTestId("togglePassword"));
    });
    await waitFor(() => expect(passwordText).toHaveTextContent("demo"));

    await act(async () => {
      fireEvent.click(screen.getByTestId("togglePassword"));
    });
    await waitFor(() => {
      expect(passwordText).not.toHaveTextContent(data);
      expect(passwordText).not.toHaveTextContent("demo");
    });
  });
});
