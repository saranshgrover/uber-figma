import React, { useState } from 'react';
import {
  Button,
  Input,
  Heading,
  Box,
  Flex,
  IconButton,
  FormHelperText,
  FormControl,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import { RepeatIcon, SearchIcon } from '@chakra-ui/icons';
import FigmaNode from './FigmaNode';

function App() {
  const [selections, setSelections] = useState<any[]>([]);
  const [input, setInput] = useState<string>('');
  const [renameInput, setRenameInput] = useState<string>('');

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      }
      if (type === 'selectionchange') {
        console.log(event.data.pluginMessage.frames);
        setSelections(event.data.pluginMessage.frames.map((f) => ({ ...f, selected: true })));
        if (event.data.pluginMessage.frames.length > 0) {
          setInput(event.data.pluginMessage.frames[0].name);
        }
      }
    };
  }, []);

  const onReset = () => {
    setSelections([]);
    setInput('');
    setRenameInput('');
    parent.postMessage({ pluginMessage: { type: 'reset' } }, '*');
  };

  const onSearch = () => {
    parent.postMessage({ pluginMessage: { type: 'search', query: input } }, '*');
  };

  const rename = () => {
    const layers = selections.filter((s) => s.selected).map((s) => s.id);
    parent.postMessage(
      {
        pluginMessage: {
          type: 'rename',
          layers,
          newName: renameInput,
        },
      },
      '*'
    );
  };

  return (
    <Box mx={2}>
      <Flex mt={2} justify="center" align="center" gap={2} className="nav">
        <Heading size={'lg'}>Layer Rename</Heading>
        <IconButton onClick={onReset} right={0} position={'absolute'} variant={'ghost'} size="sm" aria-label="Reset">
          <RepeatIcon />
        </IconButton>
      </Flex>

      <Box mt={'2em'} minH="70%">
        <Flex w="100%" justify={'space-around'} align="flex-start" className="input">
          <FormControl>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              size={'sm'}
              w={'95%'}
              placeholder="Search..."
            />
            <FormHelperText fontSize={'xs'}>Select Layer or Search by name</FormHelperText>
          </FormControl>

          <IconButton
            isDisabled={!input}
            size={'sm'}
            w="10%"
            colorScheme="blue"
            aria-label="Search Current Page"
            icon={<SearchIcon />}
            onClick={onSearch}
          />
        </Flex>

        {selections.length > 0 && (
          <Box>
            <Flex align="center" justify={'flex-start'} my={2} px={2} ml={2} w="90%" minH={'30px'}>
              <Text w="85%">{`${selections.filter((s) => s.selected).length} layers selected`}</Text>
              <Checkbox
                isChecked={!selections.some((s) => !s.selected)}
                onChange={(e) => setSelections(selections.map((s) => ({ ...s, selected: e.target.checked })))}
              />
            </Flex>

            {selections &&
              [...selections].map((selection) => (
                <FigmaNode
                  key={selection.id}
                  node={selection}
                  changeSelect={() =>
                    setSelections([
                      ...selections.map((s) =>
                        s.id === selection.id ? { ...s, selected: !selection.selected } : { ...s }
                      ),
                    ])
                  }
                />
              ))}
          </Box>
        )}
      </Box>
      <Flex justify="center" mx={2} gap={'0.5rem'} align="center">
        <Input
          value={renameInput}
          onChange={(e) => setRenameInput(e.target.value)}
          isDisabled={selections.filter((s) => s.selected).length === 0}
          variant="outline"
          placeholder="Rename to.."
        />
        <Button isDisabled={!renameInput} onClick={rename} variant={'solid'} colorScheme="blue" size={'md'} px={5}>
          Rename
        </Button>
      </Flex>
    </Box>
  );
}

export default App;
