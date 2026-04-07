package dev.kabastack.netbank.auth;

import dev.kabastack.netbank.core.security.JwtService;
import dev.kabastack.netbank.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

  private final UserRepository repository;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationService(
      UserRepository repository,
      JwtService jwtService,
      AuthenticationManager authenticationManager) {
    this.repository = repository;
    this.jwtService = jwtService;
    this.authenticationManager = authenticationManager;
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    var user = repository.findByEmail(request.getEmail()).orElseThrow();

    var jwtToken = jwtService.generateToken(user);

    return AuthenticationResponse.builder().token(jwtToken).build();
  }
}
