"use client";

import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "ค้นหาชุดข้อมูล...",
}: SearchBarProps) {
  return (
    <Box maxW="500px" w="full">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={Search} color="gray.400" />
        </InputLeftElement>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          bg="white"
          border="1px"
          borderColor="gray.200"
          _focus={{
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          }}
          size="lg"
          borderRadius="xl"
        />
      </InputGroup>
    </Box>
  );
}
