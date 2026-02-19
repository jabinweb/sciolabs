'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';
import '@/app/admin/tiptap.css';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Heading2,
  Heading3,
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const btn =
    'p-2 rounded hover:bg-gray-200';

  const active = 'bg-gray-300';

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">

      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${btn} ${editor.isActive('heading', { level: 2 }) ? active : ''}`}>
          <Heading2 className="w-4 h-4" />
        </button>

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${btn} ${editor.isActive('heading', { level: 3 }) ? active : ''}`}>
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btn} ${editor.isActive('bold') ? active : ''}`}>
          <Bold className="w-4 h-4" />
        </button>

        <button onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btn} ${editor.isActive('italic') ? active : ''}`}>
          <Italic className="w-4 h-4" />
        </button>

        <button onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${btn} ${editor.isActive('underline') ? active : ''}`}>
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <button onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${btn} ${editor.isActive('strike') ? active : ''}`}>
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btn} ${editor.isActive('bulletList') ? active : ''}`}>
          <List className="w-4 h-4" />
        </button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btn} ${editor.isActive('orderedList') ? active : ''}`}>
          <ListOrdered className="w-4 h-4" />
        </button>

        <button onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${btn} ${editor.isActive('blockquote') ? active : ''}`}>
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button onClick={addLink} className={btn}><LinkIcon className="w-4 h-4" /></button>
        <button onClick={addImage} className={btn}><ImageIcon className="w-4 h-4" /></button>

        <div className="w-px bg-gray-300 mx-1" />

        <button onClick={() => editor.chain().focus().undo().run()} className={btn}>
          <Undo className="w-4 h-4" />
        </button>

        <button onClick={() => editor.chain().focus().redo().run()} className={btn}>
          <Redo className="w-4 h-4" />
        </button>

      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
