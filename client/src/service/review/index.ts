"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";


interface IReviewData {
  mediaId: string;
  comment: string;
}

export const createReview = async ({ mediaId, comment }: IReviewData) => {
  try {
     const accessToken = (await cookies()).get("accessToken")?.value;

 
    if (!accessToken) {
      console.log("No access token found, user not authenticated");
      return false;
    }



    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({ mediaId, comment }),
    });
    revalidateTag("REVIEWS");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};


// Get Reviews by Media ID
export const getReviewsByMedia = async (mediaId: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reviews/${mediaId}`, {
      next: { tags: ["REVIEWS"] },
    });
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
export const getALLReview = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reviews`, {
      next: { tags: ["REVIEWS"] },
    });
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Update Review
export const updateReview = async (id: string, data: { comment: string }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("accessToken")!.value,
      },
      body: JSON.stringify(data),
    });
    revalidateTag("REVIEWS");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// Delete Review
export const deleteReview = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/reviews/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: (await cookies()).get("accessToken")!.value,
      },
    });
    revalidateTag("REVIEWS");
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
