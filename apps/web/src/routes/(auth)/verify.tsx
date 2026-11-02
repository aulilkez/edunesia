import { createFileRoute } from "@tanstack/react-router";

import { VerifyEmailPage } from "../../features/(auth)";

export const Route = createFileRoute("/(auth)/verify")({ component: VerifyEmailPage });
