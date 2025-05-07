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
    name: 'Percentage-based Simple Moving Average (SMA)',
    description: 'This strategy identifies trading opportunities based on percentage deviations from a Simple Moving Average. It enters positions when the price moves significantly away from the moving average, either above or below, by a specified percentage.',
    useCase: 'Useful for identifying both mean reversion opportunities (when price deviates significantly from the average) and trend continuation signals (when price breaks away from the average).',
    parameters: [
      { 
        name: 'Days', 
        description: 'The number of days used to calculate the Simple Moving Average. Longer periods (20-50 days) provide smoother trends, while shorter periods (5-10 days) are more responsive to recent price changes.' 
      },
      { 
        name: 'Percentage Change', 
        description: 'The minimum percentage deviation from the SMA required to trigger a trade. For example, a value of 2 means the price must deviate by at least 2% from the SMA. This helps filter out small price movements.' 
      },
      { 
        name: 'Direction', 
        description: 'Determines whether to enter when price drops below (Drop) or rises above (Rise) the SMA. Drop is typically used for long positions, while Rise is used for short positions.' 
      },
      { 
        name: 'Position Type', 
        description: 'Specifies whether to take a long or short position. Long positions profit from price increases, while short positions profit from price decreases.' 
      }
    ],
    strategyLogic: 'The strategy calculates a Simple Moving Average over the specified number of days. When the current price deviates from the SMA by the specified percentage in the chosen direction, a position is entered. This approach helps identify potential mean reversion opportunities or trend continuation signals, depending on the chosen parameters.'
  },
  {
    name: 'Relative Strength Index (RSI)',
    description: 'This strategy uses the Relative Strength Index (RSI) to identify overbought and oversold conditions. It enters a long position when the RSI falls below a specified threshold (e.g., 30), indicating oversold conditions, or a short position when the RSI rises above (100 - threshold), indicating overbought conditions.',
    useCase: 'Helpful for finding potential buying opportunities when a stock has been declining and might be ready to bounce back, or selling opportunities when a stock is overbought.',
    parameters: [
      { name: 'Period', description: 'The number of days used to calculate the RSI (typical value: 14).' },
      { name: 'RSI Threshold', description: 'The RSI value used to trigger entry. For long positions, enter when RSI is below this value (e.g., 30). For short positions, enter when RSI is above (100 - threshold) (e.g., 70).' },
      { name: 'Position Type', description: 'Select LONG to buy in oversold conditions or SHORT to sell in overbought conditions.' }
    ],
    strategyLogic: 'The strategy calculates the RSI over the specified period. For LONG positions, it enters when the RSI falls below the threshold (e.g., 30). For SHORT positions, it enters when the RSI rises above (100 - threshold) (e.g., 70). This helps identify potential mean reversion opportunities in both directions.'
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