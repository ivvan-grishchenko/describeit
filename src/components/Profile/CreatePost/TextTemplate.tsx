import { User } from '@firebase/auth';
import { addDoc, collection, doc } from '@firebase/firestore';
import {
  Button,
  Divider,
  Group,
  Input,
  Radio,
  Stack,
  Textarea,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useEditor } from '@tiptap/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

import { firestore } from '../../../firebase/ClientApp';
import { editorExtensions } from '../../../util/EditorExtensions';
import { TextTemplateModal } from '../../Modal/Templates/TextTemplateModal';
import { error, success } from '../../Notifications/Notifications';
import { TextEditor } from '../../TextEditor/TextEditor';

export const radios = ['none', 'anime', 'games', 'movies', 'music'];

type TextTemplateProps = {
  user?: User | null;
};

export const TextTemplate: React.FC<TextTemplateProps> = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const form = useForm({
    initialValues: { title: '', description: '', type: 'none' },
    validate: {
      title: val => (val.length === 0 ? t('profile:title_error') : null),
      description: val =>
        val.length === 0 ? t('profile:description_error') : null,
    },
  });
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure();
  const { locale } = useRouter();
  const editor = useEditor({
    extensions: editorExtensions(t, locale),
    editable: true,
  });

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    const collectionRef = collection(firestore, 'posts');
    const userDocRef = doc(firestore, 'users', `${user?.uid}`);
    const post = {
      template: 'text',
      title: form.values.title,
      description: form.values.description,
      post_type: form.values.type,
      content: editor?.getJSON(),
      user: userDocRef,
    };
    const addedPost = await addDoc(collectionRef, post);
    addedPost.id
      ? notifications.show({
          title: t('notifications:success_post_create_title'),
          message: t('notifications:success_post_create_message'),
          ...success,
        })
      : notifications.show({
          title: t('notifications:error_post_create_title'),
          message: t('notifications:error_post_create_message'),
          ...error,
        });
    setLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack justify="flex-start" spacing="xl">
        <Input.Wrapper
          id="title-input"
          withAsterisk
          label={t('profile:title')}
          error={form.errors.title}
        >
          <Input
            id="title-input"
            placeholder={t('profile:title')}
            value={form.values.title}
            onChange={event =>
              form.setFieldValue('title', event.currentTarget.value)
            }
          />
        </Input.Wrapper>

        <Textarea
          placeholder={t('profile:description') as string}
          label={t('profile:description')}
          description={t('profile:description_description')}
          withAsterisk
          value={form.values.description}
          onChange={event =>
            form.setFieldValue('description', event.currentTarget.value)
          }
          error={form.errors.description}
        />

        <Radio.Group
          value={form.values.type}
          onChange={value => form.setFieldValue('type', value)}
          name="postType"
          label={t('profile:post_type_label')}
          description={t('profile:post_type_description')}
          withAsterisk
        >
          <Group mt="xs">
            {radios.map((value, index) => (
              <Radio
                key={`radio-${index}`}
                value={value}
                label={t(`tabs:${value}`)}
                color={theme.colorScheme === 'dark' ? 'orange' : 'indigo'}
              />
            ))}
          </Group>
        </Radio.Group>

        <TextEditor editor={editor} />

        <Divider />

        <Group>
          <Button
            component={motion.button}
            type="submit"
            variant="gradient"
            gradient={
              theme.colorScheme === 'dark'
                ? { from: 'orange', to: 'red', deg: 45 }
                : { from: 'indigo', to: 'cyan', deg: 45 }
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            loading={loading}
          >
            {t('profile:create_post')}
          </Button>
          <Button
            component={motion.button}
            variant="outline"
            color={theme.colorScheme === 'dark' ? 'orange' : 'indigo'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={open}
          >
            {t('profile:preview_post')}
          </Button>
        </Group>
      </Stack>
      <TextTemplateModal
        opened={opened}
        close={close}
        title={form.values.title}
        description={form.values.description}
      />
    </form>
  );
};
