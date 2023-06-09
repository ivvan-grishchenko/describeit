import { useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RichTextEditor } from '@mantine/tiptap';
import {
  IconBrandYoutube,
  IconColorPicker,
  IconPhoto,
} from '@tabler/icons-react';
import { BubbleMenu, Editor } from '@tiptap/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { ImageModal } from '../Modal/TextEditor/ImageModal';
import { YoutubeModal } from '../Modal/TextEditor/YoutubeModal';

type TextEditorProps = {
  editor: Editor | null;
};

export const TextEditor: React.FC<TextEditorProps> = ({ editor }) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const [imageOpened, imageActions] = useDisclosure();
  const [youtubeOpened, youtubeActions] = useDisclosure();

  return (
    <RichTextEditor editor={editor}>
      {editor && (
        <BubbleMenu editor={editor}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Link />
          </RichTextEditor.ControlsGroup>
        </BubbleMenu>
      )}
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ColorPicker
          colors={[
            theme.colors.dark[2],
            theme.colors.gray[5],
            theme.colors.red[8],
            theme.colors.pink[5],
            theme.colors.gray[7],
            theme.colors.violet[4],
            theme.colors.indigo[8],
            theme.colors.blue[6],
            theme.colors.cyan[8],
            theme.colors.teal[5],
            theme.colors.green[7],
            theme.colors.lime[5],
            theme.colors.yellow[3],
            theme.colors.orange[6],
          ]}
        />

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control interactive={false}>
            <IconColorPicker size="1rem" stroke={1.5} />
          </RichTextEditor.Control>
          <RichTextEditor.Color color={theme.colors.red[8]} />
          <RichTextEditor.Color color={theme.colors.violet[4]} />
          <RichTextEditor.Color color={theme.colors.indigo[8]} />
          <RichTextEditor.Color color={theme.colors.teal[5]} />
          <RichTextEditor.Color color={theme.colors.yellow[3]} />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.UnsetColor />

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control
            onClick={imageActions.open}
            title={t('common:insert_image') as string}
          >
            <IconPhoto stroke={1.5} size="1rem" />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            onClick={youtubeActions.open}
            title={t('common:insert_youtube') as string}
          >
            <IconBrandYoutube stroke={1.5} size="1rem" />
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content mih={300} />

      <ImageModal
        opened={imageOpened}
        close={imageActions.close}
        editor={editor}
      />

      <YoutubeModal
        opened={youtubeOpened}
        close={youtubeActions.close}
        editor={editor}
      />
    </RichTextEditor>
  );
};
