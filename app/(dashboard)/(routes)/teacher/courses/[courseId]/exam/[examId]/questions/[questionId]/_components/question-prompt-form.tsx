"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "froala-editor/js/plugins.pkgd.min.js";
// import "froala-editor/js/froala_editor.pkgd.min.js";

// Require Editor CSS files.
// import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';

import { ClassicEditor, ImageUpload, Alignment, ImageInsert, Bold, Essentials, Italic, Mention, CloudServices, Paragraph, TextPartLanguage, Undo, Base64UploadAdapter, Heading, FontFamily, FontSize, FontColor, FontBackgroundColor, Strikethrough, Subscript, Superscript, Link, UploadImageCommand, Image, BlockQuote, CodeBlock, TodoList, OutdentCodeBlockCommand, Indent } from 'ckeditor5';
import { ImportWord, ImportWordEditing } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

import Froala from "react-froala-wysiwyg";
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
const froalaEditorConfig = {
  readonly: true,
  direction: "rtl",
  attribution: false,
  height: 200,
  quickInsertEnabled: false,
  imageDefaultWidth: 0,
  imageResizeWithPercent: true,
  imageMultipleStyles: false,
  imageOutputSize: true,
  imageRoundPercent: true,
  imageMaxSize: 1024 * 1024 * 2.5,
  imageEditButtons: [
    "imageReplace",
    "imageAlign",
    "imageRemove",
    "imageSize",
    "-",
    "imageLink",
    "linkOpen",
    "linkEdit",
    "linkRemove"
  ],
  imageAllowedTypes: ["jpeg", "jpg", "png", "gif"],
  imageInsertButtons: ["imageBack", "|", "imageUpload"],
  placeholderText: "Your content goes here!",
  colorsStep: 5,
  colorsText: [
    "#000000",
    "#2C2E2F",
    "#6C7378",
    "#FFFFFF",
    "#009CDE",
    "#003087",
    "#FF9600",
    "#00CF92",
    "#DE0063",
    "#640487",
    "REMOVE"
  ],
  colorsBackground: [
    "#000000",
    "#2C2E2F",
    "#6C7378",
    "#FFFFFF",
    "#009CDE",
    "#003087",
    "#FF9600",
    "#00CF92",
    "#DE0063",
    "#640487",
    "REMOVE"
  ],
  toolbarButtons: {
    moreText: {
      buttons: [
        "paragraphFormat",
        "|",
        "fontSize",
        "textColor",
        "backgroundColor",
        "insertImage",
        "alignLeft",
        "alignRight",
        "alignJustify",
        "formatOL",
        "formatUL",
        "indent",
        "outdent"
      ],
      buttonsVisible: 6
    },
    moreRich: {
      buttons: [
        "|",
        "bold",
        "italic",
        "underline",
        "insertHR",
        "insertLink",
        "insertTable"
      ],
      name: "additionals",
      buttonsVisible: 3
    },
    dummySection: {
      buttons: ["|"]
    },
    moreMisc: {
      buttons: ["|", "undo", "redo", "help", "|"],
      align: "right",
      buttonsVisible: 2
    }
  },
  tableEditButtons: [
    "tableHeader",
    "tableRemove",
    "tableRows",
    "tableColumns",
    "tableStyle",
    "-",
    "tableCells",
    "tableCellBackground",
    "tableCellVerticalAlign",
    "tableCellHorizontalAlign"
  ],
  tableStyles: {
    grayTableBorder: "Gray Table Border",
    blackTableBorder: "Black Table Border",
    noTableBorder: "No Table Border"
  },
  toolbarSticky: true,
  pluginsEnabled: [
    "align",
    "colors",
    "entities",
    "fontSize",
    "help",
    "image",
    "link",
    "lists",
    "paragraphFormat",
    "paragraphStyle",
    "save",
    "table",
    "wordPaste"
  ],
  events: {
    'image.beforeUpload': function(files:any) {
      var editor:any = this;
      if (files.length) {
        // Create a File Reader.
        var reader = new FileReader();
        // Set the reader to insert images when they are loaded.
        reader.onload = function(e:any) {
          var result = e.target.result;
          editor.image.insert(result, null, null, editor.image.get());
        };
        // Read image as base64.
        reader.readAsDataURL(files[0]);
      }
      editor.popups.hideAll();
      // Stop default upload chain.
      return false;
     }
    },
};
interface QuestionPromptFormProps {
  initialData: {
    prompt: string;
  };
  courseId: string;
  examId: string;
  questionId: string;
}

const formSchema = z.object({
  prompt: z.string().min(1),
});

export const QuestionPromptForm = ({
  initialData,
  courseId,
  examId,
  questionId,
}: QuestionPromptFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/exam/${examId}/questions/${questionId}`,
        values
      );
      toast.success("تم تحديث السؤال");
      toggleEdit();
      router.refresh();
    } catch {
      //toast.error("هناك شئ غير صحيح");
console.error("هناك شئ غير صحيح");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        موجه السؤال
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>إلغاء</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              تحرير المطالبة
            </>
          )}
        </Button>
      </div>
      {!isEditing && <FroalaEditorView model={initialData.prompt} />}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <CKEditor
                      editor={ClassicEditor}
                      onChange={(e, editor) => {
                        const data = editor.data.get()
                        form.setValue("prompt",data)
                      }}
                      config={{
                        language: {
                          content: 'ar',
                          ui: "ar"
                        },
                        plugins: [Undo, Heading, FontFamily,
                          FontSize, FontColor, FontBackgroundColor, Bold, Italic, Strikethrough, Subscript, Superscript,
                          Link, Image, ImageInsert, ImageUpload, Alignment, BlockQuote, CloudServices, Base64UploadAdapter, CodeBlock, TodoList, Indent, ImportWord],
                        toolbar: {
                          items: [
                            'undo', 'redo',
                            '|',
                            'heading',
                            '|',
                            'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                            '|',
                            'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                            '|',
                            'link', 'uploadImage', 'blockQuote', 'codeBlock',
                            '|',
                            'bulletedList','Alignment', 'numberedList', 'todoList', 'outdent', 'indent'
                          ],
                          shouldNotGroupWhenFull: false
                        },

                        licenseKey: 'bE0wYlJQa085OGNKM002ZlliYW9WUjVaOWptVXpadWJHaUJ1WThxUmFlZVoyS0JTb2cwNXhQMUw4YSs3TlE9PS1NakF5TkRBNU1Eaz0=',


                        initialData: form.getValues("prompt"),

                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                حفظ
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
