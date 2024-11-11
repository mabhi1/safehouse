const mockGetPasswordsByUser = jest.fn();
jest.mock("../prisma/db/passwords", () => ({
  getPasswordsByUser: () => mockGetPasswordsByUser(),
}));

const mockAddPassword = jest.fn();
const mockEditPassword = jest.fn();
jest.mock("../actions/passwords", () => ({
  addPassword: () => mockAddPassword(),
  editPassword: () => mockEditPassword(),
}));

export { mockGetPasswordsByUser, mockAddPassword, mockEditPassword };
