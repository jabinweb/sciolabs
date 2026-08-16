"use server"

import { signOut } from "@/auth"
import { redirect } from "next/navigation"

export async function loginAction() {
  redirect("/auth/signin")
}

export async function logoutAction() {
  await signOut({ redirect: false })
  redirect("/auth/signin")
}
