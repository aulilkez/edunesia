import { createFileRoute } from "@tanstack/react-router";

import { PasswordRecoveryPage } from "../components/auth-pages";

export const Route = createFileRoute("/reset-password")({ component: PasswordRecoveryPage });
