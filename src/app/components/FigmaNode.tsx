import { ViewIcon } from '@chakra-ui/icons';
import { Checkbox, Divider, Flex, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  node: {
    name: string;
    id: string;
    selected: boolean;
  };
  changeSelect: () => void;
};

export default function FigmaNode({ node, changeSelect }: Props) {
  return (
    <Flex
      align="center"
      justify={'flex-start'}
      my={2}
      px={2}
      ml={2}
      w="90%"
      minH={'30px'}
      borderRadius={'lg'}
      border="2px solid"
      borderColor={'purple.200'}
    >
      <ViewIcon w={'10%'} />
      <Divider orientation="vertical" />
      <Text w="75%" noOfLines={1}>
        {node.name}
      </Text>
      <Checkbox isChecked={node.selected} onChange={changeSelect} />
    </Flex>
  );
}
