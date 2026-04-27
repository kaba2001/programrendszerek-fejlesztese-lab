package dev.kabastack.netbank.core;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
    Map<String, String> fieldErrors = new LinkedHashMap<>();
    ex.getBindingResult()
        .getFieldErrors()
        .forEach(err -> fieldErrors.put(err.getField(), err.getDefaultMessage()));
    return ResponseEntity.badRequest().body(Map.of("errors", fieldErrors));
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
    String message = ex.getMessage();
    boolean isAccessDenied =
        message != null
            && (message.toLowerCase().contains("access denied")
                || message.toLowerCase().contains("forbidden"));

    HttpStatus status = isAccessDenied ? HttpStatus.FORBIDDEN : HttpStatus.BAD_REQUEST;
    return ResponseEntity.status(status).body(Map.of("error", message != null ? message : "An error occurred"));
  }
}
