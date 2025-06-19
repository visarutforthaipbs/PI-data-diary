"use client";

import { Box, Button, Wrap, WrapItem } from "@chakra-ui/react";
import { availableFileTypes, availableTags } from "@/data/mockData";

interface FilterChipsProps {
  selectedFileTypes: string[];
  selectedTags: string[];
  onFileTypeToggle: (fileType: string) => void;
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export function FilterChips({
  selectedFileTypes,
  selectedTags,
  onFileTypeToggle,
  onTagToggle,
  onClearAll,
}: FilterChipsProps) {
  const hasFilters = selectedFileTypes.length > 0 || selectedTags.length > 0;

  return (
    <Box>
      <Box mb={4}>
        <Box fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
          ประเภทไฟล์:
        </Box>
        <Wrap spacing={2}>
          {availableFileTypes.map((fileType) => (
            <WrapItem key={fileType}>
              <Button
                size="sm"
                variant={
                  selectedFileTypes.includes(fileType) ? "solid" : "outline"
                }
                colorScheme={
                  selectedFileTypes.includes(fileType) ? "brand" : "gray"
                }
                onClick={() => onFileTypeToggle(fileType)}
                borderRadius="full"
              >
                {fileType}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Box>

      <Box mb={4}>
        <Box fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
          แท็ก:
        </Box>
        <Wrap spacing={2}>
          {availableTags.slice(0, 12).map((tag) => (
            <WrapItem key={tag}>
              <Button
                size="sm"
                variant={selectedTags.includes(tag) ? "solid" : "outline"}
                colorScheme={selectedTags.includes(tag) ? "purple" : "gray"}
                onClick={() => onTagToggle(tag)}
                borderRadius="full"
              >
                {tag}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Box>

      {hasFilters && (
        <Button
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={onClearAll}
          borderRadius="full"
        >
          ล้างตัวกรองทั้งหมด
        </Button>
      )}
    </Box>
  );
}
