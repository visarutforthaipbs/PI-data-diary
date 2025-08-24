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
  // Safety check for dataset
  if (!dataset) {
    return (
      <Box
        height="200px"
        bg="gray.100"
        borderRadius="xl"
        p={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="gray.500">ข้อมูลไม่ถูกต้อง</Text>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "ไม่ระบุวันที่";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "วันที่ไม่ถูกต้อง";
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "วันที่ไม่ถูกต้อง";
    }
  };

  // Check if this is a PI-PublicIntelligence dataset
  const isPIDataset = dataset.sourceName === "PI-PublicIntelligence";

  // Safe access to dataset properties with defaults
  const safeDataset = {
    id: dataset.id || "unknown",
    title: dataset.title || "ไม่มีชื่อ",
    project: dataset.project || "ไม่ระบุโปรเจกต์",
    description: dataset.description || "ไม่มีคำอธิบาย",
    sourceName: dataset.sourceName || "ไม่ระบุแหล่งที่มา",
    sourceLink: dataset.sourceLink || "#",
    fileType: dataset.fileType || "Unknown",
    dateAcquired: dataset.dateAcquired || "",
    dateUpdated: dataset.dateUpdated || "",
    license: dataset.license || "ไม่ระบุ",
    tags: Array.isArray(dataset.tags)
      ? dataset.tags.filter((tag) => typeof tag === "string" && tag.trim())
      : [],
  };

  return (
    <Box
      height="100%"
      bg={isPIDataset ? "gradient.200" : "white"}
      shadow={isPIDataset ? "lg" : "md"}
      _hover={{
        transform: "translateY(-4px)",
        shadow: "xl",
        borderColor: isPIDataset ? "yellow.400" : "brand.300",
      }}
      transition="all 0.3s ease"
      borderRadius="xl"
      border="2px"
      borderColor={isPIDataset ? "yellow.300" : "gray.200"}
      cursor="pointer"
      p={6}
      position="relative"
      overflow="hidden"
    >
      {/* Special badge for PI datasets */}
      {isPIDataset && (
        <Box
          position="absolute"
          top={3}
          right={3}
          bg="yellow.400"
          color="yellow.900"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="700"
          shadow="sm"
        >
          ⭐ PI Survey
        </Box>
      )}

      <VStack align="stretch" height="100%" spacing={4}>
        <Box>
          <Heading size="md" color="gray.800" mb={3} fontWeight="700">
            {safeDataset.title}
          </Heading>
          <Box
            display="inline-block"
            px={3}
            py={1}
            borderRadius="full"
            bg={`${fileTypeColors[safeDataset.fileType] || "gray"}.500`}
            color="white"
            fontSize="xs"
            fontWeight="600"
          >
            {safeDataset.fileType}
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
          <Text
            fontSize="sm"
            color={isPIDataset ? "yellow.700" : "gray.600"}
            fontWeight={isPIDataset ? "700" : "normal"}
            bg={isPIDataset ? "yellow.100" : "transparent"}
            px={isPIDataset ? 2 : 0}
            py={isPIDataset ? 1 : 0}
            borderRadius={isPIDataset ? "md" : "none"}
            display="inline-block"
          >
            {isPIDataset ? "⭐ " : ""}
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
            colorScheme={isPIDataset ? "yellow" : "brand"}
            variant="solid"
            rightIcon={<ExternalLink size={14} />}
            borderRadius="full"
            width="100%"
            fontWeight="600"
            bg={isPIDataset ? "yellow.400" : undefined}
            color={isPIDataset ? "yellow.900" : undefined}
            _hover={{
              transform: "translateY(-1px)",
              shadow: "md",
              bg: isPIDataset ? "yellow.500" : undefined,
            }}
            onClick={() => window.open(dataset.sourceLink, "_blank")}
          >
            {isPIDataset ? "📊 ดูข้อมูลสำรวจ PI" : "🔗 ดู/ดาวน์โหลด"}
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
