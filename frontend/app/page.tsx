"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the signup page when the component mounts
    router.push("/signup");
  }, [router]);

  return null; // Return null or a loading indicator, as the page will redirect immediately
}
