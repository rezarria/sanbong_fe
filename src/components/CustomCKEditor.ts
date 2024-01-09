/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic"

import { Alignment } from "@ckeditor/ckeditor5-alignment"
import { Autoformat } from "@ckeditor/ckeditor5-autoformat"
import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles"
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote"
import { CloudServices } from "@ckeditor/ckeditor5-cloud-services"
import { CodeBlock } from "@ckeditor/ckeditor5-code-block"
import type { EditorConfig } from "@ckeditor/ckeditor5-core"
import { Essentials } from "@ckeditor/ckeditor5-essentials"
import { FindAndReplace } from "@ckeditor/ckeditor5-find-and-replace"
import {
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
} from "@ckeditor/ckeditor5-font"
import { Heading } from "@ckeditor/ckeditor5-heading"
import { HtmlEmbed } from "@ckeditor/ckeditor5-html-embed"
import {
  GeneralHtmlSupport,
  HtmlComment,
} from "@ckeditor/ckeditor5-html-support"
import {
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
} from "@ckeditor/ckeditor5-image"
import { Indent } from "@ckeditor/ckeditor5-indent"
import { Link, LinkImage } from "@ckeditor/ckeditor5-link"
import { List } from "@ckeditor/ckeditor5-list"
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed"
import { Paragraph } from "@ckeditor/ckeditor5-paragraph"
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office"
import { Table, TableToolbar } from "@ckeditor/ckeditor5-table"
import { TextTransformation } from "@ckeditor/ckeditor5-typing"
import { Undo } from "@ckeditor/ckeditor5-undo"
import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload"
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing"

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class CustomCKEditor extends ClassicEditor {
  public static override builtinPlugins = [
    Alignment,
    Autoformat,
    Base64UploadAdapter,
    BlockQuote,
    Bold,
    CloudServices,
    CodeBlock,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    HtmlComment,
    HtmlEmbed,
    Image,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Indent,
    Italic,
    Link,
    LinkImage,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,
    Undo,
    SourceEditing,
  ]

  public static override defaultConfig: EditorConfig = {
    toolbar: {
      items: [
        "SourceEditing",
        "heading",
        "|",
        "fontFamily",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "alignment",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
        "codeBlock",
        "findAndReplace",
        "htmlEmbed",
        "imageInsert",
        "fontColor",
        "fontBackgroundColor",
        "fontSize",
      ],
    },
    language: "en",
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
  }
}

export default CustomCKEditor
