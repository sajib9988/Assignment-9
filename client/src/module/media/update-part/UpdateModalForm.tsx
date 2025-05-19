"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

// Adjust path as needed

const mediaSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  genre: z.string().min(1, "Genre is required"),
  type: z.enum(["MOVIE", "SERIES"]),
  videoUrls: z.array(z.string().url("Please enter a valid URL")),
  amount: z.number().min(50, "Amount must be at least 50"),
  thumbnail: z.instanceof(File).optional(),
}).refine(
  (data) => {
    if (data.type === "MOVIE") return data.videoUrls.length === 1;
    if (data.type === "SERIES") return data.videoUrls.length > 1;
    return true;
  },
  {
    message: "Movies require exactly one URL, and Series require multiple URLs.",
    path: ["videoUrls"],
  }
);

type MediaFormValues = z.infer<typeof mediaSchema>;

interface UpdateModalFormProps {
  open: boolean;
  onClose: () => void;
  media: {
    id: string;
    title: string;
    description: string;
    genre: string;
    type: "MOVIE" | "SERIES";
    videoUrls: string[];
    amount: number;
    thumbnail?: string;
  } | null;
  onSave: (updatedMedia: MediaFormValues & { id: string }) => void;
}

export function UpdateModalForm({ open, onClose, media, onSave }: UpdateModalFormProps) {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(media?.thumbnail ?? null);
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      title: media?.title || "",
      description: media?.description || "",
      genre: media?.genre || "",
      type: media?.type || "MOVIE",
      videoUrls: media?.videoUrls.length ? media.videoUrls : [""],
      amount: media?.amount || 0,
      thumbnail: undefined,
    },
  });

  const mediaType = form.watch("type");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "videoUrls",
  });

  useEffect(() => {
    if (!media) return;
    form.reset({
      title: media.title,
      description: media.description,
      genre: media.genre,
      type: media.type,
      videoUrls: media.videoUrls.length ? media.videoUrls : [""],
      amount: media.amount,
      thumbnail: undefined,
    });
    setThumbnailPreview(media.thumbnail || null);
  }, [media]);

  useEffect(() => {
    if (mediaType === "MOVIE" && fields.length > 1) {
      for (let i = fields.length - 1; i >= 1; i--) {
        remove(i);
      }
    }
  }, [mediaType]);

  const onSubmit = (data: MediaFormValues) => {
    if (!media) return;
    onSave({ ...data, id: media.id });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Media">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <FormField
            control={form.control}
            name="videoUrls"
            render={() => (
              <FormItem>
                <FormLabel>Video URLs</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <FormControl>
                      <Input
                        {...form.register(`videoUrls.${index}` as const)}
                        placeholder="https://example.com/video"
                      />
                    </FormControl>
                    {fields.length > 1 && (
                      <Button type="button" variant="ghost" onClick={() => remove(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {mediaType === "SERIES" && (
                  <Button type="button" variant="outline" onClick={() => append("")}>
                    <Plus className="w-4 h-4 mr-1" /> Add URL
                  </Button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thumbnail Upload */}
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        field.onChange(file);
                        setThumbnailPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </FormControl>
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="mt-2 h-24 w-24 rounded object-cover"
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
