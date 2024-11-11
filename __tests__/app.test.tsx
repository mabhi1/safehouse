import "@testing-library/jest-dom";
import Home from "@/app/page";
import { render, screen } from "@testing-library/react";

describe("Home Page", () => {
  it("renders page without any errors", async () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Safe House");
  });
});
