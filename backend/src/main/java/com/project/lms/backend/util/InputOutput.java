package com.project.lms.backend.util;

import com.project.lms.backend.exception.FileSaveException;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class InputOutput {

    public static String saveImageToDir(String pathToDir, MultipartFile authorImg) {

        final long MAX_FILE_SIZE = 5 * 1024 * 1024;

        if (authorImg == null || authorImg.isEmpty()) {
            throw new IllegalArgumentException("No file uploaded.");
        }

        if (authorImg.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds 5 MB limit.");
        }


        String originalFilename = StringUtils.cleanPath((Objects.requireNonNull(authorImg.getOriginalFilename())));

//        System.out.println(authorImg.getOriginalFilename());
//        System.out.println(originalFilename);

//        if (originalFilename.contains("..")) {
//            throw new RuntimeException("Invalid filename characters found.");
//        }

        String fileExtension = getString(originalFilename);

        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        Path targetDirectory = Paths.get(pathToDir).toAbsolutePath().normalize();
        Path targetFilePath = targetDirectory.resolve(uniqueFilename);
        try {
            Files.createDirectories(targetDirectory);
        } catch (IOException e) {
            throw new FileSaveException(e.getMessage());
        }

        try (InputStream inputStream = authorImg.getInputStream()) {
            Files.copy(inputStream, targetFilePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new FileSaveException(e.getMessage());
        }

        System.out.println("Successfully saved image: " + uniqueFilename + " to " + targetFilePath);

        return uniqueFilename;
    }

    private static String getString(String originalFilename) {
        String fileExtension = "";
        try {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        } catch (Exception e) {
            // Handle cases where there might not be an extension
            fileExtension = "";
        }

        List<String> allowedExtensions = List.of(
                ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff", ".tif", ".heif", ".heic", ".avif", ".svg"
        );

        if (!allowedExtensions.contains(fileExtension)) {
            throw new IllegalArgumentException("Invalid file type: " + fileExtension);
        }
        return fileExtension;
    }

}






















