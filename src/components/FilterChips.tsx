"use client";

import { Box, Button, Wrap, WrapItem, Text } from "@chakra-ui/react";
import { Dataset } from "@/types/dataset";
import { useMemo, useState } from "react";

interface FilterChipsProps {
  datasets: Dataset[];
  selectedFileTypes: string[];
  selectedTags: string[];
  onFileTypeToggle: (fileType: string) => void;
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export function FilterChips({
  datasets,
  selectedFileTypes,
  selectedTags,
  onFileTypeToggle,
  onTagToggle,
  onClearAll,
}: FilterChipsProps) {
  const hasFilters = selectedFileTypes.length > 0 || selectedTags.length > 0;
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllFileTypes, setShowAllFileTypes] = useState(false);

  // Extract unique file types from actual datasets with safety checks
  const availableFileTypes = useMemo(() => {
    const fileTypes = new Set<string>();
    datasets.forEach((dataset) => {
      if (
        dataset?.fileType &&
        typeof dataset.fileType === "string" &&
        dataset.fileType.trim()
      ) {
        // Normalize file type names
        const normalizedFileType = dataset.fileType.trim();
        fileTypes.add(normalizedFileType);
      }
    });
    return Array.from(fileTypes).sort((a, b) => a.localeCompare(b, "th"));
  }, [datasets]);

  // Extract unique tags from actual datasets with safety checks
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    datasets.forEach((dataset) => {
      if (dataset?.tags && Array.isArray(dataset.tags)) {
        dataset.tags.forEach((tag) => {
          if (tag && typeof tag === "string" && tag.trim()) {
            // Normalize tag names
            const normalizedTag = tag.trim();
            tags.add(normalizedTag);
          }
        });
      }
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b, "th"));
  }, [datasets]);

  // Show message when no data is available
  if (!datasets || datasets.length === 0) {
    return (
      <Box>
        <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
          ไม่มีข้อมูลสำหรับการกรอง
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <Box fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
          ประเภทไฟล์:
        </Box>
        <Wrap spacing={2}>
          {(showAllFileTypes
            ? availableFileTypes
            : availableFileTypes.slice(0, 8)
          ).map((fileType) => (
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
          {availableFileTypes.length > 8 && (
            <WrapItem>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="gray"
                onClick={() => setShowAllFileTypes(!showAllFileTypes)}
                borderRadius="full"
                fontSize="xs"
              >
                {showAllFileTypes
                  ? `ซ่อน`
                  : `+${availableFileTypes.length - 8} อื่นๆ`}
              </Button>
            </WrapItem>
          )}
        </Wrap>
      </Box>

      <Box mb={4}>
        <Box fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
          แท็ก:
        </Box>
        <Wrap spacing={2}>
          {(showAllTags ? availableTags : availableTags.slice(0, 12)).map(
            (tag) => (
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
            )
          )}
          {availableTags.length > 12 && (
            <WrapItem>
              <Button
                size="sm"
                variant="ghost"
                colorScheme="gray"
                onClick={() => setShowAllTags(!showAllTags)}
                borderRadius="full"
                fontSize="xs"
              >
                {showAllTags ? `ซ่อน` : `+${availableTags.length - 12} อื่นๆ`}
              </Button>
            </WrapItem>
          )}
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
