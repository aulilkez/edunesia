import { createFileRoute } from "@tanstack/react-router";

import { EmailVerifiedPage } from "../components/auth-pages";

export const Route = createFileRoute("/email-verified")({ component: EmailVerifiedPage });
