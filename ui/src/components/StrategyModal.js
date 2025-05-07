import { useState, useEffect } from 'react';
import {
  Modal,
  TextInput,
  Select,
  NumberInput,
  Button,
  Stack,
  Group,
  Text,
  Divider
} from '@mantine/core';

const StrategyModal = ({ opened, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (opened) {
      setName('');
      setType('');
      setParameters({});
    }
  }, [opened]);

  const handleSubmit = async () => {
    if (!name || !type) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate required parameters based on strategy type
    if (type === 'RSIStrategy' && (!parameters.period || !parameters.rsi_threshold || !parameters.position_type)) {
      setError('Please fill in all required parameters');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validate required fields based on strategy type
      if (type === 'PercentageSMAStrategy' && (!parameters.days || !parameters.percentage_change || !parameters.direction || !parameters.position_type)) {
        throw new Error('All parameters are required for Percentage SMA Strategy');
      }

      // Create strategy data object
      const strategyData = {
        name,
        type,
        ...parameters
      };

      console.log('Submitting strategy data:', strategyData); // Debug log
      await onSubmit({ strategy: strategyData });
      onClose();
    } catch (err) {
      console.error('Error in handleSubmit:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderParameterInputs = () => {
    switch (type) {
      case 'PercentageSMAStrategy':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Days"
              description="Number of days to calculate the Simple Moving Average"
              value={parameters.days || 0}
              onChange={(value) => setParameters({ ...parameters, days: value })}
              min={1}
              required
            />
            <NumberInput
              label="Percentage Change"
              description="Minimum percentage deviation from SMA to trigger a trade"
              value={parameters.percentage_change || 0}
              onChange={(value) => setParameters({ ...parameters, percentage_change: value })}
              min={0}
              precision={2}
              required
            />
            <Select
              label="Direction"
              description="Whether to enter when price drops below or rises above SMA"
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
              description="Type of position to take (Long or Short)"
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
      title="Add Strategy"
      size="md"
    >
      <Stack spacing="md">
        <TextInput
          label="Strategy Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Select
          label="Strategy Type"
          value={type}
          onChange={setType}
          data={[
            { value: 'PercentageSMAStrategy', label: 'Percentage SMA Strategy' },
            { value: 'RSIStrategy', label: 'RSI Strategy' }
          ]}
          required
        />

        {type && (
          <>
            <Divider />
            <Text fw={500}>Parameters</Text>
            {renderParameterInputs()}
          </>
        )}

        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            loading={loading}
            disabled={!name || !type || 
                     (type === 'PercentageSMAStrategy' && (!parameters.days || !parameters.percentage_change || !parameters.direction || !parameters.position_type)) ||
                     (type === 'RSIStrategy' && (!parameters.period || !parameters.rsi_threshold || !parameters.position_type))}
          >
            Add Strategy
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default StrategyModal; 