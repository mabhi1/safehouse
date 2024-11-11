import { auth } from "@clerk/nextjs/server";

const mockAuth = auth as jest.Mock;
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

export { mockAuth };
