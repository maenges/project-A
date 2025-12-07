import { FC, useEffect, useRef } from 'react';
import { CKEditor } from 'ckeditor4-react';
import { useTheme } from '@mui/material/styles';

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  isDarkMode?: boolean;
};

const MyEditor: FC<Props> = ({ value = '', isDarkMode, onChange }) => {
  const editorRef = useRef<any>(null);
  const theme = useTheme();

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const current = editor.getData();
    if (current !== value) {
      editor.setData(value || '');
    }
    const body = editor.document.getBody();
    body.setStyle('background', isDarkMode ? theme.palette.background.paper : '#ffffff');
    body.setStyle('color', isDarkMode ? '#ffffff' : '#111827');
  }, [isDarkMode, value]);

  return (
    <CKEditor
      editorUrl="/ckeditor/ckeditor.js"
      initData={value}
      config={{
        height: 400,
        versionCheck: false,
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
      onChange={(evt: any) => {
        const data = evt.editor.getData();
        onChange?.(data);
      }}
      onInstanceReady={(evt: any) => {
        editorRef.current = evt.editor;

        const body = evt.editor.document.getBody();
        body.setStyle('background', isDarkMode ? theme.palette.background.paper : '#ffffff');
        body.setStyle('color', isDarkMode ? '#ffffff' : '#111827');
      }}
    />
  );
};

export default MyEditor;
