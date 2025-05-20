"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "./Modal";

// Validation Schema
const mediaSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genre: z.string().min(1, "Genre is required"),
  type: z.enum(["MOVIE", "SERIES"]),
  videoUrls: z.array(z.string().url("Please enter a valid URL")),
  amount: z.number().min(50, "Amount must be at least 50"),
  thumbnail: z.any().optional(),
  releaseDate: z.string().optional(),
}).refine(
  (data) => {
    if (data.type === "MOVIE") return data.videoUrls.length === 1;
    if (data.type === "SERIES") return data.videoUrls.length > 0;
    return true;
  },
  {
    message: "Movie requires exactly 1 URL, Series requires at least 1 URL",
    path: ["videoUrls"],
  }
);

type MediaFormValues = z.infer<typeof mediaSchema>;

interface Media {
  id: string;
  title: string;
  description: string;
  genre: string;
  type: "MOVIE" | "SERIES";
  videoUrls: string[];
  amount: number;
  thumbnail?: string;
  releaseDate?: string;
}

interface UpdateModalFormProps {
  open: boolean;
  onClose: () => void;
  media: Media | null;
  onSave: (updatedMedia: {
    id: string;
    title: string;
    description: string;
    genre: string;
    type: "MOVIE" | "SERIES";
    videoUrls: string[];
    amount: number;
    thumbnail?: File;
    releaseDate?: string;
  }) => Promise<void>;
}

export function UpdateModalForm({ open, onClose, media, onSave }: UpdateModalFormProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      type: "MOVIE",
      videoUrls: [""],
      amount: 50,
      releaseDate: "",
    },
  });

  const mediaType = form.watch("type");
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videoUrls",
  });

  // Reset form when media changes
  useEffect(() => {
    if (!media) return;

    form.reset({
      title: media.title || "",
      description: media.description || "",
      genre: media.genre || "",
      type: media.type || "MOVIE",
      videoUrls: media.videoUrls?.length ? media.videoUrls : [""],
      amount: media.amount || 50,
      releaseDate: media.releaseDate || "",
    });

    if (media.thumbnail) {
      setThumbnailPreview(media.thumbnail);
    }
  }, [media, form]);

  // Handle media type change
  useEffect(() => {
    if (mediaType === "MOVIE" && fields.length > 1) {
      for (let i = fields.length - 1; i >= 1; i--) {
        remove(i);
      }
    }
  }, [mediaType, fields.length, remove]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailFile(null);
      setThumbnailPreview(media?.thumbnail || null);
    }
  };

  const onSubmit = async (data: MediaFormValues) => {
    if (!media?.id) return;
    
    try {
      await onSave({
        ...data,
        id: media.id,
        thumbnail: thumbnailFile || undefined,
      });
    } catch (error) {
      console.error("Failed to update media:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Media">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Genre and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter genre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Release Date */}
          <FormField
            control={form.control}
            name="releaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MOVIE">Movie</SelectItem>
                    <SelectItem value="SERIES">Series</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Video URLs */}
          <div className="space-y-2">
            <FormLabel>Video URLs</FormLabel>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`videoUrls.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder={
                            mediaType === "MOVIE"
                              ? "Enter video URL"
                              : `Episode ${index + 1} URL`
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
            {mediaType === "SERIES" && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => append("")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Episode URL
              </Button>
            )}
          </div>

          {/* Thumbnail */}
          <FormItem>
            <FormLabel>Thumbnail</FormLabel>
            <FormControl>
              <Input type="file" accept="image/*" onChange={handleThumbnailChange} />
            </FormControl>
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
            <FormMessage />
          </FormItem>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}