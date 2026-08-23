import { POST as registerHandler } from "../register/route";

export async function POST(req: Request) {
  return registerHandler(req);
}
