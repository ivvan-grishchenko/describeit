import {
  Center,
  createStyles,
  Flex,
  Pagination,
  Stack,
  Tabs as MantineTabs,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconDeviceGamepad,
  IconDisc,
  IconLego,
  IconMovie,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { GetStaticPropsContext, NextPage } from 'next';
import { UserConfig } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { tabsAtom } from '../atoms/tabsAtom';
import { CustomCard } from '../components/Card/CustomCard';
import { TabProps } from '../components/Tabs/Tab';
import { Tabs } from '../components/Tabs/Tabs';

export type CustomInternalizationConfig = {
  _nextI18Next?: {
    initialI18nStore: any;
    initialLocale: string;
    ns: string[];
    userConfig: UserConfig | null;
  };
};

export interface InternalizationStaticProps {
  props: CustomInternalizationConfig;
}

const useStyles = createStyles(theme => ({
  container: {
    marginTop: 80,
    aspectRatio: '960/300',
    width: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundImage:
      theme.colorScheme === 'dark'
        ? 'url(/icons/dark-home-waves.svg)'
        : 'url(/icons/light-home-waves.svg)',
  },
}));

export const homeTabs: TabProps[] = [
  { value: 'anime', i18nKey: 'tabs:anime', icon: <IconLego size={24} /> },
  { value: 'movies', i18nKey: 'tabs:movies', icon: <IconMovie size={24} /> },
  {
    value: 'games',
    i18nKey: 'tabs:games',
    icon: <IconDeviceGamepad size={24} />,
  },
  { value: 'music', i18nKey: 'tabs:music', icon: <IconDisc size={24} /> },
];

const HomePage: NextPage<InternalizationStaticProps> = () => {
  const matchesDesktop = useMediaQuery('(min-width: 768px)', true, {
    getInitialValueInEffect: false,
  });
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [tabs, setTabs] = useRecoilState(tabsAtom);

  useEffect(() => {
    if (!tabs.tabs.length)
      setTabs({ defaultValue: 'anime', tabs: homeTabs, view: 'home' });
  }, []);

  return (
    <div className={classes.container}>
      <NextSeo title="Home" description="Home of all content" />
      <Flex
        direction="row"
        justify="flex-start"
        align="flex-start"
        px="md"
        py="xl"
        h="fit-content"
        mb={80}
      >
        {matchesDesktop && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.1 } }}
            exit={{ x: -100, opacity: 0 }}
          >
            <Stack align="flex-start" justify="flex-start" w={200} h={300}>
              <MantineTabs
                variant="pills"
                orientation="vertical"
                defaultValue={tabs.defaultValue}
                color={theme.colorScheme === 'dark' ? 'orange' : 'indigo'}
              >
                <Tabs tabs={tabs.tabs} />
              </MantineTabs>
            </Stack>
          </motion.div>
        )}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.2 } }}
          exit={{ x: 100, opacity: 0 }}
        >
          <Flex
            direction="row"
            align="start"
            justify="center"
            wrap="wrap"
            w="100%"
            gap="xl"
          >
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
            <CustomCard />
          </Flex>
        </motion.div>
      </Flex>
      <Center w="100%" inline mb={80}>
        <Pagination
          total={10}
          color={theme.colorScheme === 'dark' ? 'dark' : 'teal'}
          size={matchesDesktop ? 'lg' : 'md'}
          radius="md"
        />
      </Center>
    </div>
  );
};

export const getStaticProps: ({
  locale,
}: GetStaticPropsContext) => Promise<InternalizationStaticProps> = async ({
  locale,
}) => {
  const config = await serverSideTranslations(locale ?? 'en', [
    'common',
    'tabs',
    'notifications',
  ]);
  return {
    props: {
      ...config,
    },
  };
};

export default HomePage;
