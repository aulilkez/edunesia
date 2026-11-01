import { check, sleep } from "k6";
import http from "k6/http";

const baseUrl = __ENV.BASE_URL ?? "http://127.0.0.1:5173";

export const options = {
  vus: 1,
  iterations: 5,
};

export default function () {
  const response = http.get(`${baseUrl}/api/trpc/health?input=%7B%22json%22%3Anull%7D`, {
    tags: { endpoint: "trpc.health" },
  });
  check(response, { "tRPC health responds": (result) => result.status === 200 });
  sleep(0.1);
}
