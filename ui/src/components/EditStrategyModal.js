import { useState, useEffect } from 'react';
import {
  Modal,
  NumberInput,
  Button,
  Stack,
  Group,
  Text,
  Select,
} from '@mantine/core';

const EditStrategyModal = ({ opened, onClose, onSubmit, strategy }) => {
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (opened && strategy) {
      if (strategy.type === 'PercentageSMAStrategy') {
        setParameters({
          days: strategy.days || 0,
          percentage_change: strategy.percentage_change || 0,
          direction: strategy.direction || '',
          position_type: strategy.position_type || ''
        });
      } else if (strategy.type === 'RSIStrategy') {
        setParameters({
          period: strategy.period || 0,
          rsi_threshold: strategy.rsi_threshold || 0,
          position_type: strategy.position_type || ''
        });
      }
    }
  }, [opened, strategy]);

  const handleSubmit = async () => {
    if (!strategy.name) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validate required fields based on strategy type
      if (strategy.type === 'PercentageSMAStrategy' && (!parameters.days || !parameters.percentage_change || !parameters.direction || !parameters.position_type)) {
        throw new Error('All parameters are required for Percentage SMA Strategy');
      }
      if (strategy.type === 'RSIStrategy' && (!parameters.period || !parameters.rsi_threshold || !parameters.position_type)) {
        throw new Error('All parameters are required for RSI Strategy');
      }

      // Match the exact API format
      const strategyData = {
        strategy: {
          name: strategy.name,
          type: strategy.type,
          ...parameters
        }
      };

      await onSubmit(strategyData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderParameterInputs = () => {
    if (!strategy) return null;

    switch (strategy.type) {
      case 'PercentageSMAStrategy':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Days"
              value={parameters.days || 0}
              onChange={(value) => setParameters({ ...parameters, days: value })}
              min={1}
              required
            />
            <NumberInput
              label="Percentage Change"
              value={parameters.percentage_change || 0}
              onChange={(value) => setParameters({ ...parameters, percentage_change: value })}
              min={0}
              precision={2}
              required
            />
            <Select
              label="Direction"
              value={parameters.direction || ''}
              onChange={(value) => setParameters({ ...parameters, direction: value })}
              data={[
                { value: 'drop', label: 'Drop' },
                { value: 'rise', label: 'Rise' }
              ]}
              required
            />
            <Select
              label="Position Type"
              value={parameters.position_type || ''}
              onChange={(value) => setParameters({ ...parameters, position_type: value })}
              data={[
                { value: 'long', label: 'Long' },
                { value: 'short', label: 'Short' }
              ]}
              required
            />
          </Stack>
        );
      case 'RSIStrategy':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Period"
              description="Number of days used to calculate RSI (typical value: 14)"
              value={parameters.period || 0}
              onChange={(value) => setParameters({ ...parameters, period: value })}
              min={1}
              max={100}
              required
            />
            <NumberInput
              label="RSI Threshold"
              description="RSI level used to trigger entry. Values below 30 indicate oversold conditions."
              value={parameters.rsi_threshold || 0}
              onChange={(value) => setParameters({ ...parameters, rsi_threshold: value })}
              min={0}
              max={100}
              precision={1}
              required
            />
            <Select
              label="Position Type"
              description="Select LONG to buy in oversold conditions or SHORT to sell in overbought conditions."
              value={parameters.position_type || ''}
              onChange={(value) => setParameters({ ...parameters, position_type: value })}
              data={[
                { value: 'long', label: 'Long' },
                { value: 'short', label: 'Short' }
              ]}
              required
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Strategy"
      size="md"
    >
      <Stack spacing="md">
        <Group position="apart">
          <Text weight={500}>Strategy Name:</Text>
          <Text>{strategy?.name}</Text>
        </Group>
        <Group position="apart">
          <Text weight={500}>Strategy Type:</Text>
          <Text>{strategy?.type}</Text>
        </Group>

        <Text weight={500} mt="md">Parameters</Text>
        {renderParameterInputs()}

        {error && (
          <Text color="red" size="sm">
            {error}
          </Text>
        )}

        <Group position="right" mt="md">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            loading={loading}
            disabled={
              (strategy?.type === 'PercentageSMAStrategy' && (!parameters.days || !parameters.percentage_change || !parameters.direction || !parameters.position_type)) ||
              (strategy?.type === 'RSIStrategy' && (!parameters.period || !parameters.rsi_threshold || !parameters.position_type))
            }
          >
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditStrategyModal; 