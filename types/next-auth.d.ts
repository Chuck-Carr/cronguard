import { Plan } from "@/lib/types"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    plan: Plan
  }

  interface Session {
    user: {
      id: string
      email: string
      plan: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    plan: string
  }
}
