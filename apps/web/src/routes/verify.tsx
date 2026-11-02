import { createFileRoute } from "@tanstack/react-router";

import { VerifyEmailPage } from "../features/(auth)";

export const Route = createFileRoute("/verify")({ component: VerifyEmailPage });
