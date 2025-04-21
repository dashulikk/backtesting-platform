import { Container, Title, Text, Button, Group, Stack, Card, ThemeIcon, Grid } from '@mantine/core';
import { IconChartLine, IconChartBar, IconChartCandle } from '@tabler/icons-react';

const HomePage = ({ onNavigate }) => {
  return (
    <Container size="xl" py="xl" style={{ overflowY: 'auto', height: '100%' }}>
      <Stack spacing="xl">
        {/* Hero Section */}
        <Card withBorder p="xl">
          <Stack spacing="md">
            <Title order={1}>Welcome to Backtesting Platform</Title>
            <Text size="lg" color="dimmed">
              Test and optimize your trading strategies with our powerful backtesting engine.
            </Text>
            <Group>
              <Button size="lg" onClick={() => onNavigate('environments')}>
                View Environments
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Features Section */}
        <Grid>
          <Grid.Col span={4}>
            <Card withBorder p="md">
              <Stack spacing="md">
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconChartLine size={20} />
                </ThemeIcon>
                <Title order={3}>Strategy Testing</Title>
                <Text color="dimmed">
                  Test your trading strategies against historical market data to evaluate their performance.
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card withBorder p="md">
              <Stack spacing="md">
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconChartBar size={20} />
                </ThemeIcon>
                <Title order={3}>Strategy Optimization</Title>
                <Text color="dimmed">
                  Optimize your strategy parameters to find the best combination for maximum returns.
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card withBorder p="md">
              <Stack spacing="md">
                <ThemeIcon size="lg" radius="md" variant="light" color="blue">
                  <IconChartCandle size={20} />
                </ThemeIcon>
                <Title order={3}>Performance Analysis</Title>
                <Text color="dimmed">
                  Analyze your strategy's performance with detailed metrics and visualizations.
                </Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Getting Started Section */}
        <Card withBorder p="xl">
          <Stack spacing="md">
            <Title order={2}>Getting Started</Title>
            <Grid>
              <Grid.Col span={6}>
                <Card withBorder p="md">
                  <Stack spacing="md">
                    <Title order={3}>View Environments</Title>
                    <Text color="dimmed">
                      Browse your existing environments and their associated strategies.
                    </Text>
                    <Button onClick={() => onNavigate('environments')}>
                      Go to Environments
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card withBorder p="md">
                  <Stack spacing="md">
                    <Title order={3}>Manage Strategies</Title>
                    <Text color="dimmed">
                      View and manage your trading strategies across different environments.
                    </Text>
                    <Button onClick={() => onNavigate('strategies')}>
                      Go to Strategies
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
};

export default HomePage; 