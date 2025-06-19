"use client";

import {
  Box,
  Text,
  Heading,
  Button,
  HStack,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ExternalLink, Calendar } from "lucide-react";
import { Dataset } from "@/types/dataset";

interface DatasetCardProps {
  dataset: Dataset;
}

const fileTypeColors: Record<string, string> = {
  CSV: "green",
  Excel: "brand",
  JSON: "purple",
  PDF: "red",
  API: "secondary",
  Database: "teal",
};

export function DatasetCard({ dataset }: DatasetCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box
      height="100%"
      bg="white"
      shadow="md"
      _hover={{
        transform: "translateY(-4px)",
        shadow: "xl",
        borderColor: "brand.300",
      }}
      transition="all 0.3s ease"
      borderRadius="xl"
      border="1px"
      borderColor="gray.200"
      cursor="pointer"
      p={6}
    >
      <VStack align="stretch" height="100%" spacing={4}>
        <Box>
          <Heading size="md" color="gray.800" mb={3} fontWeight="700">
            {dataset.title}
          </Heading>
          <Box
            display="inline-block"
            px={3}
            py={1}
            borderRadius="full"
            bg={`${fileTypeColors[dataset.fileType] || "gray"}.500`}
            color="white"
            fontSize="xs"
            fontWeight="600"
          >
            {dataset.fileType}
          </Box>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="600" color="brand.600" mb={1}>
            🗂️ โปรเจกต์
          </Text>
          <Text fontSize="sm" color="gray.600">
            {dataset.project}
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
            📝 คำอธิบาย
          </Text>
          <Text
            fontSize="sm"
            color="gray.600"
            overflow="hidden"
            textOverflow="ellipsis"
            display="-webkit-box"
            sx={{
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {dataset.description}
          </Text>
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1}>
            🏢 หน่วยงาน
          </Text>
          <Text fontSize="sm" color="gray.600">
            {dataset.sourceName}
          </Text>
        </Box>

        <Box>
          <Wrap spacing={2}>
            {dataset.tags.slice(0, 3).map((tag) => (
              <WrapItem key={tag}>
                <Box
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="brand.100"
                  color="brand.700"
                  fontSize="xs"
                  fontWeight="500"
                >
                  {tag}
                </Box>
              </WrapItem>
            ))}
            {dataset.tags.length > 3 && (
              <WrapItem>
                <Box
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="gray.100"
                  color="gray.600"
                  fontSize="xs"
                  fontWeight="500"
                >
                  +{dataset.tags.length - 3}
                </Box>
              </WrapItem>
            )}
          </Wrap>
        </Box>

        <Box mt="auto">
          <HStack fontSize="xs" color="gray.500" mb={3}>
            <Calendar size={12} />
            <Text>อัปเดต: {formatDate(dataset.dateUpdated)}</Text>
          </HStack>

          <Button
            size="sm"
            colorScheme="brand"
            variant="solid"
            rightIcon={<ExternalLink size={14} />}
            borderRadius="full"
            width="100%"
            fontWeight="600"
            onClick={() => window.open(dataset.sourceLink, "_blank")}
            _hover={{
              transform: "translateY(-1px)",
              shadow: "md",
            }}
          >
            🔗 ดู/ดาวน์โหลด
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
