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
  Button,
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch datasets from API with improved error handling
  const fetchDatasets = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch("/api/datasets", {
        // Add cache busting for refresh
        cache: isRefresh ? "no-cache" : "default",
      });
      const data = await response.json();

      if (response.ok) {
        // Validate and clean the data
        const validatedDatasets = data.datasets
          .filter((dataset: Dataset) => {
            return (
              dataset &&
              typeof dataset.id === "string" &&
              typeof dataset.title === "string" &&
              Array.isArray(dataset.tags)
            );
          })
          .map((dataset: Dataset) => ({
            ...dataset,
            // Ensure required fields have defaults
            fileType: dataset.fileType || "Unknown",
            tags: dataset.tags.filter(
              (tag: string) => tag && typeof tag === "string"
            ),
            sourceName: dataset.sourceName || "Unknown Source",
            dateUpdated:
              dataset.dateUpdated || new Date().toISOString().split("T")[0],
            dateAcquired:
              dataset.dateAcquired || new Date().toISOString().split("T")[0],
          }));

        setDatasets(validatedDatasets);
        setDataSource(data.source);
        setLastUpdated(new Date());

        // Clear filters if they no longer match any data
        const availableFileTypes = [
          ...new Set(validatedDatasets.map((d: Dataset) => d.fileType)),
        ];
        const availableTags = [
          ...new Set(validatedDatasets.flatMap((d: Dataset) => d.tags)),
        ];

        setSelectedFileTypes((prev) =>
          prev.filter((ft) => availableFileTypes.includes(ft))
        );
        setSelectedTags((prev) =>
          prev.filter((tag) => availableTags.includes(tag))
        );
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(`ไม่สามารถโหลดข้อมูลได้: ${errorMessage}`);
      console.error("Error fetching datasets:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDatasets();
  }, []);

  // Auto-refresh every 5 minutes when the tab is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && !loading && !refreshing) {
        fetchDatasets(true);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loading, refreshing]);

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

    // Sort datasets - PI datasets first, then by date updated
    filteredData.sort((a, b) => {
      // First priority: PI datasets come first
      const aIsPI = a.sourceName === "PI-PublicIntelligence";
      const bIsPI = b.sourceName === "PI-PublicIntelligence";

      if (aIsPI && !bIsPI) return -1;
      if (!aIsPI && bIsPI) return 1;

      // Second priority: newer datasets first
      return (
        new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()
      );
    });

    return filteredData;
  }, [datasets, searchTerm, selectedFileTypes, selectedTags, fuse]);

  // Calculate statistics
  const stats = useMemo(() => {
    const piDatasets = datasets.filter(
      (d) => d.sourceName === "PI-PublicIntelligence"
    );
    const externalDatasets = datasets.filter(
      (d) => d.sourceName !== "PI-PublicIntelligence"
    );

    return {
      total: datasets.length,
      piCount: piDatasets.length,
      externalCount: externalDatasets.length,
    };
  }, [datasets]);

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
              <VStack spacing={2}>
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
                <Flex align="center" gap={3}>
                  {lastUpdated && (
                    <Text fontSize="xs" color="gray.500">
                      อัปเดตล่าสุด: {lastUpdated.toLocaleTimeString("th-TH")}
                    </Text>
                  )}
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => fetchDatasets(true)}
                    isLoading={refreshing}
                    loadingText="กำลังโหลด..."
                  >
                    🔄 รีเฟรช
                  </Button>
                </Flex>
              </VStack>
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

          {/* Statistics Section */}
          {stats.total > 0 && (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                border="1px"
                borderColor="gray.200"
                textAlign="center"
              >
                <Text fontSize="2xl" fontWeight="700" color="brand.500" mb={1}>
                  {stats.total}
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="500">
                  ชุดข้อมูลทั้งหมด
                </Text>
              </Box>

              <Box
                bg="gradient.50"
                p={6}
                borderRadius="xl"
                border="2px"
                borderColor="yellow.300"
                textAlign="center"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top={2} right={2} fontSize="lg">
                  ⭐
                </Box>
                <Text fontSize="2xl" fontWeight="700" color="yellow.700" mb={1}>
                  {stats.piCount}
                </Text>
                <Text fontSize="sm" color="yellow.700" fontWeight="600">
                  ความเห็นประชาชน
                </Text>
              </Box>

              <Box
                bg="white"
                p={6}
                borderRadius="xl"
                border="1px"
                borderColor="gray.200"
                textAlign="center"
              >
                <Text fontSize="2xl" fontWeight="700" color="gray.600" mb={1}>
                  {stats.externalCount}
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="500">
                  ข้อมูลภายนอก
                </Text>
              </Box>
            </SimpleGrid>
          )}

          {/* Search Section */}
          <Flex justify="center">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </Flex>

          {/* Filter Section */}
          <FilterChips
            datasets={datasets}
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
