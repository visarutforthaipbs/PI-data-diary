"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  SimpleGrid,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Fuse from "fuse.js";

import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { DatasetCard } from "@/components/DatasetCard";
import Footer from "@/components/Footer";
import { Dataset } from "@/types/dataset";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"notion" | "mock">("mock");
  const [error, setError] = useState<string | null>(null);

  // Fetch datasets from API
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/datasets");
        const data = await response.json();

        if (response.ok) {
          setDatasets(data.datasets);
          setDataSource(data.source);
        } else {
          throw new Error("Failed to fetch datasets");
        }
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        console.error("Error fetching datasets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  // Configure Fuse.js for fuzzy search with Thai support
  const fuse = useMemo(() => {
    return new Fuse(datasets, {
      keys: ["title", "project", "description", "sourceName", "tags"],
      threshold: 0.4,
      includeScore: true,
    });
  }, [datasets]);

  // Filter datasets based on search and filters
  const filteredDatasets = useMemo(() => {
    let filteredData = datasets;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchResults = fuse.search(searchTerm);
      filteredData = searchResults.map((result) => result.item);
    }

    // Apply file type filter
    if (selectedFileTypes.length > 0) {
      filteredData = filteredData.filter((dataset) =>
        selectedFileTypes.includes(dataset.fileType)
      );
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      filteredData = filteredData.filter((dataset) =>
        selectedTags.some((tag) => dataset.tags.includes(tag))
      );
    }

    return filteredData;
  }, [datasets, searchTerm, selectedFileTypes, selectedTags, fuse]);

  const handleFileTypeToggle = (fileType: string) => {
    setSelectedFileTypes((prev) =>
      prev.includes(fileType)
        ? prev.filter((type) => type !== fileType)
        : [...prev, fileType]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearAll = () => {
    setSelectedFileTypes([]);
    setSelectedTags([]);
    setSearchTerm("");
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Container maxW="1200px" py={8}>
          <Flex justify="center" align="center" minH="50vh">
            <VStack spacing={4}>
              <Spinner size="xl" color="brand.500" />
              <Text color="gray.600" fontWeight="500">
                กำลังโหลดข้อมูล...
              </Text>
            </VStack>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Container maxW="1200px" py={8}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />

      <Container maxW="1200px" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header Section */}
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="700" color="gray.800" mb={3}>
              ค้นหาและเรียกดูชุดข้อมูลของทีม PI
            </Text>
            <Text fontSize="lg" color="gray.600" mb={3} fontWeight="500">
              แหล่งรวมชุดข้อมูลสำหรับการทำงานวิจัยและโปรเจกต์ต่างๆ
            </Text>
            {dataSource === "notion" ? (
              <Box
                display="inline-block"
                px={4}
                py={2}
                borderRadius="full"
                bg="green.100"
                border="1px"
                borderColor="green.200"
              >
                <Text fontSize="sm" color="green.700" fontWeight="600">
                  🔗 เชื่อมต่อกับฐานข้อมูลสำเร็จ
                </Text>
              </Box>
            ) : (
              <Box
                display="inline-block"
                px={4}
                py={2}
                borderRadius="full"
                bg="secondary.100"
                border="1px"
                borderColor="secondary.200"
              >
                <Text fontSize="sm" color="secondary.700" fontWeight="600">
                  📝 ใช้ข้อมูลตัวอย่าง (ยังไม่ได้เชื่อมต่อ Notion)
                </Text>
              </Box>
            )}
          </Box>

          {/* Search Section */}
          <Flex justify="center">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </Flex>

          {/* Filter Section */}
          <FilterChips
            selectedFileTypes={selectedFileTypes}
            selectedTags={selectedTags}
            onFileTypeToggle={handleFileTypeToggle}
            onTagToggle={handleTagToggle}
            onClearAll={handleClearAll}
          />

          {/* Results Info */}
          <Box>
            <Text color="gray.600" fontSize="sm" fontWeight="500">
              พบชุดข้อมูล {filteredDatasets.length} รายการ
              {(selectedFileTypes.length > 0 ||
                selectedTags.length > 0 ||
                searchTerm) &&
                ` จากทั้งหมด ${datasets.length} รายการ`}
            </Text>
          </Box>

          {/* Dataset Grid */}
          {filteredDatasets.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredDatasets.map((dataset) => (
                <DatasetCard key={dataset.id} dataset={dataset} />
              ))}
            </SimpleGrid>
          ) : (
            <Box
              textAlign="center"
              py={16}
              bg="white"
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
            >
              <Text fontSize="lg" color="gray.500" mb={2} fontWeight="600">
                😔 ไม่พบชุดข้อมูลที่ตรงกับการค้นหา
              </Text>
              <Text fontSize="sm" color="gray.400" fontWeight="500">
                ลองเปลี่ยนคำค้นหาหรือลบตัวกรองบางส่วน
              </Text>
            </Box>
          )}
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
}
