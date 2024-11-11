import "@testing-library/jest-dom";
import "@/__mocks__";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import SortPasswords from "./sort-passwords";

describe("Sort Password Select", () => {
  it("renders without errors", () => {
    render(<SortPasswords isSearching={false} />);

    expect(screen.getByTestId("sortPasswordsSelect")).toBeInTheDocument();
  });

  it("should render remove search if searching", () => {
    render(<SortPasswords isSearching />);
    expect(screen.getByText("Remove Search")).toBeInTheDocument();
  });
});
