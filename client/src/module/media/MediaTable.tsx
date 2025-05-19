"use client";

import { useEffect, useState } from "react";
import { deleteMedia, getAllMedia } from "@/service/media";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Media } from "@/type/type";
import { toast } from "sonner";
import ConfirmDeleteModal from "@/components/MODAL/ConfirmDeleteModal";

const MediaTable = () => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchMedia = async () => {
    try {
      const result = await getAllMedia();
      setMediaList(result?.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch media");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleEdit = (id: string) => {
    console.log("Edit media with id:", id);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedMediaId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMediaId) return;

    try {
      await deleteMedia(selectedMediaId);
      toast.success("Media deleted successfully");
      // Refresh media list after delete
      await fetchMedia();
    } catch (error) {
      toast.error("Failed to delete media");
    } finally {
      setModalOpen(false);
      setSelectedMediaId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Media</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Release Year</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mediaList.map((media) => (
            <TableRow key={media.id}>
              <TableCell>
                <img
                  src={media.thumbnail}
                  alt={media.title}
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>{media.title}</TableCell>
              <TableCell>{media.genre}</TableCell>
              <TableCell>{media.releaseDate}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(media.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(media.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Do you really want to delete this media?"
      />
    </div>
  );
};

export default MediaTable;
