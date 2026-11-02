import { createFileRoute } from "@tanstack/react-router";

import { PasswordRecoveryPage } from "../features/(auth)";

export const Route = createFileRoute("/reset-password")({ component: PasswordRecoveryPage });
