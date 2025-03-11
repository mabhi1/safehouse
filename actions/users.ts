"use server";

import { auth } from "@clerk/nextjs/server";

export async function searchUsersByEmail(email: string) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  if (!email.trim()) {
    return { error: "Email is required", data: null };
  }

  try {
    // Search for users by email using Clerk API
    const response = await fetch(`https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email.trim())}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to search users");
    }

    const users = await response.json();
    // Map the users to a simpler format
    const mappedUsers = users.map((user: any) => ({
      id: user.id,
      email:
        user.email_addresses?.find((email: any) => email.id === user.primary_email_address_id)?.email_address || "",
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      imageUrl: user.image_url || "",
    }));

    return { data: mappedUsers, error: null };
  } catch (error) {
    console.error("Error searching users:", error);
    return { error: "Failed to search users", data: null };
  }
}

export async function getUsersByIds(userIds: string[]) {
  const { userId } = auth();
  if (!userId) {
    return { error: "Unauthorized", data: null };
  }

  if (!userIds.length) {
    return { error: "User IDs are required", data: null };
  }

  try {
    // Fetch users data in parallel using Promise.all
    const userPromises = userIds.map(async (id) => {
      const response = await fetch(`https://api.clerk.com/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch user with ID ${id}`);
        return null;
      }

      return response.json();
    });

    const usersData = await Promise.all(userPromises);
    // Filter out any failed requests and map to simpler format
    const mappedUsers = usersData
      .filter((user): user is any => user !== null)
      .map((user: any) => ({
        id: user.id,
        email:
          user.email_addresses?.find((email: any) => email.id === user.primary_email_address_id)?.email_address || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        imageUrl: user.image_url || "",
      }));

    return { data: mappedUsers, error: null };
  } catch (error) {
    console.error("Error fetching users by IDs:", error);
    return { error: "Failed to fetch users", data: null };
  }
}
