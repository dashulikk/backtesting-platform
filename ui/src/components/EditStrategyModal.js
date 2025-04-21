import { useState, useEffect } from 'react';
import {
  Modal,
  NumberInput,
  Button,
  Stack,
  Group,
  Text,
} from '@mantine/core';

const EditStrategyModal = ({ opened, onClose, onSubmit, strategy }) => {
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (opened && strategy) {
      // Extract parameters based on strategy type
      if (strategy.type === 'ExampleStrategy') {
        setParameters({
          days: strategy.days || 0,
          n: strategy.n || 0
        });
      } else if (strategy.type === 'ExampleStrategy2') {
        setParameters({
          a: strategy.a || 0,
          b: strategy.b || 0
        });
      }
    }
  }, [opened, strategy]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields based on strategy type
      if (strategy.type === 'ExampleStrategy' && (!parameters.days || !parameters.n)) {
        throw new Error('Days and N are required for ExampleStrategy');
      }
      if (strategy.type === 'ExampleStrategy2' && (!parameters.a || !parameters.b)) {
        throw new Error('Parameters A and B are required for ExampleStrategy2');
      }

      // Match the exact API format
      const strategyData = {
        strategy: {
          name: strategy.name,
          type: strategy.type,
          ...(strategy.type === 'ExampleStrategy'
            ? { days: Number(parameters.days), n: Number(parameters.n) }
            : { a: Number(parameters.a), b: Number(parameters.b) })
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
    switch (strategy?.type) {
      case 'ExampleStrategy':
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
              label="N"
              value={parameters.n || 0}
              onChange={(value) => setParameters({ ...parameters, n: value })}
              min={1}
              required
            />
          </Stack>
        );
      case 'ExampleStrategy2':
        return (
          <Stack spacing="md">
            <NumberInput
              label="Parameter A"
              value={parameters.a || 0}
              onChange={(value) => setParameters({ ...parameters, a: value })}
              required
            />
            <NumberInput
              label="Parameter B"
              value={parameters.b || 0}
              onChange={(value) => setParameters({ ...parameters, b: value })}
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
              (strategy?.type === 'ExampleStrategy' && (!parameters.days || !parameters.n)) || 
              (strategy?.type === 'ExampleStrategy2' && (!parameters.a || !parameters.b))
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