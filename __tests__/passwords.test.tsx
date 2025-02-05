import "@testing-library/jest-dom";
import "@/__mocks__";
import { passwordWithoutError } from "@/__data__/passwords-data";
import Passwords from "@/app/(web)/passwords/page";
import { render, screen } from "@testing-library/react";
import { mockGetPasswordsByUser } from "@/__mocks__/passwords-mock";
import { mockAuth } from "@/__mocks__/clerk-mock";

beforeAll(() => {
  mockGetPasswordsByUser.mockResolvedValue(passwordWithoutError);
  mockAuth.mockImplementation(() => ({ userId: passwordWithoutError.data[0].id }));
});

describe("Password Page", () => {
  it("renders page with empty passwords data", async () => {
    const { container } = render(await Passwords({ searchParams: { search: "" } }));
    expect(container).toMatchSnapshot();
    expect(screen.getByText("Passwords")).toBeInTheDocument();
  });

  it("renders page with passwords data and empty search string", async () => {
    render(await Passwords({ searchParams: { search: "" } }));
    const passwords = screen.getAllByTestId(/password/);
    expect(passwords).toHaveLength(2);
  });

  it("renders page with matching site", async () => {
    render(await Passwords({ searchParams: { search: passwordWithoutError.data[0].site } }));
    const passwords = screen.getAllByTestId(/password/);
    expect(passwords).toHaveLength(1);
  });

  it("renders page with matching username", async () => {
    render(await Passwords({ searchParams: { search: passwordWithoutError.data[1].username } }));
    const passwords = screen.getAllByTestId(/password/);
    expect(passwords).toHaveLength(1);
  });

  it("navigates to signin page with no user id", async () => {
    const mockRedirectToSignIn = jest.fn();
    mockAuth.mockImplementationOnce(() => ({ userId: null, redirectToSignIn: () => mockRedirectToSignIn() }));
    render(await Passwords({ searchParams: { search: "" } }));
    expect(mockRedirectToSignIn).toHaveBeenCalled();
  });

  it("renders error page with invalid passwords data", async () => {
    mockGetPasswordsByUser.mockResolvedValue({
      data: null,
      error: true,
    });
    try {
      render(await Passwords({ searchParams: { search: "" } }));
    } catch (error) {
      expect(error).toStrictEqual(new Error("User not found"));
    }
  });
});
