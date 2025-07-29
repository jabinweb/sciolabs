'use client'

import { useState, useEffect } from 'react'

// Import Tiptap dependencies
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Blockquote from '@tiptap/extension-blockquote'
import Paragraph from '@tiptap/extension-paragraph'
import HardBreak from '@tiptap/extension-hard-break'

// UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Code,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Table as TableIcon,
} from 'lucide-react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  editable?: boolean
}

export function Editor({
  value,
  onChange,
  placeholder = 'Start writing...',
  editable = true,
}: EditorProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Fix for SSR hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        blockquote: false,
        paragraph: false,
        hardBreak: false,
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'editor-paragraph',
        },
      }),
      HardBreak.configure({
        HTMLAttributes: {
          class: 'hard-break',
        },
        keepMarks: false,
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-3 rounded-r-md',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline decoration-blue-600 hover:text-blue-800 transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'mx-auto my-4 rounded-lg max-w-full shadow-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Highlight.configure({
        multicolor: true,
      }),
      Typography,
    ],
    content: value,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      // Clean and format HTML for better paragraph spacing
      const processedHtml = html
        // Ensure proper paragraph structure
        .replace(/<p class="editor-paragraph"><\/p>/g, '<p class="editor-paragraph"><br></p>')
        // Maintain proper spacing between elements
        .replace(/(<\/p>)(\s*)(<p)/g, '$1\n$3')
        .replace(/(<\/h[1-6]>)(\s*)(<p)/g, '$1\n$3')
        .replace(/(<\/blockquote>)(\s*)(<p)/g, '$1\n$3')
        .replace(/(<\/ul>)(\s*)(<p)/g, '$1\n$3')
        .replace(/(<\/ol>)(\s*)(<p)/g, '$1\n$3')
      onChange(processedHtml)
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          return false
        }
        if (event.key === 'Enter' && event.shiftKey) {
          editor?.chain().focus().setHardBreak().run()
          return true
        }
        return false
      },
    },
  }, [isMounted])

  // Update editor when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  const insertLink = () => {
    if (!linkUrl) return
    
    if (linkText) {
      editor?.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
    } else {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    setLinkUrl('')
    setLinkText('')
    setLinkDialogOpen(false)
  }

  const insertImage = () => {
    if (!imageUrl) return
    
    editor?.chain().focus().setImage({ src: imageUrl }).run()
    setImageUrl('')
    setImageDialogOpen(false)
  }

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  // Return loading state
  if (!isMounted) {
    return (
      <div className="border rounded-lg">
        <div className="border-b p-3 flex flex-wrap gap-1 bg-gray-50">
          {Array(15).fill(0).map((_, i) => (
            <div key={i} className="h-8 w-8 rounded bg-gray-200 animate-pulse"></div>
          ))}
        </div>
        <div className="min-h-[400px] p-4 bg-gray-50 animate-pulse"></div>
      </div>
    )
  }

  if (!editor) return null

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b p-3 bg-gray-50">
        <div className="flex flex-wrap gap-1 items-center">
          {/* Text Formatting */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Underline"
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={editor.isActive('highlight') ? 'bg-yellow-100 text-yellow-700' : ''}
              type="button"
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />
          
          {/* Headings */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Heading 1"
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />
          
          {/* Text Alignment */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Justify"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />
          
          {/* Lists and Blocks */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                console.log('Quote button clicked')
                console.log('Is blockquote active:', editor.isActive('blockquote'))
                editor.chain().focus().toggleBlockquote().run()
                console.log('After toggle - Is blockquote active:', editor.isActive('blockquote'))
              }}
              className={editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={editor.isActive('code') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Inline Code"
            >
              <Code className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Code Block"
            >
              <Code2 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />
          
          {/* Media and Tables */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLinkDialogOpen(!linkDialogOpen)}
              className={editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}
              type="button"
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setImageDialogOpen(!imageDialogOpen)}
              type="button"
              title="Insert Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={insertTable}
              type="button"
              title="Insert Table"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />
          
          {/* Undo/Redo */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              type="button"
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              type="button"
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Link Dialog */}
      {linkDialogOpen && (
        <div className="p-3 border-b bg-blue-50 space-y-2">
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1"
            />
            <Input 
              placeholder="Link text (optional)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={insertLink} disabled={!linkUrl}>
              Insert Link
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Image Dialog */}
      {imageDialogOpen && (
        <div className="p-3 border-b bg-green-50 space-y-2">
          <Input 
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && insertImage()}
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={insertImage} disabled={!imageUrl}>
              Insert Image
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {/* Editor Content with enhanced paragraph styling */}
      <div className="min-h-[400px]">
        <EditorContent 
          editor={editor} 
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror_.editor-paragraph]:mb-4 [&_.ProseMirror_.editor-paragraph:last-child]:mb-0 [&_.ProseMirror]:leading-relaxed"
        />
      </div>
    </div>
  )
}

