import { FC, useEffect, useRef } from 'react';
import { CKEditor } from 'ckeditor4-react';
import { useTheme } from '@mui/material/styles';

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  isDarkMode?: boolean;
  width?: number | string;
  height?: number;
  readOnly?: boolean;
};

const MyEditor: FC<Props> = ({ value = '', isDarkMode, onChange, width, height, readOnly }) => {
  const editorRef = useRef<any>(null);
  const theme = useTheme();

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (typeof readOnly === 'boolean') {
      editor.setReadOnly(readOnly);
    }

    const current = editor.getData();
    if (current !== value) {
      editor.setData(value || '');
    }
    const body = editor.document.getBody();
    body.setStyle('background', isDarkMode ? theme.palette.background.paper : '#ffffff');
    body.setStyle('color', isDarkMode ? '#ffffff' : '#111827');
  }, [isDarkMode, value, readOnly]);

  return (
    <CKEditor
      editorUrl="/ckeditor/ckeditor.js"
      initData={value}
      config={{
        height: typeof height === 'number' ? height : 400,
        readOnly: !!readOnly,
        versionCheck: false,
        removePlugins: 'exportpdf,cloudservices',
        toolbar: [
          { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
          { name: 'colors', items: ['TextColor', 'BGColor'] },
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
          { name: 'clipboard', items: ['Undo', 'Redo'] },
          {
            name: 'paragraph',
            items: [
              'NumberedList',
              'BulletedList',
              'JustifyLeft',
              'JustifyCenter',
              'JustifyRight',
              'JustifyBlock',
              'HorizontalRule',
              'Blockquote',
            ],
          },
          { name: 'insert', items: ['Image', 'Table'] },
        ],
        contentsCss: [],
      }}
      style={{ width: width ?? '100%' }}
      onChange={(evt: any) => {
        if (readOnly) return;
        const data = evt.editor.getData();
        onChange?.(data);
      }}
      onInstanceReady={(evt: any) => {
        editorRef.current = evt.editor;

        if (typeof readOnly === 'boolean') {
          evt.editor.setReadOnly(readOnly);
        }

        const body = evt.editor.document.getBody();
        body.setStyle('background', isDarkMode ? theme.palette.background.paper : '#ffffff');
        body.setStyle('color', isDarkMode ? '#ffffff' : '#111827');
      }}
    />
  );
};

export default MyEditor;
