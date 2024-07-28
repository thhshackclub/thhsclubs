"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(id: string) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }

  revalidatePath("/posts"); // Update cached posts
  redirect(`/post/${id}`); // Navigate to the new post page
}
