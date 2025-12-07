import AutocompleteEditor from './Editor/AutocompleteEditor';
import DateEditor from './Editor/DateEditor';
import SelectEditor from './Editor/SelectEditor';
import TextEditor from './Editor/TextEditor';
import CheckBoxEditor from './Editor/CheckBoxEditor';
import SelectionBoxEditor from './Editor/SelectionBoxEditor';
import CheckButtonEditor from './Editor/CheckButtonEditor';
import FileButtonEditor from './Editor/FileButtonEditor';

import TextRenderer from './Renderer/TextRenderer';
import SelectRenderer from './Renderer/SelectRenderer';
import AutocompleteRenderer from './Renderer/AutocompleteRenderer';
import DateRenderer from './Renderer/DateRenderer';
import CheckBoxRenderer from './Renderer/CheckBoxRenderer';
import SelectionBoxRenderer from './Renderer/SelectionBoxRenderer';
import FileButtonRenderer from './Renderer/FileButtonRenderer';

import { EtsColumnPreset } from './Preset/Preset';

const EtsEditor = {
  SelectEditor,
  TextEditor,
  AutocompleteEditor,
  DateEditor,
  CheckBoxEditor,
  SelectionBoxEditor,
  CheckButtonEditor,
  FileButtonEditor,
};

const EtsRenderer = {
  TextRenderer,
  SelectRenderer,
  AutocompleteRenderer,
  DateRenderer,
  CheckBoxRenderer,
  SelectionBoxRenderer,
  FileButtonRenderer,
};

export { EtsEditor, EtsRenderer, EtsColumnPreset };
