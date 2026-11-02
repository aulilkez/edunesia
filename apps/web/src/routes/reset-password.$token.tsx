import { createFileRoute } from "@tanstack/react-router";

import { ResetPasswordPage } from "../features/(auth)";

export const Route = createFileRoute("/reset-password/$token")({ component: ResetPasswordPage });
