import { setupServer } from "msw/node";
import { productHandlers } from "./handlers";

export const server = setupServer(...productHandlers);
