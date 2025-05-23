"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

interface IRatingData {
  mediaId: string;
  rating: number;
}

// Create or update rating
export const createOrUpdateRating = async ({ mediaId, rating }: IRatingData) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      console.log("No access token found, user not authenticated");
      return { success: false, message: "Authentication required" };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({ mediaId, rating }),
    });

    revalidateTag("RATINGS");
    return res.json();
  } catch (error: any) {
    console.error("Error creating/updating rating:", error);
    return { success: false, message: error.message };
  }
};

// Get ratings by media ID
export const getRatingsByMedia = async (mediaId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/ratings/${mediaId}`, {
      next: { tags: ["RATINGS"] },
    });
    return res.json();
  } catch (error: any) {
    console.error("Error fetching ratings:", error);
    return { success: false, message: error.message };
  }
};

// Get average rating for media
export const getAverageRating = async (mediaId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/ratings/average/${mediaId}`, {
      next: { tags: ["RATINGS"] },
    });
    return res.json();
  } catch (error: any) {
    console.error("Error fetching average rating:", error);
    return { success: false, message: error.message };
  }
};

// Update rating
export const updateRating = async (mediaId: string, rating: number) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      return { success: false, message: "Authentication required" };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/ratings/${mediaId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({ rating }),
    });

    revalidateTag("RATINGS");
    return res.json();
  } catch (error: any) {
    console.error("Error updating rating:", error);
    return { success: false, message: error.message };
  }
};

// Delete rating
export const deleteRating = async (mediaId: string) => {
  try {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
      return { success: false, message: "Authentication required" };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/ratings/${mediaId}`, {
      method: "DELETE",
      headers: {
        Authorization: accessToken,
      },
    });

    revalidateTag("RATINGS");
    return res.json();
  } catch (error: any) {
    console.error("Error deleting rating:", error);
    return { success: false, message: error.message };
  }
};