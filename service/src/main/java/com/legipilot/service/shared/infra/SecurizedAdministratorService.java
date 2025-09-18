package com.legipilot.service.shared.infra;

import com.legipilot.service.core.administrator.domain.AdministratorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SecurizedAdministratorService implements UserDetailsService {

    private final AdministratorRepository administratorRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        return administratorRepository.getConnected(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("Username %s not found", username)));
    }

}