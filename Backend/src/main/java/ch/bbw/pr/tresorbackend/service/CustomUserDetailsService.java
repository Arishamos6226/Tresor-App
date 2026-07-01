package ch.bbw.pr.tresorbackend.service;

import ch.bbw.pr.tresorbackend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(user -> {
                    String role = user.getRole();
                    if (role == null || role.isBlank()) {
                        role = "USER";
                    }
                    role = role.toUpperCase(Locale.ROOT);

                    return new org.springframework.security.core.userdetails.User(
                            user.getEmail(),
                            user.getPassword(),
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
