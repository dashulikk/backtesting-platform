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
      let baseParams = {};
      if (strategy.type === 'PercentageSMAStrategy') {
        baseParams = {
          days: strategy.days ?? '',
          percentage_change: strategy.percentage_change ?? '',
          direction: strategy.direction ?? '',
          position_type: strategy.position_type ?? '',
          stop_loss_pct: strategy.stop_loss_pct ?? '',
          take_profit_pct: strategy.take_profit_pct ?? ''
        };
      } else if (strategy.type === 'RSIStrategy') {
        baseParams = {
          period: strategy.period ?? '',
          rsi_threshold: strategy.rsi_threshold ?? '',
          position_type: strategy.position_type ?? '',
          stop_loss_pct: strategy.stop_loss_pct ?? '',
          take_profit_pct: strategy.take_profit_pct ?? ''
        };
      } else if (strategy.type === 'VolumeMAStrategy') {
        baseParams = {
          days: strategy.days ?? '',
          stop_loss_pct: strategy.stop_loss_pct ?? '',
          take_profit_pct: strategy.take_profit_pct ?? ''
        };
      }
      setParameters(baseParams);
    }
  }, [opened, strategy]); // ✅ FIXED dependency

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
      if (strategy.type === 'VolumeMAStrategy' && !parameters.days) {
        throw new Error('Days is required for Volume MA Strategy');
      }

      // Clean stop_loss_pct and take_profit_pct to ensure they are numbers or undefined
      const cleanedParams = { ...parameters };
      if (cleanedParams.stop_loss_pct === '' || cleanedParams.stop_loss_pct === null) {
        delete cleanedParams.stop_loss_pct;
      } else {
        cleanedParams.stop_loss_pct = Number(cleanedParams.stop_loss_pct);
      }
      if (cleanedParams.take_profit_pct === '' || cleanedParams.take_profit_pct === null) {
        delete cleanedParams.take_profit_pct;
      } else {
        cleanedParams.take_profit_pct = Number(cleanedParams.take_profit_pct);
      }

      const strategyData = {
        strategy: {
          name: strategy.name,
          type: strategy.type,
          ...cleanedParams
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

    const stopLossInput = (
      <NumberInput
        label="Stop Loss (%)"
        description="Optional: Exit position if price moves against you by this percentage"
        value={parameters.stop_loss_pct === null || parameters.stop_loss_pct === undefined ? '' : parameters.stop_loss_pct}
        onChange={(value) => setParameters({ ...parameters, stop_loss_pct: value })}
        min={0}
        precision={2}
      />
    );

    const takeProfitInput = (
      <NumberInput
        label="Take Profit (%)"
        description="Optional: Exit position if price moves in your favor by this percentage"
        value={parameters.take_profit_pct === null || parameters.take_profit_pct === undefined ? '' : parameters.take_profit_pct}
        onChange={(value) => setParameters({ ...parameters, take_profit_pct: value })}
        min={0}
        precision={2}
      />
    );

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
            {stopLossInput}
            {takeProfitInput}
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
            {stopLossInput}
            {takeProfitInput}
          </Stack>
        );
      case 'VolumeMAStrategy':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Days"
              description="Number of days for volume moving average calculation"
              value={parameters.days || 0}
              onChange={(value) => setParameters({ ...parameters, days: value })}
              min={1}
              required
            />
            {stopLossInput}
            {takeProfitInput}
          </Stack>
        );
      default:
        return (
          <Stack spacing="md">
            {stopLossInput}
            {takeProfitInput}
          </Stack>
        );
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
