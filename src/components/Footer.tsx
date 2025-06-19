"use client";

import {
  Box,
  Container,
  Text,
  HStack,
  VStack,
  Image,
  Link,
} from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="gray.900" color="white" py={5} mt={16}>
      <Container maxW="container.xl">
        <VStack spacing={6}>
          {/* Logos Section */}
          <HStack spacing={12} justify="center" align="center" flexWrap="wrap">
            <Image
              src="/logo/1.png"
              alt="Organization Logo 1"
              height="30px"
              objectFit="contain"
              filter="brightness(0) invert(1)"
            />
            <Image
              src="/logo/2-1.png"
              alt="Organization Logo 2"
              height="30px"
              objectFit="contain"
              filter="brightness(0) invert(1)"
            />
            <Image
              src="/logo/3.png"
              alt="Organization Logo 3"
              height="30px"
              objectFit="contain"
              filter="brightness(0) invert(1)"
            />
          </HStack>

          {/* Contact Text */}
          <VStack spacing={2} textAlign="center">
            <Text fontSize="md" fontWeight="medium" color="gray.300">
              📩 ต้องการข้อมูลเพิ่มเติมหรือมีชุดข้อมูลใหม่ที่ต้องการแนะนำ?
            </Text>
            <Link
              href="https://www.facebook.com/profile.php?id=100092195477858"
              isExternal
              color="blue.300"
              fontSize="sm"
              fontWeight="medium"
              _hover={{ color: "blue.200", textDecoration: "underline" }}
              mt={2}
            >
              📘 ติดต่อเราผ่าน Facebook
            </Link>
            <Text fontSize="xs" color="gray.600" mt={3}>
              © 2025 PI Team. สงวนลิขสิทธิ์
            </Text>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}
