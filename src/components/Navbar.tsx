"use client";

import { Box, Container, HStack, Text, Image } from "@chakra-ui/react";

export function Navbar() {
  return (
    <Box
      bg="white"
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Container maxW="container.xl" py={4}>
        <HStack spacing={4} align="center">
          <Image
            src="/logo/web-logo.svg"
            alt="PI Team Logo"
            height="40px"
            objectFit="contain"
          />
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="brand.600"
            letterSpacing="tight"
          >
            ไดอารี่ข้อมูลของทีม PI
          </Text>
        </HStack>
      </Container>
    </Box>
  );
}
