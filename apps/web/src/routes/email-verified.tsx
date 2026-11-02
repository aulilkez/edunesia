import { createFileRoute } from "@tanstack/react-router";

import { EmailVerifiedPage } from "../features/(auth)";

export const Route = createFileRoute("/email-verified")({ component: EmailVerifiedPage });
