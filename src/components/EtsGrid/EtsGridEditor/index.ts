import AutocompleteEditor from './Editor/AutocompleteEditor';
import DateEditor from './Editor/DateEditor';
import SelectEditor from './Editor/SelectEditor';
import TextEditor from './Editor/TextEditor';
import CheckBoxEditor from './Editor/CheckBoxEditor';
import CheckButtonEditor from './Editor/CheckButtonEditor';
import FileButtonEditor from './Editor/FileButtonEditor';

import TextRenderer from './Renderer/TextRenderer';
import SelectRenderer from './Renderer/SelectRenderer';
import AutocompleteRenderer from './Renderer/AutocompleteRenderer';
import DateRenderer from './Renderer/DateRenderer';
import CheckBoxRenderer from './Renderer/CheckBoxRenderer';
import FileButtonRenderer from './Renderer/FileButtonRenderer';

import { EtsColumnPreset } from './Preset/Preset';

const EtsEditor = {
  SelectEditor,
  TextEditor,
  AutocompleteEditor,
  DateEditor,
  CheckBoxEditor,
  CheckButtonEditor,
  FileButtonEditor,
};

const EtsRenderer = {
  TextRenderer,
  SelectRenderer,
  AutocompleteRenderer,
  DateRenderer,
  CheckBoxRenderer,
  FileButtonRenderer,
};

export { EtsEditor, EtsRenderer, EtsColumnPreset };
