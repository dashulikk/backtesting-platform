import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Card, ThemeIcon, Grid, SimpleGrid } from '@mantine/core';
import { IconChartLine, IconChartBar, IconChartCandle, IconDatabase, IconReportAnalytics, IconBook } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Environments',
      description: 'Create and manage your trading environments with custom stock selections and date ranges.',
      icon: IconDatabase,
      path: '/environments',
    },
    {
      title: 'Strategies',
      description: 'Configure and test different trading strategies with customizable parameters.',
      icon: IconChartBar,
      path: '/strategies',
    },
    {
      title: 'Strategy Info',
      description: 'Learn about available trading strategies, their parameters, and how they work.',
      icon: IconBook,
      path: '/strategy-info',
    },
    {
      title: 'Backtesting Results',
      description: 'Analyze the performance of your strategies with detailed reports and visualizations.',
      icon: IconReportAnalytics,
      path: '/backtesting-results',
    },
  ];

  return (
    <Container size="xl" p="md">
      <Stack spacing="xl">
        <Group>
          <ThemeIcon size="lg" radius="md" variant="light" color="blue">
            <IconChartLine size={20} />
          </ThemeIcon>
          <Title order={2}>Welcome to Backtesting Platform</Title>
        </Group>

        <Text size="lg" color="dimmed">
          Create trading environments, configure strategies, and analyze backtesting results to optimize your trading approach.
        </Text>

        <SimpleGrid cols={2} spacing="md">
          {features.map((feature, index) => (
            <Card key={index} p="md" withBorder>
              <Stack spacing="md">
                <Group>
                  <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                    <feature.icon size={20} />
                  </ThemeIcon>
                  <Title order={3}>{feature.title}</Title>
                </Group>
                <Text>{feature.description}</Text>
                <Button
                  variant="light"
                  onClick={() => navigate(feature.path)}
                  leftIcon={<feature.icon size={16} />}
                >
                  Go to {feature.title}
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default HomePage; 