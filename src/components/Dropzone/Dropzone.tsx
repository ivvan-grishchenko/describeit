import { Button, createStyles, Group, rem, Text } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import React, { useRef } from 'react';
import { useRecoilState } from 'recoil';

import { profileImageAtom } from '../../atoms/profileImageAtom';
import { error } from '../Notifications/Notifications';
import { AvatarUploader, AvatarUploaderProps } from './AvatarUploader';

const useStyles = createStyles(theme => ({
  wrapper: {
    position: 'relative',
    marginBottom: rem(30),
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: 'absolute',
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },
}));

export const DropzoneButton: React.FC<AvatarUploaderProps> = ({
  photoUrl,
  userUid,
  matchesMiddle,
}) => {
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);
  const { t } = useTranslation();
  const [files, setFiles] = useRecoilState(profileImageAtom);

  return files.length ? (
    <AvatarUploader
      photoUrl={photoUrl}
      userUid={userUid}
      matchesMiddle={matchesMiddle}
    />
  ) : (
    <div className={classes.wrapper}>
      <Dropzone
        multiple={false}
        openRef={openRef}
        onDrop={setFiles}
        onReject={fileRejections =>
          notifications.show({
            title: t(`notification:${fileRejections[0].errors[0].code}`),
            message: t(`notifications:${fileRejections[0].errors[0].message}`),
            ...error,
          })
        }
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload
                size={rem(50)}
                color={theme.colors[theme.primaryColor][6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={rem(50)} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                size={rem(50)}
                color={
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[0]
                    : theme.black
                }
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>{t('profile:upload_avatar')}</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            {t('profile:upload_description')}
          </Text>
        </div>
      </Dropzone>

      <Button
        className={classes.control}
        component={motion.button}
        variant="gradient"
        gradient={
          theme.colorScheme === 'dark'
            ? { from: 'orange', to: 'red', deg: 45 }
            : { from: 'indigo', to: 'cyan', deg: 45 }
        }
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => openRef.current?.()}
      >
        {t('profile:select_file')}
      </Button>
    </div>
  );
};
