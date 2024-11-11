import "@testing-library/jest-dom";
import "@/__mocks__";
import { render, screen } from "@testing-library/react";
import { passwordWithoutError } from "@/__data__/passwords-data";
import PasswordCard from "./password-card";

const data = passwordWithoutError.data[0];

describe("Password Card", () => {
  it("renders password card without errors", () => {
    render(<PasswordCard password={data} uid={data.uid} />);
    expect(screen.getByText(data.password)).toBeInTheDocument();
  });
});
