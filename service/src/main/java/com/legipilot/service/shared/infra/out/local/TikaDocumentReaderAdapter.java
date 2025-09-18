package com.legipilot.service.shared.infra.out.local;

import org.apache.tika.config.TikaConfig;
import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.parser.microsoft.OfficeParser;
import org.apache.tika.sax.BodyContentHandler;
import com.legipilot.service.shared.domain.DocumentReaderPort;
import com.legipilot.service.shared.domain.error.TechnicalError;
import com.legipilot.service.shared.domain.model.DocumentText;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class TikaDocumentReaderAdapter implements DocumentReaderPort {

    @Override
    public DocumentText read(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            String filename = file.getOriginalFilename();
            if (filename.endsWith(".csv") || filename.endsWith(".txt")) {
                String string = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                return new DocumentText(string);
            } else {
                return extractForOthersFiles(is, filename);
            }
        } catch (IOException | NullPointerException e) {
            throw new TechnicalError("Désolé, nous n'avons pas pu lire le fichier.");
        }
    }

    private DocumentText extractForOthersFiles(InputStream inputStream, String fileName) {
        try {
            TikaConfig tikaConfig = TikaConfig.getDefaultConfig();
            AutoDetectParser parser = new AutoDetectParser(tikaConfig);
            BodyContentHandler handler = new BodyContentHandler(-1);
            Metadata metadata = new Metadata();
            ParseContext context = new ParseContext();

            if (fileName.endsWith(".docx") || fileName.endsWith(".doc") ||
                    fileName.endsWith(".xls") || fileName.endsWith(".xlsx") ||
                    fileName.endsWith(".ppt") || fileName.endsWith(".pptx")) {
                context.set(Parser.class, new OfficeParser());
            }

            parser.parse(inputStream, handler, metadata, context);
            return new DocumentText(handler.toString());
        } catch (IOException | SAXException | TikaException e) {
            throw new TechnicalError("Désolé, nous n'avons pas pu lire le fichier.");
        }
    }

}
