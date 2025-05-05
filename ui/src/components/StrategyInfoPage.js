import React from 'react';
import {
  Container,
  Title,
  Stack,
  Text,
  Paper,
  Group,
  ActionIcon,
  List,
  ThemeIcon,
  rem,
  Box,
} from '@mantine/core';
import { IconArrowLeft, IconChartLine, IconInfoCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const strategies = [
  {
    name: 'Simple Moving Average (SMA)',
    description: 'This strategy helps identify potential buying opportunities by comparing a stock\'s current price to its average price over a specific period.',
    useCase: 'Useful for identifying trends and potential entry points when a stock\'s price moves above its average.',
    parameters: [
      { name: 'days', description: 'The number of days to calculate the average price' }
    ],
    strategyLogic: 'When a stock\'s current price rises above its average price over the specified period, it may indicate an upward trend and potential buying opportunity.'
  },
  {
    name: 'Relative Strength Index (RSI)',
    description: 'This strategy helps identify when a stock might be oversold and due for a price increase.',
    useCase: 'Helpful for finding potential buying opportunities when a stock has been declining and might be ready to bounce back.',
    parameters: [
      { name: 'period', description: 'The time period used to calculate the RSI (typically 14 days)' }
    ],
    strategyLogic: 'When the RSI falls below 30, it suggests the stock might be oversold and could be a good time to consider buying.'
  },
  {
    name: 'Volume-based Moving Average',
    description: 'This strategy looks for unusual trading activity by comparing current trading volume to its average.',
    useCase: 'Useful for identifying potential price movements when trading activity increases significantly.',
    parameters: [
      { name: 'days', description: 'The number of days used to calculate the average trading volume' }
    ],
    strategyLogic: 'When trading volume is significantly higher than its average, it may indicate increased interest in the stock and potential price movement.'
  },
  {
    name: 'Moving Average Convergence Divergence (MACD)',
    description: 'This strategy helps identify changes in momentum by comparing two different moving averages.',
    useCase: 'Effective for spotting potential trend changes and momentum shifts in stock prices.',
    parameters: [
      { name: 'fast', description: 'The shorter time period for the faster moving average' },
      { name: 'slow', description: 'The longer time period for the slower moving average' },
      { name: 'signal', description: 'The period used to calculate the signal line' }
    ],
    strategyLogic: 'When the faster moving average crosses above the slower one, it may signal the start of an upward trend.'
  },
  {
    name: 'Standard Deviation',
    description: 'This strategy helps identify when a stock\'s price is moving unusually far from its average.',
    useCase: 'Useful for spotting potential breakouts or significant price movements.',
    parameters: [
      { name: 'days', description: 'The number of days used to calculate the standard deviation' }
    ],
    strategyLogic: 'When a stock\'s price moves significantly away from its average (more than 2 standard deviations), it may indicate a potential trading opportunity.'
  },
  {
    name: 'Dividend Strategy',
    description: 'This strategy focuses on stocks that pay dividends, looking for opportunities around dividend payment dates.',
    useCase: 'Ideal for investors interested in regular income from their investments.',
    parameters: [
      { name: 'min_yield', description: 'The minimum dividend yield percentage to consider' },
      { name: 'payment_frequency', description: 'How often the company pays dividends (quarterly, monthly, etc.)' },
      { name: 'growth_rate', description: 'The minimum annual dividend growth rate to consider' }
    ],
    strategyLogic: 'When a company announces or pays a dividend, it may present a good opportunity to invest in the stock.'
  },
  {
    name: 'Sentiment Analysis',
    description: 'This strategy uses market sentiment indicators to identify potential trading opportunities.',
    useCase: 'Helpful for understanding how market participants feel about a stock and potential price movements.',
    parameters: [
      { name: 'sentiment_threshold', description: 'The minimum sentiment score required to consider a trade' },
      { name: 'lookback_period', description: 'Number of days to analyze for sentiment trends' },
      { name: 'source_weight', description: 'Importance given to different sentiment sources (news, social media, etc.)' }
    ],
    strategyLogic: 'When market sentiment becomes significantly positive, it may indicate a good time to consider buying the stock.'
  }
];

const StrategyInfoPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#1A1B1E', minHeight: '100vh', color: '#C1C2C5' }}>
      <Container size="xl" p="md">
        <Stack spacing="lg">
          <Group>
            <ActionIcon 
              onClick={() => navigate(-1)} 
              variant="subtle"
              color="gray"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2} c="gray.3">Strategy Information</Title>
          </Group>

          <Text size="lg" c="dimmed">
            Learn about the different trading strategies available in the platform and how they can help you make informed investment decisions.
          </Text>

          <Stack spacing="md">
            {strategies.map((strategy, index) => (
              <Paper 
                key={index} 
                p="lg"
                radius="md"
                sx={(theme) => ({
                  backgroundColor: theme.colors.dark[6],
                  border: `1px solid ${theme.colors.dark[4]}`,
                  '&:hover': {
                    backgroundColor: theme.colors.dark[5],
                  },
                })}
              >
                <Stack spacing="md">
                  <Group>
                    <ThemeIcon 
                      size="lg" 
                      radius="md" 
                      variant="light"
                      color="blue"
                    >
                      <IconChartLine size={20} />
                    </ThemeIcon>
                    <Title order={3} c="gray.3">{strategy.name}</Title>
                  </Group>

                  <Text c="dimmed">{strategy.description}</Text>

                  <Box 
                    sx={(theme) => ({
                      backgroundColor: theme.colors.dark[7],
                      padding: theme.spacing.sm,
                      borderRadius: theme.radius.sm,
                    })}
                  >
                    <Group mb="xs">
                      <ThemeIcon size="sm" color="blue" variant="light">
                        <IconInfoCircle size={rem(14)} />
                      </ThemeIcon>
                      <Text fw={500} c="gray.3">When to Use</Text>
                    </Group>
                    <Text size="sm" c="dimmed">{strategy.useCase}</Text>
                  </Box>

                  <Box 
                    sx={(theme) => ({
                      backgroundColor: theme.colors.dark[7],
                      padding: theme.spacing.sm,
                      borderRadius: theme.radius.sm,
                    })}
                  >
                    <Group mb="xs">
                      <ThemeIcon size="sm" color="blue" variant="light">
                        <IconInfoCircle size={rem(14)} />
                      </ThemeIcon>
                      <Text fw={500} c="gray.3">Parameters</Text>
                    </Group>
                    <List 
                      spacing="xs"
                      size="sm"
                      c="dimmed"
                      icon={
                        <ThemeIcon color="blue" size={16} radius="xl">
                          <IconInfoCircle size={rem(10)} />
                        </ThemeIcon>
                      }
                    >
                      {strategy.parameters.map((param, i) => (
                        <List.Item key={i}>
                          <Text component="span" fw={500} c="gray.4">{param.name}:</Text>{' '}
                          <Text component="span" c="dimmed">{param.description}</Text>
                        </List.Item>
                      ))}
                    </List>
                  </Box>

                  <Box 
                    sx={(theme) => ({
                      backgroundColor: theme.colors.dark[7],
                      padding: theme.spacing.sm,
                      borderRadius: theme.radius.sm,
                    })}
                  >
                    <Group mb="xs">
                      <ThemeIcon size="sm" color="blue" variant="light">
                        <IconInfoCircle size={rem(14)} />
                      </ThemeIcon>
                      <Text fw={500} c="gray.3">How It Works</Text>
                    </Group>
                    <Text size="sm" c="dimmed">{strategy.strategyLogic}</Text>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default StrategyInfoPage; 