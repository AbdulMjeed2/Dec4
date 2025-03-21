"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface QuestionActionsProps {
  disabled: boolean;
  courseId: string;
  examId: string;
  questionId: string;
  isPublished: boolean;
}

export const QuestionActions = ({
  disabled,
  courseId,
  examId,
  questionId,
  isPublished,
}: QuestionActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/exam/${examId}/questions/${questionId}/unpublish`
        );
        toast.success("سؤال غير منشور");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/exam/${examId}/questions/${questionId}/publish`
        );
        toast.success("تم نشر السؤال");
      }

      router.refresh();
    } catch (e){
      console.log(e)
      //toast.error("هناك شئ غير صحيح");
console.error("هناك شئ غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/courses/${courseId}/exam/${examId}/questions/${questionId}`
      );

      toast.success("تم حذف الدرس");
      router.push(`/teacher/courses/${courseId}/exam/${examId}`);

      router.refresh();
    } catch {
      toast.success("تم حذف الدرس");
      router.push(`/teacher/courses/${courseId}/exam/${examId}`);

      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "إلغاء النشر" : "نشر"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
